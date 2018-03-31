const sequeliz = require("sequelize");
const ConfigDatabase = require("./java/ConfigDatabase")
const db = new sequeliz({
	database: "instab",
	username: "postgres",
	password: "1",
	host: "localhost",
	port: 5432,
	dialect: "postgres",
	dialectOptions: {
		ssl: false
	},
	define: {
		freezeTableName: true
	}
});

db.authenticate()
	.then(() => console.log("CONECTDATA: success"))
	.catch(err => console.log("CONECTDATA FAIL: ", err.message));

//creat table
const usertable = db.define("user", {
		idfb: {
			type: sequeliz.STRING,
			allowNull: false,

		},
		gender: sequeliz.STRING,
		name: sequeliz.STRING,
		dob: sequeliz.STRING,
		urlavata: sequeliz.STRING,
		lfolow: sequeliz.ARRAY(sequeliz.STRING),
		lstatus: sequeliz.ARRAY(sequeliz.INTEGER)

	})
;
db.sync();

//creat
//
usertable.create({
	idfb: "846297042197690",
	name: "HOANTRAN",
	dob: "20/12/33",
	urlavata: "facebook.com",
	lfolow: ["32121321", "321321321312"],
	lstatus: [7898797, 97897]
}).then(user => console.log("CREAT: ", user.get({plain: true})))
	.catch(err => console.log("CREAT FAIL: ", err.message));


usertable.bulkCreate([
	{
		idfb: "123456f79876",
		name: "THIEU",
		dob: "20/12/32323",
		urlavata: "facebook.com1",
		lfolow: ["32121321", "321321321312"],
		lstatus: [7898797, 97897]
	},
	{
		idfb: "1234567890v986",
		name: "HOANG",
		dob: "20/12/332323",
		urlavata: "facebook.com2",
		lfolow: ["32121321", "321321321312"],
		lstatus: [7898797, 97897]
	}
]).then(arruser => arruser.forEach(user => console.log("bulkCreate: ", user.get({plain: true}))))
	.catch(err => console.log("bulkCreate FAIL: ", err.message));


// usertable.destroy({
// 	where: {
// 		idfb: "12345678909876"
// 	}
// }).then(row => console.log("destroy id: ", row))
// 	.catch(err => console.log("destroy FAIL: ", err.message));
//
//
// usertable.findOne({
// 	where: {idfb: "1234567890v986"}
// }).then(user => console.log("findOne: ", user.get({plain: true})))
// 	.catch(err => console.log("findOne FAIL: ", err.message));
//
// usertable.findAll({raw: true}).then(arruser => arruser.forEach(user => console.log("findAll: ", user)))
// 	.catch(err => console.log("findAll FAIL: ", err.message));
//
// usertable.findById(27, {raw: true}).then(user => console.log("findById: ", user))
// 	.catch(err => console.log("findById FAIL: ", err.message));


usertable.findAll({raw:true,where: {id: [1, 2, 3]}}).then(projects => {
	console.log("FILD",projects)
	// projects will be an array of Projects having the id 1, 2 or 3
	// this is actually doing an IN query
}).catch(err => console.log(err.message));
