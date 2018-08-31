const seq = require('../sequelize/sequelize.config');
const bcrypt = require('bcrypt')

const Users = seq.sequelize.define('usernew',{
    firstName : {
        type:seq.Sequelize.STRING
    },
    lastName:{
        type:seq.Sequelize.STRING
    },
    email:{
        type:seq.Sequelize.STRING,
        unique:true
    },
    pwd:{
        type:seq.Sequelize.STRING
    },
   
},{
    underscored: true,
    paranoid:true,
    hooks:{
        beforeCreate:(user , options) => {
                {
                    user.pwd = user.pwd && user.pwd != "" ? bcrypt.hashSync(user.pwd, 10) : "";
                }
            }
        
    }
}
)

module.exports = Users
