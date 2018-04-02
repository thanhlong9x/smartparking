module.exports = function(dbConn, sequeliz) {
	return dbConn.define('follow', {
		idfollow: {
			type:sequeliz.STRING,
			primaryKey: true
		},
		idfb:sequeliz.STRING,
		id2:sequeliz.STRING

	});
}