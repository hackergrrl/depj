var test = require('tape')
var combine = require('..')

test('simple', function (t) {
  var hyper = {
    gives: 'hyperdb',
    needs: {},
    create: function (needs) { return {name:'hyperdb'} }
  }

  var level = {
    gives: 'leveldb',
    needs: {},
    create: function (needs) { return {name:'leveldb'} }
  }

  var db = {
    gives: 'database',
    needs: { hyperdb: true, leveldb: true },
    create: function (needs) {
      return {
        doWork: function () {
          return needs
        }
      }
    }
  }

  try {
    var res = combine([hyper, db, level])
    t.ok(true)
  } catch (err) {
    t.fail()
  }

  t.equals(res.hyperdb.name, 'hyperdb')
  t.equals(res.leveldb.name, 'leveldb')
  t.deepEquals(res.database.doWork(), { hyperdb: res.hyperdb, leveldb: res.leveldb })
  t.end()
})
