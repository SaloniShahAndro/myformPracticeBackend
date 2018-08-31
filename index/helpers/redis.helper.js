let redis = require("redis");
let config = { 'port' : '6379' , 'host' : '127.0.0.1' };

exports.setKey = (data) => {
    return new Promise((resolve ,reject) => {
        let client = redis.createClient(config.port , config.host);
        client.on('connect',function(){
            client.select(3, function() {
                let key = common.generateKey();
                client.hmset( key , data , function (err, res) {
                    storeUsersTokens(client,key,data);
                    if(err)
                    {
                        reject(err);
                    }
                    resolve(key);
                });
            }); 
            // if(isSetExpirey){
            //    var time = 36000; //SECONDS
            //    client.expire(key, time);
            // }
        });
        client.on('error', function (err) {
            client.quit();
            reject(err);
        });
    });
}

exports.getKey = (key) => {
    return new Promise((resolve ,reject) => {
        let client = redis.createClient(config.port , config.host);
        client.on('connect',function(){
            client.select(3, function() {
                client.hgetall(key , function (err, res) {
                    client.quit();
                    if(err)
                    {
                        reject(err);
                    }
                    resolve(res);
                });
            });
        });
        client.on('error', function (err) {
            client.quit();
            reject(err);
        });
    });
}

exports.updateUserTokens = (data) => {
    if(data) {
        delete data.password;
        getUserTokens(data.id).then(tokens => {
            let client = redis.createClient(config.port , config.host);
            client.on('connect',function(){
                client.select(3, function() {
                    tokens.forEach(token => {
                        client.hmset( token , data ); // update all tokens 
                    });
                    client.quit();
                });
            });
            client.on('error', function (err) {
                client.quit();
                reject(err);
            });
        })
    }
}

exports.deleteUserTokens = (user_id) => {
    getUserTokens(user_id).then(tokens => {
        let client = redis.createClient(config.port , config.host);
        client.on('connect',function(){
            client.select(3, function() {
                tokens.forEach(token => {
                    client.del(token,function(err,data){}); // delete all token 
                });
                client.quit();
            });
        });
        client.on('error', function (err) {
            client.quit();
            reject(err);
        });
    })
}

exports.daleteKey = (key,data) => {
    return new Promise((resolve ,reject) => {
        let client = redis.createClient(config.port , config.host);
        client.on('connect',function(){
            client.select(3, function() {                
                client.del(key,function(err,data){
                    client.quit();
                    if(err){
                        reject(err);
                    }else{
                        resolve(data)
                    }         
                });
            });
        });

        client.on('error', function (err) {
            client.quit();
            reject(err);
        });
    });
}


function getUserTokens(userId){
    return new Promise((resolve ,reject) => {
        let client = redis.createClient(config.port , config.host);
        client.on('connect',function(){
            client.select(4, function() {
                client.smembers(userId,function(err,res){
                    client.quit();
                    if(err)
                    {
                        reject(err);
                    }
                    resolve(res);
                });
            });
        });
        client.on('error', function (err) {
            client.quit();
            reject(err);
        });
    });
}

function storeUsersTokens(client , key , data){
    client.select(4, function() {
        client.sadd(data.id , key , function(){
            client.quit();
        })
    });
}