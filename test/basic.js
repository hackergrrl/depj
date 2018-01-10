var test = require('tape')
var combine = require('..')

test('one', function (t) {
  var foo = {
    gives: 'foo',
    needs: [],
    create: function (needs) { return 'foo' }
  }

  try {
    var res = combine([foo])
    t.ok(true)
  } catch (err) {
    t.fail()
  }

  t.deepEquals(res, { foo: 'foo' })
  t.end()
})

test('bad one', function (t) {
  var foo = {
    gives: 'foo',
    needs: ['bar'],
    create: function (needs) { return 'foo' }
  }

  try {
    var res = combine([foo])
    t.fail()
  } catch (err) {
    t.ok(true)
  }

  t.end()
})

test('three', function (t) {
  var hyper = {
    gives: 'hyperdb',
    needs: [],
    create: function (needs) { return {name:'hyperdb'} }
  }

  var level = {
    gives: 'leveldb',
    needs: {},
    create: function (needs) { return {name:'leveldb'} }
  }

  var db = {
    gives: 'database',
    needs: ['hyperdb', 'leveldb'],
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

test('multiples', function (t) {
  var foo = {
    gives: 'foo',
    needs: [],
    create: function (needs) { return {name:'foo 1'} }
  }

  var foo2 = {
    gives: 'foo',
    needs: {},
    create: function (needs) { return {name:'foo 2'} }
  }

  var bar = {
    gives: 'bar',
    needs: ['foo'],
    create: function (needs) {
      return { foo: needs.foo }
    }
  }

  try {
    var res = combine([foo, foo2, bar])
    t.ok(true)
  } catch (err) {
    t.fail()
  }

  t.equals(res.foo.name, 'foo 2')
  t.end()
})
