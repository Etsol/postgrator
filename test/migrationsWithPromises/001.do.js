module.exports.generateSql = function() {
  return Promise.resolve(`
		CREATE TABLE person (
			name 	VARCHAR(50),
			age 	INT
		);
	`)
}
