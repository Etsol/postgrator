const path = require('path')
const E = process.env
const assert = require('assert')
const Postgrator = require('../postgrator')

const config = {
  migrationDirectory: path.join(__dirname, './migrationsWithPromises'),
  driver: 'mysql',
  host: 'localhost',
  database: E.TEST_DB || 'postgrator',
  username: E.TEST_DB_USER || 'postgrator',
  password: E.TEST_DB_PASS || 'postgrator'
}

if (E.TEST_DB_PORT) {
  config.port = E.TEST_DB_PORT
}

describe('Migrations with Promises', function() {
  E.TEST_NAME_ETSOL = 'etsol'
  const postgrator = new Postgrator(config)

  it('Migrate to 001', function() {
    return postgrator
      .migrate('001')
      .then(results => {
        assert.strictEqual(results.length, 1, 'Migration to 001 failed')
        assert(/CREATE TABLE person/.test(results[0].getSql()))

        return postgrator.runQuery(
          `SELECT COUNT(*) FROM person WHERE name = '${E.TEST_NAME_ETSOL}'`
        )
      })
      .then(persons => {
        assert.strictEqual(persons.rows.length, 1)
        assert.strictEqual(persons.rows[0][persons.fields[0].name], 0)
      })
  })

  it('Migrate back to 000 from 001', function() {
    return postgrator.migrate('000').then(results => {
      assert.strictEqual(results.length, 1, 'Migrating back to 0 failed')
      assert(/DROP TABLE person/.test(results[0].getSql()))

      // 	return postgrator.runQuery(`SELECT COUNT(*) FROM person WHERE name = '${E.TEST_NAME_ETSOL}'`);
      // }).then(persons => {
      // 	assert.strictEqual(persons.rows.length, 0);
    })
  })

  it('Migrate to 002', function() {
    return postgrator
      .migrate('002')
      .then(results => {
        assert.strictEqual(results.length, 2, 'Migration to 002 failed')
        assert(/INSERT INTO person/.test(results[1].getSql()))

        return postgrator.runQuery(
          `SELECT COUNT(*) FROM person WHERE name = '${E.TEST_NAME_ETSOL}'`
        )
      })
      .then(persons => {
        assert.strictEqual(persons.rows.length, 1)
        assert.strictEqual(persons.rows[0][persons.fields[0].name], 1)
      })
  })

  it('Migrate back to 001 from 002', function() {
    return postgrator
      .migrate('001')
      .then(results => {
        assert.strictEqual(results.length, 1, 'Migrating back to 1 failed')
        assert(/DELETE FROM person/.test(results[0].getSql()))

        return postgrator.runQuery(
          `SELECT COUNT(*) FROM person WHERE name = '${E.TEST_NAME_ETSOL}'`
        )
      })
      .then(persons => {
        assert.strictEqual(persons.rows[0][persons.fields[0].name], 0)
      })
  })

  it('Migrate back to 000 from 001', function() {
    return postgrator.migrate('000').then(results => {
      assert.strictEqual(results.length, 1, 'Migrating back to 0 failed')
      assert(/DROP TABLE person/.test(results[0].getSql()))
    })
  })

  it('Migrate to 003', function() {
    return postgrator
      .migrate('003')
      .then(results => {
        assert.strictEqual(results.length, 3, 'Migration to 003 failed')
        assert(/UPDATE person.*30/.test(results[2].getSql()))

        return postgrator.runQuery(
          `SELECT age FROM person WHERE name = '${E.TEST_NAME_ETSOL}'`
        )
      })
      .then(persons => {
        assert.strictEqual(persons.rows.length, 1)
        assert.strictEqual(persons.rows[0][persons.fields[0].name], 30)
      })
  })

  it('Migrate back to 000 from 003', function() {
    return postgrator.migrate('000').then(results => {
      assert.strictEqual(results.length, 3, 'Migrating back to 0 failed')
      assert(/UPDATE person/.test(results[0].getSql()))
      assert(/DELETE FROM person/.test(results[1].getSql()))
      assert(/DROP TABLE person/.test(results[2].getSql()))
    })
  })
})
