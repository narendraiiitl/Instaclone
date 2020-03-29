const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }
 
    var $ = require("jquery")(window);
});
$.ajaxSetup({
	headers : {
	  "x-rapidapi-host": "covid-193.p.rapidapi.com",
	"x-rapidapi-key": "4f1ce6bdc6mshe393be6f6b1c05bp122a93jsn1b8eb7139bf5"
	}
  });
$.getJSON( "https://covid-193.p.rapidapi.com/statistics")
.then(function(data){console.log(data)})
.catch(function(err){console.log(err)})








var unirest = require("unirest");

var req = unirest("GET", "https://covid-193.p.rapidapi.com/statistics");

req.headers({
	"x-rapidapi-host": "covid-193.p.rapidapi.com",
	"x-rapidapi-key": "4f1ce6bdc6mshe393be6f6b1c05bp122a93jsn1b8eb7139bf5"
});


req.end(function (res) {
    if (res.error) throw new Error(res.error);
    
	console.log(res.body);
});
 