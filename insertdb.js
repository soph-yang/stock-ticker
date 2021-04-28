const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://sophiayang:123qweasd@cluster0.c2ncf.mongodb.net/stock_ticker?retryWrites=true&w=majority";  // connection string goes here

var fs = require('fs');
var readline = require('readline');

function main() 
{
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if(err) { 
            return console.log(err); 
        }

        var dbo = db.db("stock_ticker");
        var collection = dbo.collection('companies');

        //creating array to insert using readline module
        const company_array = [];
        var myFile = readline.createInterface({
            input: fs.createReadStream('companies.csv')
        });
        myFile.on('line', function(line) {
            lineArr = line.split(',');    
            company_array.push({
                company: lineArr[0],
                ticker: lineArr[1] 
            })
        });
        
        //inserting array into MongoDB database
        myFile.on('close', function() {
           console.log('Inserting this array: ', company_array);
           collection.insertMany(array, function(err, res) {
               if(err) { 
                   console.log("query err: " + err); return; 
               }
               console.log("new documents inserted");
           });

           console.log("Success!");
        });
    });
}

main();


