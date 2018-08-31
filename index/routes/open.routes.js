var Router = require('express').Router();
var controllers = require('../controllers');

const routes = [
    //user
    Router.post("/add" , controllers.users.registerForm1 ),
    Router.get("/profilepic" , controllers.users.registerForm1GetProfilepic ),
    Router.post("/profilepic" , controllers.users.registerForm1PostProfilepic ),
    Router.post("/adduser" , controllers.users.Register ),
    Router.get("/adduser" , controllers.users.getListUsers ),
    Router.get("/adduser/:id" , controllers.users.getUser ),
    Router.delete("/adduser/:id" , controllers.users.deleteUser ),
    Router.post("/adduser/:id" , controllers.users.updateUser ),
    Router.post("/multiplepics" , controllers.users.multiplepicsUser ),
    Router.post("/login",controllers.users.login),
    //projects
    Router.post("/project",controllers.projects.Project),
    Router.get("/project/:user_id",controllers.projects.getProject),
    Router.get("/update-project/:id",controllers.projects.getProjectDetail),
    Router.post("/update-project/:id",controllers.projects.updateProject),
    Router.delete("/project/:id" , controllers.projects.deleteProject ),


];

module.exports = routes;