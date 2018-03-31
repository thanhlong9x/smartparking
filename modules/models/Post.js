module.exports = function(dbConn, sequeliz) {
	return dbConn.define('post', {
		idpost: {
			type: sequeliz.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		idfb:sequeliz.STRING,
		urlimage: sequeliz.ARRAY(sequeliz.STRING(1234)),
		cap: sequeliz.STRING,
		state: sequeliz.STRING,
		tag: sequeliz.ARRAY(sequeliz.STRING),
		rtag:sequeliz.STRING(1234)
	});
}