'use strict'

let chai = require('chai')
let expect = chai.expect
let help = require('../python-error-help')

describe('python-error-help: help()', function(){

  it('should not return null & should capture the two values being compared + if or while', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 2\n    if variable = 6:\n             ^\n  SyntaxError: invalid syntax")
    //correct error-id
    expect(helpObj.id).to.equal(0)

    //captured what it should capture?
    expect(helpObj.groups).to.deep.equal(["if", "variable", "6"])
  })


  it('should not return null & should capture while', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 2\n    while variable == 6\n                      ^\nSyntaxError: invalid syntax")
    expect(helpObj.id).to.equal(1)
    expect(helpObj.groups).to.deep.equal(["while"])
  })


  it('should not return null & should capture if',function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 4\n    if x == y+1\n              ^\nSyntaxError: invalid syntax")
    expect(helpObj.id).to.equal(1)
    expect(helpObj.groups).to.deep.equal(["if"])
  })


  it('should not return null & should capture do_sth()', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 6\n    do_sth()\n        ^\nIndentationError: expected an indented block")
    expect(helpObj.id).to.equal(2)
    expect(helpObj.groups).to.deep.equal(["do_sth()"])
  })

  it('should capture error message and error type + get proper response from file', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 3\n   Someerror that will never exist and some numbers 35432:\n         ^\nSyntaxError: invalid syntax")
    expect(helpObj.id).to.equal(-1)
    expect(helpObj.groups).to.deep.equal(["SyntaxError: invalid syntax", "SyntaxError"])
    expect(helpObj.response).to.deep.equal("This type of error occurs when the python interpreter can't understand your code. The file your trying to run or a file imported in it, contains code that doesn't follow language rules.")

  })

})
