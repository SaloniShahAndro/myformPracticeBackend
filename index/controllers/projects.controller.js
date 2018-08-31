const redis = require('../helpers/redis.helper');
const commonHelper = require('../helpers/common.helper');
const fs = require('fs');
const Op = db.Sequelize.Op;

var ProjectModel = require('../models/project.model')/* normal user model */

exports.Project = (req,res) =>{
    ProjectModel.sync({ force: false }).then(() => {
        ProjectModel.create(req.body).then(projectdata=>{
            res.send(projectdata)
        })
    })
}

//params : user_id : user which is logged in.
exports.getProject = (req,res) =>{
    ProjectModel.findAll({where:{user_id:req.params.user_id}}).then(projectdata=>{
        res.send(projectdata)
    })
}

exports.getProjectDetail = (req,res) =>{
    ProjectModel.findOne({where:{id:req.params.id }}).then(projectdata=>{
        res.send(projectdata)
    })
}

exports.updateProject = (req,res) =>{
    ProjectModel.update({ name: req.body.name, description: req.body.description }, { where: { id: req.params.id } }).then(Data => {
        console.log(">>data>>",Data)
        res.send(Data)
  })
}

exports.deleteProject= (req, res) => {
    ProjectModel.findOne({ where: { id: req.params.id } }).then(data => { 
        console.log(">>>data>>>>",data)
        ProjectModel.destroy({ where: { id: req.params.id },returning:true }).then(deleteddata => {
            res.send(data)
        })
    }).catch(err => {
        console.log(">>>>>", err)
    })
}