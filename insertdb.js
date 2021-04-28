const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://sophiayang:123qweasd@cluster0.c2ncf.mongodb.net/stock_ticker?retryWrites=true&w=majority";  // connection string goes here

var fs = require('fs');
var readline = require('readline');
const parse = require('csv-parse');

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
        fs.createReadStream('companies.csv')
            .pipe(parse({ delimiter: ',', from_line: 2 })) //starts from second row of csv
            .on('data', (row) => {
                company_array.push({
                    company: row[0],
                    ticker: row[1] 
                })
            })
            .on('close', function() {
               //inserting array into MongoDB database
               console.log('Inserting this array: ', company_array);
               collection.insertMany(company_array, function(err, res) {
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


