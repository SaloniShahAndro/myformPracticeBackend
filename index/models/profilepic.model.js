const seq = require('../sequelize/sequelize.config')
const Profilepic = seq.sequelize.define('profilepic',{
    profilepic : {
        type:seq.Sequelize.STRING
    },
    
})

module.exports = Profilepic