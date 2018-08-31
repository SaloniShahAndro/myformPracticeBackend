const redis = require('./redis.helper');

// --------------------------------- Socket : Fire Events ---------------------------------

// send to to all
exports.toAll = (action , data) => {
    io.emit(action , data);
}

// send to to all except executer
exports.toAllExceptExecuter = ( action , data) => {
    let rooms = getAllRooms(data.user.id);
    rooms.forEach(room => {
        io.in(room).emit(action , data);
    });
}

// send to the executer
exports.toExecuter = ( action , data) => {
    io.in(`user-${data.user.id}`).emit(action , data);
}

// send to specific users
exports.toSpecificUsers = ( user_ids = [] , action , data) => {
    user_ids.forEach(user_id => {
        // console.log(`-------------------> user-${user_id}` , action , data);
        io.in(`user-${user_id}`).emit(action , data);
    })
}

// send to specific users
exports.toSpecificUser = ( user_id , action , data) => {
    io.in(`user-${user_id}`).emit(action , data);
}

// send to specific users
exports.checkIfRoomAvail = ( user_id ) => {
    return io.sockets.adapter.rooms[`user-${user_id}`].length;
}

exports.checkIfRoomsAvail = ( user_ids ) => {
    
}

// --------------------------------- Socket : Fire Events ---------------------------------


// --------------------------------- Socket : Helper Functions ---------------------------------

exports.formatResponse = ( modelObj , payload ) => {
    return { data : modelObj.toJSON() , user : payload.user };
}

/**
 * getAllRooms
 * @param {*} except_id    Pass the room id , return all the rooms except that
 *                          If its blank will return all the rooms
 */
function getAllRooms(except_id = ''){
    let rooms = Object.keys(io.sockets.adapter.rooms);
    return rooms.filter(room => {
        return room.includes("user-") && room != `user-${except_id}`;
    });
}

exports.initSockets = () => {

    io.use((socket, next) => {
        if (socket.handshake.query.token) {
            let key = socket.handshake.query.token;
            redis.getKey(key).then(data => {
                if (data) {
                    socket['user'] = data;
                    next();
                } else
                    next(new Error('authentication error'));
            });
        }
        next(new Error('authentication error'));
    })
    
    io.on('connection', (socket) => {
    
        // console.log("------------------> User Connected" , socket.user );
    
        socket.emit('connected' , socket.id);
    
        socket.join(`user-${socket.user.id}`, () => {
            console.log('---------------------- Joining -----------------' , socket.user.id , socket.id );
            // Code to notify user is online 
            let user_sockets = io.sockets.adapter.rooms[`user-${socket.user.id}`].length;
            console.log(user_sockets);
            if( user_sockets === 1) {
                model.User.update({ 'is_online' : true , 'login_update' : db.sequelize.fn('NOW') } , { where : { id : socket.user.id , 'is_online' : false }});
                this.toAll('user-online' , { user : socket.user });
            }
            
            // let rooms = Object.keys(socket.rooms);
            // console.log(rooms); // [ <socket.id>, 'room 237' ]
            // this.toAll('wow' , {data : 'asdfsdfasdf'})
        });
    
        socket.on("disconnect", () => {
            // To notify user gone offline 
            
            console.log('-------------------- Disconnecting --------------' , socket.user.id);

            // -------------------- Setting timeout to not update on socket re-connection -------------------- 
            setTimeout(() => {
                if( io.sockets.adapter.rooms[`user-${socket.user.id}`] === undefined ) {
                    model.User.update({ 'is_online' : false , 'login_update' : db.sequelize.fn('NOW') } , { where : { id : socket.user.id , 'is_online' : true }}).then(data => {
                        if(+data[0]){
                            console.log('----------------- User gone offline -------------');
                            this.toAll('user-offline' , { user : socket.user });
                        }
                    });
                }
            },1000);
            // -------------------- Setting timeout to not update on socket re-connection -------------------- 
                
        })

        socket.on("user-typing", (data) => {
            // To notify user gone offline
            let socketdata = {
                group_id : data.group_id,
                typing : data.typing
            }

            this.toSpecificUsers( data.users , 'user-typing-event' , { data : socketdata , user : socket.user });            
            
        })
    
        // dummy action to check socket connection
        socket.on("send_lat_long", (data) => {
            console.log(data);
        });
    
        // socket.emit('testing_socket', "Nothing");
    });
}

// --------------------------------- Socket : Helper Functions ---------------------------------