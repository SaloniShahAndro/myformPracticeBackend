const seq = require('../sequelize/sequelize.config')
const User = require('./users.model');

const Images = seq.sequelize.define('image',{
    filename : {
        type:seq.Sequelize.STRING
    },
    user_id :{
        type:seq.Sequelize.INTEGER
    }
    
},{
    underscored: true,
    getterMethods:{
        image_path() {
            return this.filename ? 'http://localhost:4555/uploads/' + this.filename : '';
        },
    },
    paranoid:true,
})

Images.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Images,{ foreignKey: 'user_id' })

module.exports = Images