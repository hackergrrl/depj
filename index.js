module.exports = function (deps) {
  var res = {}

  var foundOne = false
  // Iterate over deps again and again until all are resolved _OR_ some become unresolvable
  while (deps.length) {
    for (var i = 0; i < deps.length; i++) {
      var dep = deps[i]
      var needs = Object.keys(dep.needs)

      // Check needs & build an API object of 'needs' to give to the dep being created's 'create' function
      var api = {}
      var gotAll = true
      for (var j = 0; j < needs.length; j++) {
        var need = needs[j]
        console.log('checking dep', need, 'for', dep.gives)
        if (!res[need]) {
          gotAll = false
          break
        }
        api[need] = res[need]
      }
      if (!gotAll) continue

      // Create the dep
      var obj = dep.create(api)
      res[dep.gives] = obj
      foundOne = true
    }

    // Remove resolved deps
    deps = deps.filter(function (dep) {
      return !res[dep.gives]
    })

    // Fail if dependencies couldn't be resolved
    if (!foundOne) {
      var missing = deps.reduce(function (accum, cur) {
        var needs = Object.keys(cur.needs)
          .filter(function (need) { return !res[need] })
        return accum.concat(needs)
      }, [])
      throw new Error('could not resolve dependencies: ' + missing.join(', '))
    }
    foundOne = false
  }

  return res
}
