module.exports.generateSql = function() {
  return new Promise(res => {
    // Some delay
    setTimeout(
      () =>
        res(`
			INSERT INTO person (name, age) VALUES ('${process.env.TEST_NAME_ETSOL}', 26);
		`),
      100
    )
  })
}
