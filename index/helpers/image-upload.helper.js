const multer  = require('multer');
const fs = require('fs');
const options = {quality: 100};

/**
 * Profile pic upload configurations
 */
const profilePicOptions = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, 'index/assets/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ file.originalname)
    }
});

const profilePic = multer({ storage: profilePicOptions }).single('profilepic');

exports.profilePicUpload = (req,res) => {
    return new Promise((resolve,reject) => {
        profilePic(req,res,function(err){
            if(err)
                reject(err);
            else{   
                req.body.profilepic = req.file ? req.file['filename'] : "";
                resolve();
            }
        });
    });
}

/**
 * Multiple Images Configuration
 */
const multipleImages = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, 'index/assets/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ file.originalname);
    }
  });
  var upload = multer({ storage: multipleImages }).array("images",10);

  exports.MultiplePicUpload = (req,res) => {
    return new Promise((resolve,reject) => {
        upload(req,res,function(err){
            if(err)
                reject(err);
            else{   
                req.body.images = req.file ? req.file['filename'] : "";
                resolve();
            }
        });
    });
}
