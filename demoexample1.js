var express = require('express')
var bodyParser = require('body-parser')
var https = require('https'); 
var fs = require('fs')
// Create a new instance of express
var app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
 //private key and certificate for secure connection (https)
var options = {
    key: fs.readFileSync('./certificates/server.key'),
    cert: fs.readFileSync('./certificates/server.crt'),
    requestCert: false,
    rejectUnauthorized: false,
 };
var httpsApp = https.createServer(options,app);
console.log(">>>httpsApp._events.request.post>>>>>>",httpsApp._events.request.post)
// function (path){
//   if (method === 'get' && arguments.length === 1) {
//     // app.get(setting)
//     return this.set(path);
//   }

//   this.lazyrouter();

//   var route = this._router.route(path);
//   route[method].apply(route, slice.call(arguments, 1));
//   return this;
// }

console.log(">>>httpsApp._events.request.get>>>>>>",httpsApp._events.request.get)
// function (path){
//   if (method === 'get' && arguments.length === 1) {
//     // app.get(setting)
//     return this.set(path);
//   }

//   this.lazyrouter();

//   var route = this._router.route(path);
//   route[method].apply(route, slice.call(arguments, 1));
//   return this;
// }


app.post('/xyz',(req,res)=>{
  var abc = req.query.abc;
      console.log("abc",abc);
})

httpsApp.listen(5004, function(){
   console.log("listening on port 5004");
});