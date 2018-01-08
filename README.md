# depj

> maximally simple dependency injection

Inspired heavily by [depject](https://github.com/depject/depject), but even
simpler.

## Usage

```js
var combine = require('depj')

var hyperdb = require('hyperdb')
var ram = require('random-access-memory')
var memdb = require('memdb')

var hyper = {
  gives: 'hyperdb',
  needs: [],
  create: function (api) { return hyperdb(ram, { valueEncoding: 'json' }) }
}

var level = {
  gives: 'leveldb',
  needs: [],
  create: function (api) { return memdb() }
}

var osm = {
  gives: 'osm',
  needs: [ 'hyperdb', 'leveldb' ],
  create: function (api) {
    return {
      put: function (key, value, cb) { api.hyperdb.put(key, value, cb) },
      // ...
    }
  }
}

var api = combine([hyper, osm, level])

console.log('api', Object.keys(api))

api.osm.put('foo', 'bar', function (err) { console.log(err || 'done') })
```

outputs

```
api [ 'hyperdb', 'leveldb', 'osm' ]
done
```

## API

```js
var combine = require('depj')
```

### var api = combine(deps)

Creates the object `api` with properties for all of the dependencies in the
tree. `deps` is an array with objects of the form

```js
{
  gives: 'name',
  needs: {
    need1: true,
    need2: true
  },
  create: function (api) { return ... }
}
```

`create` can return an object, a function -- anything you'd like.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install depj
```

## License

ISC

