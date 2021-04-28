const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://sophiayang:123qweasd@cluster0.c2ncf.mongodb.net/stock_ticker?retryWrites=true&w=majority";  // connection string goes here

var http = require('http');
var fs = require('fs');
var qs = require('querystring');

var port = process.env.PORT || 3000;
// var port = 8080; //localhost

http.createServer(function (req, res) {
    if (req.url == "/")
    {
        file = 'stockticker_form.html';
        fs.readFile(file, function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(txt);
            res.end();
        });
    }
    else if (req.url == "/process")
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        pdata = "";
        req.on('data', data => {
            pdata += data.toString();
        });

        // when complete POST data is received
        req.on('end', () => {
        	pdata = qs.parse(pdata);
            var result = [];
            
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if(err) { console.log("Connection err: " + err); return; }
              
                var dbo = db.db("stock_ticker");
            	var coll = dbo.collection('companies');
            	
            	console.log("before find");
            	var s = coll.find().stream();
            	s.on("data", function(item) {
                    if (pdata['userquery'].toUpperCase() == item.company.toUpperCase()) {
                        result.push(item.ticker);
                    } else if (pdata['userquery'].toUpperCase() == item.ticker) {
                        result.push(item.company);
                    }
                    result = Array.from(new Set(result)); //remove array duplicates
                });
            	s.on("end", function() {
                    console.log("end of data");
                    s = "<html><head><style>";
                    s += "body {background-color: #32a852; color: white; text-align: center; font-size: 30px; margin-top: 200px}";
                    s += "</style></head><body>";
                    res.write(s);
        			res.write("<h2><u>Your Results</u></h2>");
                    res.write(pdata['userquery'] + ": <br>");
                    if (result.length == 0) {
                        res.write("Not found");
                    }
                    for (i = 0; i < result.length; i++) {
                        res.write(result[i] + "<br>");
                    }
        			res.end("</body></html>");
                    db.close();
                });
            	console.log("after close");
            });  //end connect
        });
    }
    else 
    {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write ("Unknown page request");
        res.end();
    }
}).listen(port);