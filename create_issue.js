const request = require('request');
function createIssue(params){
	const options = {
		url: 'https://api.github.com/repos/Youssefares/python-error-helper/issues',
		json: true,
		headers: {
			'Authorization': "token "+process.env.GITHUB_ACCESS_TOKEN,
			'User-Agent': 'python-error-helper',
			'Content-Type': 'application/json'
		},
		body: params
	}

	request.post(options, (error, response, body)=>{
		if(error){
			console.log(`failed with error ${error}`)
		}
		else{
			console.log(`success with code ${response.statusCode}: ${JSON.stringify(body)}`)
		}
	})
}
module.exports = createIssue