const fs = require('fs');
const Jimp = require("jimp");
const path = require('path');
const mime = require('mime-types');
const ffmpeg = require('fluent-ffmpeg');
let CryptoJS = require("crypto-js");
let secretKey = 'nsyvhfwotx';

const resize_image = (filename , folder) => {
    Jimp.read(`server/assets/uploads/${folder}/${filename}`).then((img) => {
        try{
            let mimetype = mime.contentType(path.extname(filename));
            if(mimetype === 'image/jpeg' || mimetype === 'image/png' || mimetype === 'image/gif') {
                img.resize(Jimp.AUTO, 100).quality(100).write(`server/assets/uploads/${folder}/thumb/${filename}`); // save ;
                console.log('------------ resizing done ------------');
            }
            else if(mimetype === 'video/mp4'){
                let thumbnail_name = path.parse(filename).name;
                ffmpeg(`server/assets/uploads/${folder}/${filename}`).screenshots({
                    timestamps: [30.5, '50%', '01:10.123'],
                    filename: thumbnail_name+'.png',
                    folder: `server/assets/uploads/${folder}/thumb/`,
                    size: '300x300'
                });
            }
        } catch(err) {
            console.log('ERROR==========>',err);
        }
    }).catch(err => {
        console.log('ERROR==========>',err);
    });     
}

exports.getFormat = (data) => {
    var format = JSON.parse(JSON.stringify(data));
    return format;
}

exports.transaction = (query) => {
    return db.sequelize.transaction(function (t) {
        return query;
    });
}

exports.tmpToOriginal = ( filename , folder , thumb = false ) => {
    fs.rename(`server/assets/tmp/${filename}` ,`server/assets/uploads/${folder}/${filename}`,() => {
        if(thumb) {
            resize_image(filename , folder);
            //console.log('------------ resizing ------------');
        }
    });
}

exports.multiTmpToOriginal = ( files = [] , folder , thumb = false ) => {
    files.forEach(file => {
        let filename = file.filename;
        fs.rename(`server/assets/tmp/${filename}` ,`server/assets/uploads/${folder}/${filename}`,() => {
            if(thumb) {
                resize_image(filename , folder);
                console.log('------------ resizing ------------');
            }
        });
    })
}

exports.createUser = ( data ,req ) => {
    let promise = [];
    data.forEach(email_id => {        
        let fullName = email_id.split('@');
        let params = {
            'fullname'      :   fullName[0],
            'status'        :   1,
            'user_type'     :   5,
            'expiry_date'   :   req.user.expiry_date  
        }
        promise.push(model.User.findOrCreate({where: {email_id: email_id}, defaults: params})
        .spread((user, created) => {
            let UserData = user.get({plain: true});
            return UserData.id;
        }))
    });

    return Promise.all(promise).then(data => {
        if(data.length > 0){
            return data;
        }
    });
} 

exports.removeFile = ( folder , filename  ) => {
    fs.unlink(`server/assets/uploads/${folder}/${filename}`,()=>{});
    fs.unlink(`server/assets/uploads/${folder}/thumb/${filename}`,()=>{});
}

exports.fileSize = ( folder, filename  ) => {
    //let file = `server/assets/uploads/${folder}/${filename}`
    let file = `server/assets/tmp/${filename}`
    let stats = fs.statSync(file)
    let fileSizeInBytes = stats["size"]
    let fileSize = (fileSizeInBytes * 0.001).toFixed(2)+' KB';
    let returndata = { 'k' : fileSize , 'b' : fileSizeInBytes };
    return returndata;
}

exports.resizeImage = resize_image;

exports.fileIcon = (filename) => {

    let extension =  filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    
    switch(extension) {
        case 'pdf':
            return `${process.env.IMAGE_URL}pdf-icon.png`;
        case 'doc':
            return `${process.env.IMAGE_URL}doc-icon.png`;
        case 'docx':
            return `${process.env.IMAGE_URL}doc-icon.png`;
        case 'ppt':
            return `${process.env.IMAGE_URL}ppt-icon.png`;
        case 'csv':
            return `${process.env.IMAGE_URL}csv-icon.png`;
        case 'xls':
            return `${process.env.IMAGE_URL}xls-icon.png`;
        case 'xlsx':
            return `${process.env.IMAGE_URL}xls-icon.png`;
        case 'gif':
            return `${process.env.IMAGE_URL}gif-icon.png`;
        case 'png':
            return `${process.env.IMAGE_URL}png-icon.png`;
        case 'jpg':
            return `${process.env.IMAGE_URL}jpg-icon.png`;
        case 'jpeg':
            return `${process.env.IMAGE_URL}jpg-icon.png`;
        case 'jpeg':
            return `${process.env.IMAGE_URL}jpg-icon.png`;
        case 'mp3':
            return `${process.env.IMAGE_URL}mp3-icon.png`;
        case 'mp4':
            return `${process.env.IMAGE_URL}mp4-icon.png`;
        case 'psd':
            return `${process.env.IMAGE_URL}psd-icon.png`;
        case 'zip':
            return `${process.env.IMAGE_URL}zip-icon.png`;
        case 'txt':
            return `${process.env.IMAGE_URL}text-icon.png`;
        default:
            return `${process.env.IMAGE_URL}file-icon.png`
    }        
}   


exports.generateKey = () => {    
    var timeStamp = Math.floor(Date.now());
    return CryptoJS.AES.encrypt(timeStamp.toString(), secretKey).toString();
}

/// check extension while adding or edit the items
function getExt(filename){
    return filename.split('.').pop().split("?")[0].split("#")[0];
}