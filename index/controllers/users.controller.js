const bcrypt = require('bcrypt');
const redis = require('../helpers/redis.helper');
const commonHelper = require('../helpers/common.helper');
const fs = require('fs');
const Op = db.Sequelize.Op;

var Usermodel = require('../models/user.model')/* normal user model */
var Usersmodel = require('../models/users.model');
var ProfilepicModel = require('../models/profilepic.model');
var ImageModel = require('../models/images.model');

const upload = require('../helpers/image-upload.helper').profilePicUpload;
const MultiplePicUpload = require('../helpers/image-upload.helper').MultiplePicUpload;

exports.registerForm1 = (req,res) =>{
    Usermodel.sync({ force: false }).then(() => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>..create")
        // if(req.body.email!=Usermodel.email){
        Usermodel.create({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            pwd: req.body.pwd,
            date3: req.body.date3,
            address: req.body.address,
            gender: req.body.gender,
            filename: req.body.filename
            // selectedItems:req.body.selectedItems
        }).then(() => {
            res.send({ 'message': 'account created successfully', 'data': req.body, 'status': 'success' })
        }).catch((err) => {
            res.send({ 'message': 'Email already exists', 'status': 'fail' })
            console.log(">>>>>", err)

        })
        //  }
    })
}

exports.registerForm1GetProfilepic = (req,res) =>{
    res.end('file catcher example');
}

exports.registerForm1PostProfilepic = (req,res) =>{
    upload(req, res).then(() => {
        ProfilepicModel.sync({ force: false }).then(() => {
            ProfilepicModel.create({
                'profilepic': req.body.profilepic
            }).then(profilepicdata => {
                console.log(profilepicdata);
                res.send(profilepicdata);
            })
        })
    });

}

exports.login = (req, res) => {

    let required_fields = {
        'email': 'email',
        'pwd': 'string',
    };

    let params = req.body;
   
        Usersmodel.findOne({
            where: [
                { 'email': params.email }
            ]
        }).then(data => {
            data = commonHelper.getFormat(data);

            if (data && bcrypt.compareSync(params.pwd, data.pwd)) {
               // delete data.pwd;
                res.send(data)
            } else
                res.send(null);
        }).catch(err => {
            console.log(err)
            res.send(err);
        });
  
}


exports.Register = (req,res) =>{
    MultiplePicUpload(req, res).then(() => {
        let fileArr = []
        if (req.files) {
            for (var i = 0; i < req.files.length; i++) {
                fileArr.push({
                    'filename': req.files[i].filename,
                    //'wireframe_id':2
                })
            }
        }
        let InsertArr = {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'email': req.body.email,
            'pwd':req.body.pwd,
            'images': fileArr
        };
        Usersmodel.sync({ force: false }).then(() => {
            ImageModel.sync({ force: false }).then(() => {
                addUser(res, req, InsertArr)
            })
        })
    })
}

function addUser(res, req, InsertArr) {
    addUserTransaction(InsertArr, req, res).then(data => {
        console.log(">>>>data>>>>", data)
        res.send({ 'message': 'account created successfully', 'data': data, 'status': 'success' })
    }).catch(err => {
        console.log(err);
        res.send({ 'message': 'Email already exists', 'status': 'fail' })
    })
}

function addUserTransaction(InsertArr, req, res) {
    return db.sequelize.transaction(function (t) {
        return Usersmodel.create(InsertArr, {
            transaction: t,
            include: [
                { model: ImageModel }
            ]
        }).then(data => {
            return data
        }).catch(err => {
            console.log(err);
            //cres.error(res,'Error',{});
        })
    });
}

exports.getListUsers = (req,res) =>{
    Usersmodel.findAll({
        include: {
            model: ImageModel
        }
    }).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(">>>>>", err)

    })
}

exports.getUser= (req, res) => {
    Usersmodel.findOne({
        where: { id: req.params.id }, include: {
            model: ImageModel
        }
    }).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(">>>>>", err)

    })
}


exports.deleteUser= (req, res) => {
    Usersmodel.findOne({ where: { id: req.params.id }, raw: true }).then(data => { 
        Usersmodel.destroy({ where: { id: req.params.id },returning:true }).then(deleteddata => {
            ImageModel.destroy({ where: { 'user_id': req.params.id } })
            res.send(data)
        })
    }).catch(err => {
        console.log(">>>>>", err)
    })
}

exports.updateUser=  (req, res) => {
        Usersmodel.update({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email }, { where: { id: req.params.id } }).then(Data => {
            res.send(Data)
      })
}

exports.multiplepicsUser= function (req, res) {
    MultiplePicUpload(req, res).then(() => {
        console.log(">>>>files>>>>>>", req.files)
        res.send(req.files)
    })
}