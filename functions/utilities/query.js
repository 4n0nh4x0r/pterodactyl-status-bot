// const included = require("../../requires")

var pool = mysql.createPool({
    connectionLimit : 10,
    host: mainconfig.database.host,
    port: mainconfig.database.port,
    user: mainconfig.database.username,
    password: mainconfig.database.password,
    database: mainconfig.database.dbname,
    charset : 'utf8mb4'
});





module.exports = {
    name: "queryCommand",
    async function(msg, query, values){
        if(values == undefined){
            values = query
            query = msg
        }
        return new Promise(resolve => {
            // connection.query(query, values, function (error, results, fields) {
            //     if (error) throw error;
            //     resolve(results)
            // });

            pool.getConnection(function(err, connection) {
                if (err) throw err; // not connected!
                // Use the connection
                connection.query(query, values, function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();
                    // Handle error after the release.
                    if (error){
                        // console.log(error)  //-------------------------------------------------------------------------- DEBUGGING
                        resolve(false)
                    }
                    resolve(results)
                    // Don't use the connection here, it has been returned to the pool.
                    });
              });
        })
    }
}