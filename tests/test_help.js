'use strict'

let chai = require('chai')
let expect = chai.expect
let help = require('../python-error-help')

describe('python-error-help: help()', function(){

  it('should not return null & should capture the two values being compared + if or while', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 2\n    if variable = 6:\n             ^\n  SyntaxError: invalid syntax")
    //match?
    expect(helpObj).to.not.equal(null)
    //correct error-id
    expect(helpObj.id).to.equal(0)

    //captured what it should capture?
    expect(helpObj.groups).to.deep.equal(["if", "variable", "6"])
  })


  it('should not return null & should capture while', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 2\n    while variable == 6\n                      ^\nSyntaxError: invalid syntax")
    expect(helpObj).to.not.equal(null)
    expect(helpObj.id).to.equal(1)
    expect(helpObj.groups).to.deep.equal(["while"])
  })


  it('should not return null & should capture if',function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 4\n    if x == y+1\n              ^\nSyntaxError: invalid syntax")
    expect(helpObj).to.not.equal(null)
    expect(helpObj.id).to.equal(1)
    expect(helpObj.groups).to.deep.equal(["if"])
  })
})
