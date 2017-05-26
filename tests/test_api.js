'use strict'

const chai = require('chai')
const expect = chai.expect
const request = require('request');

//firing up the api
const api = require('../index');

describe('server handling POST: app.post("/error-help")', function(){

  it('should not return null & should capture the two values being compared + if or while', function(done){
    request.post({
      url:     'http://localhost:'+process.env.PORT+'/error-help',
      form:    { error_message: "Traceback (most recent call last):\n  File \"python\", line 2\n    if variable = 6:\n             ^\n  SyntaxError: invalid syntax"}
    }, function(error, response, body){
      //match?
      expect(body).to.not.equal('')
      var helpObj = JSON.parse(body)
      //captured what it should capture?
      expect(helpObj.groups).to.deep.equal(["if", "variable", "6"])
      done()
    });
  })

})
