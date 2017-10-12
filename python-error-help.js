'use strict'
const InvalidInputError = require('./invalid_input_error')
const createIssue = require('./create_issue')
/*help()
____________________________________________________
Format:
"error message"
"result" = regex matched with "lines"
if matched return proper message & captured groups
____________________________________________________
*/

//matches cryptic python error messages & returns a simpler sth about what maybe wrong.
function help(lines){
  return new Promise((resolve, reject) =>{
    /*
    Traceback (most recent call last):
    File "python", line 2
      if sth = sth:
             ^
    SyntaxError: invalid syntax
    */

    var result = /(if|while)\s+(\w+)\s*=(?!=)\s*(.+)\s*:\s+.*\s+SyntaxError: invalid syntax/.exec(lines)
    if(result){
      let message = String.raw`Ughh 😠.. Looks like you forgot to use "==" to compare "${result[2]}" and "${result[3]}" inside your ${result[1]} condition.`

      return resolve({ id: 0, message: message, groups: groups(result)})
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
      let message = String.raw`Looks like you're missing a colon ":" at the end of your ${result[1]} condition.`
      return resolve({id: 1, message: message, groups: groups(result)})
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
      let message = String.raw`Looks like you forgot to indent "${result[1]}" correctly. Make sure it has the right amount of space before it.`
      return resolve({id: 2, message: message, groups: groups(result)})
    }

    /*
    Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
    IndexError: list assignment index out of range
    */

    result = /(?: File "<stdin>", line (\d), in <module>\s)*IndexError:.*index out of range/.exec(lines)
    if(result){
      #TODO
      let message = "todo"
      return resolve({id: 3, message: message, groups: groups(result)})
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
        createIssue({
          "title": `unmatched error of type ${errorType}`,
          "body":  "**API:** no match was found for the following error message:\n\n```\n"+lines+"\n```",
          "labels": ["matcher"]
        })
        return resolve({id: -1, message: pythonErrs[errorType], groups: [errorMessage, errorType]})
      }
    }

    //no matches?
    return reject(new InvalidInputError("No results found. Are you sure this is a python error message?"))
  })
}

//extracts & returns captured groups only from the re.exec() returned value
function groups(result){
  result.shift()
  delete result['index']
  delete result['input']
  return result
}


module.exports = help
