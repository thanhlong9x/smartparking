module.exports = function(dbConn, sequeliz) {
	return dbConn.define('like', {
		idlike: {
			type:sequeliz.STRING,
			primaryKey: true
		},
		idpost:sequeliz.INTEGER,
		idfb:sequeliz.STRING

	});
}