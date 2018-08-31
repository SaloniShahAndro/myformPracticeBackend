
const express = require('express')
const app = express()



const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded(true))


global.db = require('./index/sequelize/sequelize.config');

app.use('/uploads', express.static('index/assets/uploads'));
app.use('/assets', express.static('index/assets/'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'appid, X-Requested-With,Authorization, X-HTTP-Method-Override, Content-Type, Accept');
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    //global.baseurl =' http://' + req.get('host') + '/';
    next();
});
const openApi = require('./index/routes/open.routes');
app.use('',openApi)



app.listen(4555, () => console.log('Example app listening on port 4555!'))
