var express = require('express');
var bodyParsers = require('body-parser');
var router = express.Router();

//---------------------------------------------------------------------------------------------------------
router.use(bodyParsers.json());
router.use(bodyParsers.urlencoded({extended: true}));
//-----------------------------------------------------------------------------------------------------------
const DATABASE = require('../modules/database');
var data = DATABASE();
const posttable = data.postTable();
//--------------------------------------------------------------------------------------------------------------
/* GET home page. */
router.post("/poststatus", function (req, res) {
	if (!req.body) return res.sendStatus(400);

	data.createPost(req.body, function (post) {
			data.postTable().findOne({
					where: {idpost: post.idpost},
					include:
						[data.userTable(), {model: data.cmtTable(), include: [data.userTable()]}, {
							model: data.likeTable(),
							include: [data.userTable()]
						}]


				})
				.then(arr => {
					console.log("findOne: ", arr);

					res.send({code: 1, mes: "success", data: {list: arr}});

				})
				.catch(err => {
					console.log("finDONE FAIL: ", err.message);
					res.send({code: 0, mes: "Fail!", data: {}});
				});
		},
		function () {
			res.send({code: 0, mes: "error", data: {}});
		});

	console.log("POST BODY:  ", req.body);


});
//getliststatus
router.post("/getliststatus", function (req, res) {
	if (!req.body) return res.sendStatus(400);
	if (!req.body.id) {
		res.send({code: 0, mes: "NULL!", data: {}});
	} else {
		data.postTable().findAll({
				where: {state: "2"},
				include: [data.userTable(), {model: data.cmtTable(), include: [data.userTable()]}, {
					model: data.likeTable(),
				}],

				order: [['createdAt', 'DESC']]
			})
			.then(arr => {
				console.log("findAll: ", arr);

				res.send({code: 1, mes: "success", data: {list: arr}});

			})
			.catch(err => {
				console.log("findAll FAIL: ", err.message);
				res.send({code: 0, mes: "Fail!", data: {}});
			});


	}
	console.log(req.body);

});

