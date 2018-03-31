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

router.post("/getliststatus2", function (req, res) {
	if (!req.body) return res.sendStatus(400);
	if (!req.body.id) {
		res.send({code: 0, mes: "NULL!", data: {}});
	} else {
		data.postTable().findAll({
				where: {state: "2"},
				include: [
					data.userTable(),
					{model: data.cmtTable(), include: [data.userTable()], order: [['idcmt', 'ASC']]},

					{model: data.likeTable(), include: [data.userTable()]}


				],

				order: [['createdAt', 'DESC']]
			})
			.then(arrr => {
				data.followTable().findAll({

					where: {
						idfb: req.body.id
					},
					include: [
						{
							model: data.userTable(),

							include: [
								{
									model: data.postTable(),

									where: {state: "1"},

									include: [
										data.userTable(),
										{
											model: data.cmtTable(),
											include: [data.userTable()],
											order: [['idcmt', 'ASC']]
										},

										{model: data.likeTable(), include: [data.userTable()]}


									]
								}
							]
						}
					]
				}).then(arr => {
						//console.log("findAll: ", arr.forEach(item=>item.user.posts));
						var ret = [];
						data.postTable().findAll({
								where: {
									idfb: req.body.id,
									state: ["1", "0"]
								},
								include: [
									data.userTable(),
									{model: data.cmtTable(), include: [data.userTable()], order: [['idcmt', 'ASC']]},

									{model: data.likeTable(), include: [data.userTable()]}


								],

								order: [['createdAt', 'DESC']]
							})
							.then(arrme => {
								if (arr == null || arr.length == 0) {
									//	res.send({code: 1, mes: "success", data: {list: ret}})
									ret = ret.concat(arrr);
									ret = ret.concat(arrme);
									var arrs = ret.sort(function (b, a) {
										return parseFloat(a.idpost) - parseFloat(b.idpost);
									});
									var start = req.body.page * req.body.pagesize;
									var end = start + req.body.pagesize;
									console.log("GETLISTSIZE", start, end)
									res.send({code: 1, mes: "success", data: {list: arrs.slice(start, end)}});


									//res.send({code: 1, mes: "success", data: {list: arrs}});


								}
								var flarr = [];
								var s = arrr;
								for (var i = 0; i < arr.length; i++) {
									flarr = flarr.concat(arr[i].id2);
									if (i == arr.length - 1) {
										//	res.send({code: 1, mes: "success", data: {list: ret}})
										data.postTable().findAll({
											where: {
												idfb: flarr,
												state: "1"
											},
											include: [
												data.userTable(),
												{
													model: data.cmtTable(),
													include: [data.userTable()],
													order: [['idcmt', 'ASC']]
												},

												{model: data.likeTable(), include: [data.userTable()]}


											],

											order: [['createdAt', 'DESC']]
										}).then(data => {
											ret = ret.concat(data);
											ret = ret.concat(s);
											var arrs = ret.sort(function (b, a) {
												return parseFloat(a.idpost) - parseFloat(b.idpost);
											});
											var start = req.body.page * req.body.pagesize;
											var end = start + req.body.pagesize;
											console.log("GETLISTSIZE 2", flarr)
											res.send({code: 1, mes: "success", data: {list: arrs.slice(start, end)}});
										}).catch(err => res.send({code: 0, mes: "Fail!", data: err.message}))


										//res.send({code: 1, mes: "success", data: {list: arrs}});


									}
								}
								console.log("GETLISTME", arr.length)
							}).catch(errme => {
							console.log("GETLISTME", "FAIl", errme.message);
							res.send({code: 0, mes: "Fail!", data: errme.message});
						})


					})
					.catch(err => {
						console.log("findAll FAIL: ", err.message);
						res.send({code: 0, mes: "Fail!", data: err.message});
					});


			})
			.catch(err => {
				console.log("findAll FAIL: ", err.message);
				res.send({code: 0, mes: "Fail!", data: err.message});
			});


	}
	console.log(req.body);

});

