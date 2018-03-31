var express = require('express');
var bodyParsers = require('body-parser');
var router = express.Router();
//--------------------------------------------------------------------------------------------------------
router.use(bodyParsers.json());
router.use(bodyParsers.urlencoded({extended: true}));
//-----------------------------------------------------------------------------------------------------------
const DATABASE = require('../modules/database');
var data = DATABASE();
//--------------------------------------------------------------------------------------------------------------
/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});
router.post('/login', function (req, res, next) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);


});

router.post("/userdetail", function (req, res, next) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	data.findUserbyFbid(req.body.id.toString(), function (user) {
		data.followTable().findOne({
			where: {
				idfb: req.body.idfb,
				id2: req.body.id
			},
			include: [
				{
					model: data.userTable()

				}
			]
		}).then(fl => {


				data.findMyFollowMe(req.body.id, function (data) {
					user.lfolowme = data;
					console.log("FL 1",data);
					if (fl == null) {
						res.send({code: 1, mes: "Success", data: {user, follow: false}});
					} else {
						res.send({code: 1, mes: "Success", data: {user, follow: true}});
					}
				}, function (err) {
					console.log("FL 2",data);
					if (fl == null) {
						res.send({code: 1, mes: "Success", data: {user, follow: false}});
					} else {
						res.send({code: 1, mes: "Success", data: {user, follow: true}});
					}
				})



		}).catch(err => res.send({code: 1, mes: "Success", data: {user, follow: false}}))


	}, function () {
		res.send({code: 0, mes: "Fail to get data!", data: {}});
	}, function () {
		res.send({code: 0, mes: "Fail to get data!", data: {}});
	});

});
router.post("/follow", function (req, res, next) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	data.followTable().create({
		idfollow: req.body.idfb + "and" + req.body.idmember,
		idfb: req.body.idfb,
		id2: req.body.idmember
	}).then(follow => res.send({code: 1, mes: "Follow", data: {follow}}))
		.catch(err => {
			data.followTable().destroy({
				where: {
					idfollow: req.body.idfb + "and" + req.body.idmember
				}
			});
			res.send({code: 0, mes: "unfollow!", data: err.message});
		})
//TODO

});
router.post("/search", function (req, res, next) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	var name = '%' + req.body.key + '%';
	console.log("SEARCH", name);
	data.userTable().findAll({

		where: {
			name: {
				[(data.Ops()).like]: name
			}
		}
	}).then(arr => res.send({code: 1, mes: "Success", data: {list: arr}}))
		.catch(err => {

			res.send({code: 0, mes: "Fail to get data!", data: err.message});
		})
//TODO

});
router.post("/delete", function (req, res, next) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);

	data.userTable().destroy({
		where: {
			idfb: req.body.idfb
		}

	}).then(a => {

		if (a == 0) {
			res.send({code: 0, mes: "Fail!", data: {}})
		} else
			res.send({code: 1, mes: "Success!", data: {}});

	}).catch(a => res.send({code: 0, mes: "Fail!", data: {}}));

//TODO

});
module.exports = router;