router.post("/getstatus", function (req, res) {
	if (!req.body) return res.sendStatus(400);
	if (!req.body.id) {
		res.send({code: 0, mes: "NULL!", data: {}});
	} else {

		data.postTable().findOne(
			{
				where: {idpost: req.body.id},
				include: [data.userTable(), {model: data.cmtTable(), include: [data.userTable()]}, {
					model: data.likeTable(),

				}]
			}
		).then(post => {
				console.log(post.idfb, req.body.idfb);
				if (post.idfb == req.body.idfb) {
					console.log("findONE: ", post);
					res.send({code: 1, mes: "success", data: {post}});
				} else {
					res.send({code: 1, mes: "success", data: {post}});
				}


			})
			.catch(err => {
				console.log("findONE FAIL: ", err.message);
				res.send({code: 0, mes: "Fail!", data: {}});
			});
		// data.postTable().findAll({
		// 	raw: true,
		// 	where: {idpost: req.body.id},
		// 	include: [data.userTable(),data.cmtTable()]
		// }).then(post => {
		// 		console.log("findONE: ", post);
		// 		console.log("RETURN STATUS: ");
		// 		res.send({code: 1, mes: "success", data: post});
		//
		// 	})
		// 	.catch(err => {
		// 		console.log("findONE FAIL: ", err.message);
		// 		res.send({code: 0, mes: "Fail!", data: {}});
		// 	});

	}
	console.log(req.body);

})
///------ get my list
router.post("/getmemberpost", function (req, res) {
	if (!req.body) return res.sendStatus(400);
	//todo  kiem tra my post or friend post
	if (!req.body.idmember) {
		res.send({code: 0, mes: "NULL!", data: {}});
	} else {
		console.log("getmemberpost: ", 1);
		if (req.body.idmember == req.body.idfb) {
			data.postTable().findAll({
				where: {
					idfb: req.body.idfb
				}
			}).then(arruser => {
					console.log("findAll: ", arruser);
					res.send({code: 1, mes: "success", data: {list: arruser}});

				})
				.catch(err => {
					res.send({code: 0, mes: "Fail!", data: err});

				});
		}
		else {


			console.log("getmemberpost: ", 3);
			data.followTable().findOne({where: {idfb: req.body.idfb, id2: req.body.idmember}}).then(user => {
				console.log("follow: ", 4, user);
				if (user == null) {
					data.postTable().findAll({
						where: {
							idfb: req.body.idmember,
							state: '2'

						},
						order: [['createdAt', 'DESC']]
					}).then(arruser => {
							console.log("getmemberpost: ", 6);
							console.log("findAll: ", arruser);
							res.send({code: 1, mes: "success", data: {list: arruser}});

						})
						.catch(err => {
							console.log("getmemberpost: ", err);
							res.send({code: 0, mes: "Fail!", data: err.message});

						});

				}
				else {
					data.postTable().findAll({
						where: {
							idfb: req.body.idmember,
							[(data.Ops()).or]: [{state: '2'}, {state: '1'}]


						},
						order: [['createdAt', 'DESC']]
					}).then(arruser => {
							console.log("getmemberpost: ", 6);
							console.log("findAll: ", arruser);
							res.send({code: 1, mes: "success", data: {list: arruser}});

						})
						.catch(err => {
							console.log("getmemberpost: ", err);
							res.send({code: 0, mes: "Fail!", data: err.message});

						});
				}

			}).catch(err => {
				console.log("getmemberpost: ", 5);
				res.send({code: 0, mes: "Fail!", data: err});
			})
		}


	}
	console.log(req.body);

});
//////---------- like post
router.post("/like", function (req, res) {
	if (!req.body) return res.sendStatus(400);
	var key = req.body.idpost.toString() + "and" + req.body.idmember.toString();
	console.log("KEY", key);

	data.likeTable().create({
		idlike: key,
		idpost: req.body.idpost,
		idfb: req.body.idmember

	}).then(like => {
			data.likeTable().findAll({
				where: {idpost: req.body.idpost},
				include: [data.userTable()]
			}).then(likes => res.send({code: 1, mes: "like", data: {likes}}));
		}
		)
		.catch(err => {
				data.likeTable().destroy({where: {idlike: key}}).then(post => {
						data.likeTable().findAll({
							where: {idpost: req.body.idpost},
							include: [data.userTable()]
						}).then(likes => res.send({
							code: 1,
							mes: "unlike",
							data: {likes}
						})).catch(err => res.send({code: 0, mes: "err!", data: err.message}))
					}
					)
					.catch(err => res.send({code: 0, mes: "err!", data: err.message}))


			}
		)

});
////---------------------coment
router.post("/comment", function (req, res) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	if (req.body.act == "del") {

		data.cmtTable().findOne({
			where: {
				idcmt: req.body.idcmt
			},
			order: [['createdAt', 'DESC']]
		}).then(result => {


				result.destroy();
				data.cmtTable().findAll({
					where: {idpost: req.body.idpost},
					include: [data.userTable()]
				}).then(comments => res.send({code: 1, mes: "Success!", data: {comments}}))
					.catch(err => {
						res.send({code: 0, mes: "Fail!", data: err.toString()})
					})
			}
			)
			.catch(err => {
					res.send({code: 0, mes: "Fail!", data: {}});
				}
			)
	}

	if (req.body.act == "create") {
		data.cmtTable().create({
			idpost: req.body.idpost,
			idfb: req.body.idfb,
			cmt: req.body.cmt
		}).then(post => {
			data.cmtTable().findAll({
				where: {idpost: req.body.idpost},
				include: [data.userTable()],
				order: [['createdAt', 'DESC']]
			}).then(comments => res.send({code: 1, mes: "Success!", data: {comments}}))
				.catch(err => {
					res.send({code: 0, mes: "Fail!", data: err.toString()})
				})
		}).catch(err => {
			res.send({code: 0, mes: "Fail!", data: err.toString()})
		})

	}
})
module.exports = router;
