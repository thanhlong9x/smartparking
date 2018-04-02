var express = require('express');
var bodyParsers = require('body-parser');
var router = express.Router();
//---------------------------------------------------------------------------------------------------------
router.use(bodyParsers.json());
router.use(bodyParsers.urlencoded({extended: true}));
//-----------------------------------------------------------------------------------------------------------
const DATABASE = require('../modules/database');
var data = DATABASE();
//--------------------------------------------------------------------------------------------------------------
/* GET home page. */
router.get('/', function (req, res, next) {

	res.send('respond with a resource');

});

//login
router.post("/login", function (req, res, next) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	data.findUserbyFbid(req.body.id.toString(),
		function (user) {
		res.send({code: 1, mes: "Success find", data: {user}});

	}, function () {
		res.send({code: 0, mes: "Fail to login!", data: {}});
	});

});

module.exports = router;
