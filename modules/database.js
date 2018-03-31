"use strict";
const sequeliz = require("sequelize");
const Op = sequeliz.Op;
function creat() {
	return new sequeliz({
		database: "d26n3cbmoiqf8",
		username: "dcgkfysmyggatn",
		password: "677c65c81321a49336247882b837ec772c8079f0b227548eae39871a8468f32c",
		host: "ec2-54-235-153-124.compute-1.amazonaws.com",
		port: 5432,
		dialect: "postgres",
		dialectOptions: {
			ssl: true
		},
		define: {
			freezeTableName: true
		},
		uri: "postgres://dcgkfysmyggatn:677c65c81321a49336247882b837ec772c8079f0b227548eae39871a8468f32c@ec2-54-235-153-124.compute-1.amazonaws.com:5432/d26n3cbmoiqf8Heroku CLI\n" +
		"heroku pg:psql postgresql-cylindrical-23047 --app postgres-online"
	});
}

const db = creat();
db.authenticate()
	.then(() => console.log("CONECTDATA: success"))
	.catch(err => console.log("CONECTDATA FAIL: ", err.message));

const usertable = require('./models/User')(db, sequeliz);
const posttable = require('./models/Post')(db, sequeliz);
const cmttable = require('./models/Comment')(db, sequeliz);
const liketable =require('./models/Like')(db, sequeliz);
const followtable =require('./models/Follow')(db, sequeliz);
usertable.hasMany(posttable, {
	foreignKey: "idfb"

});
posttable.belongsTo(usertable, {
	foreignKey: "idfb"

});

posttable.hasMany(cmttable, {
	foreignKey: "idpost"
});

cmttable.belongsTo(posttable, {
	foreignKey: "idpost"
});

cmttable.belongsTo(usertable,{
	foreignKey:"idfb"
})
posttable.hasMany(liketable, {
	foreignKey: "idpost"
});
liketable.belongsTo(posttable, {
	foreignKey: "idpost"
});

liketable.belongsTo(usertable,{
	foreignKey:"idfb"
});

usertable.hasMany(followtable,{
	foreignKey:"idfb"
});


followtable.belongsTo(usertable,{
	foreignKey:"id2"

});
db.sync();

////-----------------------coment----------------------------------------------------------------------------------------------------------------
function Sequelize() {
	const KEY = "dsadas";

	function createUser(userFb, next, errs) {
		console.log("START CREAT USER ", userFb)
		usertable.create({
			idfb: userFb.id,
			name: userFb.name,
			gender: userFb.gender,
			urlavata: userFb.picture.data.url,
			lfolow: [],
			lfolowme: [],
			lmyfollow:[]
		}).then(user => {
				console.log("CREAT USER : ", user.get({plain: true}));
				next(user);
			})
			.catch(err => {
				console.log("CREAT USER  FAIL: ", err.message),
					errs();
			});
	}

	function follow(id1, id2, next, error) {
		findUserbyFbid(id1, function (data) {
			data.lfolow.push(id2);
			usertable.update(
				{lfolow: data.lfolow},
				{where: {idfb: id1}}
				)
				.then(result => {
						//todo
						findUserbyFbid(id2, function (data) {
							data.lfolowme.push(id1);
							usertable.update(
								{lfolowme: data.lfolowme},
								{where: {id: id2}}
								)
								.then(result => {
										next();
									}
								)
								.catch(err => {
										error()
									}
								)
						}, function () {
							error();
						});

						//todo
					}
				)
				.catch(err => {
						error()
					}
				)
		}, function () {
			error();
		});


	}

	function createPost(post, next, errs) {
		console.log("START CREAT POST ", post.idfb.toString())
		posttable.create({
			idfb: post.idfb,
			urlimage: post.urlimage,
			cap: post.cap,
			state: post.state,
			tag:post.tag
		}).then(user => {
				next(user);
				console.log("CREAT POST: ", user.get({plain: true}))
			})
			.catch(err => {
				errs();
				console.log("CREAT POST FAIL: s ", err.message)
			});
	}

	function getDatabase() {
		return db;
	}

	function userTable() {
		return usertable;
	}
	function cmtTable() {
		return cmttable;
	}
	function likeTable() {
		return liketable;
	}
	function postTable() {
		return posttable
	};
	function Ops() {
		return Op
	}
	function followTable() {
		return followtable
	}

	function findUserbyFbid(id, next, error, req) {
		console.log("BYID", id)
		usertable.findOne({
			where: {idfb: id}, include:[{model: followtable, include: [usertable]}]
		}).then(user => {
				if (user == null) {
					console.log("CREAT USER: ");
					req();

				}
				else {
					console.log("LOGIN: ");
					next(user);
				}

			})
			.catch(err => {
				console.log("findOne FAIL: ", err.message);
				error();
			});
	}

	function findPostbyId(id, next, error) {
		//console.log("findPostbyId",id)
		posttable.findOne({
				raw: true,
				where: {idpost: id}


			})
			.then(post => {
				console.log("findONE: ", post);
				console.log("RETURN STATUS: ");
				next(post);

			})
			.catch(err => {
				console.log("findONE FAIL: ", err.message);
				error();
			});
	}

	function findListPostHome(req, next, error) {
		console.log("findListPostHome", req)
		posttable.findAll({raw: true})
			.then(arruser => {
				console.log("findAll: ", arruser);
				next(arruser);

			})
			.catch(err => {
				console.log("findAll FAIL: ", err.message);
				error();
			});
	}

	function findMyListPost(id, next, error) {
		console.log("findListPostHome", id)
		posttable.findAll({
				raw: true,
				where: {idfb: id}
			})
			.then(arruser => {
				console.log("findAll: ", arruser);
				next(arruser);

			})
			.catch(err => {
				console.log("findAll FAIL: ", err.message);
				error();
			});
	}

	return {
		cmtTable,
		likeTable,
		follow,
		Ops,
		findMyListPost,
		findPostbyId,
		findListPostHome,
		getDatabase,
		postTable,
		userTable,
		createUser,
		createPost,
		findUserbyFbid,
		followTable,
		KEY

	};

}


module.exports = Sequelize;