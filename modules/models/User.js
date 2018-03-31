module.exports = function(dbConn, sequeliz) {
	return dbConn.define('user', {
		idfb: {
			type: sequeliz.STRING,
			allowNull: false,
			primaryKey: true

		},
		gender: sequeliz.STRING,
		name: sequeliz.STRING,
		urlavata: sequeliz.STRING(1234),
		lfolow: sequeliz.ARRAY(sequeliz.STRING),
		lfolowme: sequeliz.ARRAY(sequeliz.STRING),
		lmyfollow: sequeliz.ARRAY(sequeliz.STRING)

	});
}