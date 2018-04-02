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
		lfolowme: sequeliz.ARRAY(sequeliz.STRING)


	});
}