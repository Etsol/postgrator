module.exports.generateSql = function() {
  return Promise.resolve(`
		DROP TABLE person;
	`)
}
