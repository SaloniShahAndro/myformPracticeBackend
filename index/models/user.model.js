const seq = require('../sequelize/sequelize.config')
const bcrypt = require('bcrypt')
const User = seq.sequelize.define('user',{
    name : {
        type:seq.Sequelize.STRING
    },
    mobile:{
        type:seq.Sequelize.STRING
    },
    email:{
        type:seq.Sequelize.STRING,
        unique:true
    },
    pwd:{
        type:seq.Sequelize.STRING
    },
    date3:{
        type:seq.Sequelize.DATEONLY
    },
    address:{
        type:seq.Sequelize.TEXT
    },
    gender:{
        type:seq.Sequelize.ENUM,
        values:['Male','Female']
    },
    filename:{
        type:seq.Sequelize.STRING
    }
    // selectedItems:{
    //     type:seq.Sequelize.JSON,
    // }
},{
    hooks:{
        beforeCreate:(user , options) => {
                {
                    user.pwd = user.pwd && user.pwd != "" ? bcrypt.hashSync(user.pwd, 10) : "";
                }
            }
        
    }
})

module.exports = User
