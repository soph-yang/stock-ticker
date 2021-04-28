# Stock Ticker App
This web app finds associated stock tickers and companies.
## https://findstockticker.herokuapp.com

Created a MongoDB database with a collection called companies to store company names and their stock ticker (the symbol associated with a company stock). Used Node.js and MongoDB to create a web app to read a comma delimited file of companies and their stock ticker code - and inserted corresponding entries into the MongoDB companies collection. Used a file companies.csv for sample data.

Created an HTML file stockticker_form.html with a form that asks the user to enter a stock ticker OR a company name.
The form action directs to a Node.js app that displays the name and stock ticker for the company identified from the form data.
Several company names may share the same stock ticker. If the user types in the stock ticker, all matching company names must be displayed.