router.post("/getliststatus", function (req, res) {

	if (!req.body) return res.sendStatus(400);
	if (!req.body.id) {
		res.send({code: 0, mes: "NULL!", data: {}});
	} else {
		console.log("1")
		var ret = [];
		data.findPubPost(function (public) {
			ret = ret.concat(public);
			console.log("2")

			data.getMynonPublicPost(req.body.id, function (mynonpublic) {
				ret = ret.concat(mynonpublic);
				console.log("3")
				data.findMyFollow(req.body.id, function (myfl) {
					console.log("4")
					if (myfl == null || myfl.length == 0) {
						//	res.send({code: 1, mes: "success", data: {list: ret}})

						var arrs = ret.sort(function (b, a) {
							return parseFloat(a.idpost) - parseFloat(b.idpost);
						});
						var start = req.body.page * req.body.pagesize;
						var end = start + req.body.pagesize;
						console.log("GETLISTSIZE", start, end)
						res.send({code: 1, mes: "success", data: {list: arrs.slice(start, end)}});


					}
					for (var i = 0; i < myfl.length; i++) {
						if (myfl[i].user == null) {
							console.log("GETLIST NULL");
						}
						else {
							ret = ret.concat(myfl[i].user.posts);
							console.log("GETLIST ", myfl[i].user.idfb);
						}
						if (i == myfl.length - 1) {
							console.log("GETLISTSIZE 2", ret.length)
							var arrs = ret.sort(function (b, a) {
								return parseFloat(a.idpost) - parseFloat(b.idpost);
							});
							var start = req.body.page * req.body.pagesize;
							var end = start + req.body.pagesize;

							res.send({code: 1, mes: "success", data: {list: arrs.slice(start, end)}});
							//res.send({code: 1, mes: "success", data: {list: arrs}});
						}
					}


				}, function (err) {
					res.send({code: 0, mes: "error", data: err.message});
				})
			}, function (err) {
				res.send({code: 0, mes: "error", data: err.message});
			});


		}, function (err) {
			res.send({code: 0, mes: "error", data: err.message});
		})


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
				include: [data.userTable(), {
					model: data.cmtTable(),
					include: [data.userTable()],
					order: [['idcmt', 'ASC']]
				}, {

					model: data.likeTable(), include: [data.userTable()], order: [['idcmt', 'ASC']]
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


		data.cmtTable().destroy({
			where: {
				idcmt: req.body.idcmt,
				idpost: req.body.idpost
				//,idfb: req.body.idfb
			}

		}).then(a => {
			console.log("CMT", a);
			if (a == 0) {
				res.send({code: 0, mes: "Fail!", data: {}})
			} else
				data.cmtTable().findAll({
					where: {idpost: req.body.idpost},
					include: [data.userTable()]
					, order: [['idcmt', 'ASC']]
				}).then(comments => res.send({code: 1, mes: "Success!", data: {comments}}))
					.catch(err => {
						res.send({code: 0, mes: "Fail!", data: err.toString()})
					})
		}).catch(a => res.send({code: 0, mes: "Fail!", data: {}}));


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
				order: [['idcmt', 'ASC']]
			}).then(comments => res.send({code: 1, mes: "Success!", data: {comments}}))
				.catch(err => {
					res.send({code: 0, mes: "Fail!", data: err.toString()})
				})
		}).catch(err => {
			res.send({code: 0, mes: "Fail!", data: err.toString()})
		})

	}
});


router.post("/search", function (req, res, next) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	var name = '%' + req.body.key + '%';
	console.log("SEARCH", name);
	data.postTable().findAll({

		where: {
			rtag: {
				[(data.Ops()).like]: name
			},
			state: ["1", "2"]
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

	data.postTable().destroy({
		where: {
			idfb: req.body.idfb,
			idpost: req.body.idpost
			//,idfb: req.body.idfb
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
