'use strict'

/*help()
____________________________________________________
Format:
"error message"
"result" = regex matched with "lines"
if matched return proper response & captured groups
____________________________________________________
*/

//matches cryptic python error messages & returns a simpler sth about what maybe wrong.
function help(lines){
  /*
  Traceback (most recent call last):
  File "python", line 2
    if sth = sth:
           ^
  SyntaxError: invalid syntax
  */

  var result = /(if|while)\s+(\w+)\s*=(?!=)\s*(.+)\s*:\s+.*\s+SyntaxError: invalid syntax/.exec(lines)
  if(result){
    let response = String.raw`Ughh 😠.. Looks like you forgot to use "==" to compare "${result[2]}" and "${result[3]}" inside your ${result[1]} condition.`

    return { id: 0, response: response, groups: groups(result)}
  }


  /*
  Traceback (most recent call last):
  File "python", line 2
    while variable == 6
                      ^
  SyntaxError: invalid syntax
  */
  result = /(if|while)\s+\w+\s*={2,3}(?!=)\s*[^:]+\s*\s+.*\s+SyntaxError: invalid syntax/.exec(lines)
  if(result){
    let response = String.raw`Looks like you're missing a colon ":" at the end of your ${result[1]} condition.`
    return {id: 1, response: response, groups: groups(result)}
  }


  /*
  Traceback (most recent call last):
  File "python", line 6
    doSth()
        ^
  IndentationError: expected an indented block
  */
  result = /\s+(.*)\s+.*\s+IndentationError: expected an indented block/.exec(lines)
  if(result){
    let response = String.raw`Looks like you forgot to indent "${result[1]}" correctly. Make sure it has the right amount of space before it.`
    return {id: 2, response: response, groups: groups(result)}
  }



  /*
  Get last line of error and reply with something relevant to error-type
  */
  result = /((.*):.*)$/.exec(lines)
  if(result){
    let [errorMessage, errorType] = groups(result)

    //if we have a good help message for this errorType, send it.
    var pythonErrs = require('./python-built-in-errors.json')
    if(errorType in pythonErrs){
      return {id: -1, response: pythonErrs[errorType], groups: [errorMessage, errorType]}
    }
  }

  //no matches?
  return {id: -2, response: "No results found. Are you sure this is a python error message?", groups: {}}
}

//extracts & returns captured groups only from the re.exec() returned value
function groups(result){
  result.shift()
  delete result['index']
  delete result['input']
  return result
}


module.exports = help
