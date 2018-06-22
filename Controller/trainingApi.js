
import * as dbData from './dbFetchDataController';
export function trainingApi(app,con) {

app.get('/getApiDBDetails', function (req, res) {
  dbData.getTrainingData(con,res)
	
	
 })
 let server = app.listen(3000, function () {

	let host = "localhost"
	let port = server.address().port
  
	console.log("Driving Training Session Management Listening at http://%s:%s", host, port)
  
  })
}