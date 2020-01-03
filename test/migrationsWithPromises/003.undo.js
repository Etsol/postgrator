module.exports.generateSql = function() {
  return Promise.resolve(`
		UPDATE person SET age=26 WHERE name='${process.env.TEST_NAME_ETSOL}';
	`)
}
