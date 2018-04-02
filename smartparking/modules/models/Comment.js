module.exports = function(dbConn, sequeliz) {
	return dbConn.define('comment', {
		idcmt: {
			type: sequeliz.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		idpost:sequeliz.INTEGER,
		idfb:sequeliz.STRING,
		cmt:sequeliz.STRING

	});
}