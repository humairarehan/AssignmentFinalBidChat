
import * as trainingSessionManagement from './trainingManagementController'
export function getTrainingData  (con,res){
   
    const sql = 'CREATE TABLE IF NOT EXISTS users (id int(11) NOT NULL AUTO_INCREMENT,name varchar(100) NOT NULL,duration varchar(100) NOT NULL,PRIMARY KEY (id))';
    con.query(sql, (err, result) => {
        if (err)
            console.log(`query err : ${err}`);
        const sql = "select * from users order by id asc ";
        
        con.query(sql, (err, result) => {
            if (err)
                throw err;
               // trainingData=result;
               // return ;
              
                trainingSessionManagement.getTrainingSessionDetails(result,res)
        });
});
}

