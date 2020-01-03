module.exports.generateSql = function() {
  return Promise.resolve(`
		DELETE FROM person WHERE name = '${process.env.TEST_NAME_ETSOL}';
	`)
}
