import mySql from 'mysql';
import cors from 'cors'



import express from 'express';
let app = express();
import * as trainingApi from './Controller/trainingApi.js'
app.use(cors())
app.use(express.static('./DriverTrainingManagementFrontEnd'))

const con = mySql.createConnection({
	host: "sql12.freemysqlhosting.net",
	user: "sql12243435",
	password: "gXwsD8ZwYg",
	database: "sql12243435",
	port: "3306"
});
trainingApi.trainingApi(app,con)
con.connect((err) => {
	if (err) {
		console.log(`error is : ${err}`);
	} else {
		console.log("connected to the mysql database hosted on freemysqlhosting.net ");
		
		
	}
});
