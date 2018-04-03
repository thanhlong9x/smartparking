var express = require('express');
var bodyParsers = require('body-parser');
var router = express.Router();
//---------------------------------------------------------------------------------------------------------
router.use(bodyParsers.json());
router.use(bodyParsers.urlencoded({extended: true}));
//-----------------------------------------------------------------------------------------------------------
const DATABASE = require('../modules/database');
const OPENALPR = require('../modules/openalpr');
var data = DATABASE();
var openalr = OPENALPR();

//--------------------------------------------------------------------------------------------------------------
/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);
    openalr.identify(1,"http://thamtutatthang.com/uploads/images/tham-tu-dieu-tra-bien-so-xe(1).jpg")
    res.send({code: 1, mes: "Success ", data: {}});

});
//delete table
router.post("/tabledel", function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);
    //data.getDatabase().dropDatabase();
    res.end("ok");

});

//login
router.post("/login", function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);
    data.findUserbyFbid(req.body.id.toString(),
        function (user) {
            res.send({code: 1, mes: "Success find", data: {user}});

        }, function () {
            data.createUser(req.body.id.toString, function () {
                res.send({code: 1, mes: "Success create", data: {}});
            }, function () {
                res.send({code: 0, mes: "Fail to login!", data: {}});
            })

        });

});

module.exports = router;
