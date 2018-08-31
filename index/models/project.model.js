const seq = require('../sequelize/sequelize.config');
const Users = require('./users.model')
const Projects = seq.sequelize.define('project',{
    name : {
        type:seq.Sequelize.STRING
    },
    description:{
        type:seq.Sequelize.TEXT
    },
    user_id:{
        type:seq.Sequelize.INTEGER,
    }
},{
    underscored: true,
    paranoid:true
})


Projects.belongsTo(Users,{foreignKey:'user_id'})
Users.hasMany(Projects,{foreignKey:'user_id'})

module.exports = Projects
