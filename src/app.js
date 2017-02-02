/* globals require */

/**
 *  Agoda URL
 * https://www.agoda.com/pages/agoda/default/DestinationSearchResult.aspx?
 * &city=14524
 * &tick=636214740881
 * &pagetypeid=1
 * &origin=MY
 * &cid=-1
 * &tag=
 * &gclid=
 * &aid=130243
 * &userId=bb6b9664-800d-408c-810e-46b1fb138dab
 * &languageId=1
 * &sessionId=lidrxgu3vro3tuxp2xfvn5oj&storefrontId=3
 * &currencyCode=MYR
 * &htmlLanguage=en-us
 * &trafficType=User
 * &cultureInfoName=en-US
 * &checkIn=2017-02-09
 * &checkOut=2017-02-10
 * &los=1
 * &rooms=1
 * &adults=2
 * &children=0
 * &priceCur=MYR
 * &hotelReviewScore=5
 * &ckuid=bb6b9664-800d-408c-810e-46b1fb138dab
 **/

var _http = require('http');
var _https = require('https');
var _url = require('url');

var urlPath = "https://www.agoda.com/pages/agoda/default/DestinationSearchResult.aspx"

var defaultQueryParameters = {
    city: "14524",
    checkIn: "2017-03-01",
    checkOut: "2017-03-02",
    los: "1",
    rooms: "1",
    adults: "1",
    children: "0",
    priceCur: "MYR",
    currencyCode: "MYR"
};

connect(urlPath + queryStringBuilder(defaultQueryParameters), parseData);

function connect(urlPath, callback) {
    console.log("Connecting.... " + urlPath);
    if (urlPath) {
        var url = _url.parse(urlPath);
        if (url.protocol.startsWith("http:")) {
            _http.get(urlPath, function(response) {
                handleResponse(response, callback);
            })
        } else if (url.protocol.startsWith("https:")) {
            _https.get(urlPath, function(response) {
                handleResponse(response, callback);
            })
        } else {
            console.log("Unrecognized protocol");
        }
    }
}

function handleResponse(response, callback) {
    var err = null;
    if (response) {
        if (response.statusCode === 200) {
            var rawData = "";
            response.on("data", function(chunk) {
                rawData += chunk;
            });
            response.on("end", function() {
                if (typeof callback === "function") {
                    callback(null, rawData);
                }
            });
        } else if (response.statusCode === 301) {
            if (response.headers) {
                if (response.headers.location) {
                    console.log("Redirected.... " + response.headers.location);
                    connect(response.headers.location, callback);
                }
            }
        } else {
            err = response.statusCode + " " + response.statusMessage;
        }
    } else {
        err = "No response";
    }

    if (err) {
        if (typeof callback === "function") {
            callback(err);
        }
    }
}

function parseData(err, data) {
    if (data) {
        var resultsEx = /var\sinitialResults\s=\s({.+});/g;
        var matches = resultsEx.exec(data);
        var result = {};
        if (matches) {
            if (matches.length > 1) {
                result = JSON.parse(matches[1]);
            }
        }
        console.log(result);
        index( result );
    }

    if (typeof callback === "function") {
        callback(null, data);
    }
}

function index(result) {
    console.log("Indexing to elastic search..." );
    if( typeof result === "object" ){
        if( result.ResultList ){
            for( var i = 0; i < result.ResultList.length; i++ ){
                var hotelResult = result.ResultList[i];
                indexHotel( hotelResult );
            }
        }
    }
}

function indexHotel(hotelResult){
    if (typeof hotelResult === "object") {
        var options = {
            host : "dockerhost",
            port : 9200,
            path : "/agoda-search/hotel/?pretty",
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            }
        };
        
        var req = _http.request( options, function(response){
            console.log( response.statusCode );
            console.log( response.headers );
            var responseData = "";
            response.on( "data", function(chunk){ responseData += chunk; } );
            response.on( "end", function(){ console.log( "indexed" ); } );
        });
        
        hotelResult.timestamp = new Date();
        hotelResult.checkInDate = defaultQueryParameters.checkIn;

        if( hotelResult.Longitude ){
            if( hotelResult.Latitude ){
                hotelResult.location = {
                    lat : hotelResult.Latitude,
                    lon : hotelResult.Longitude
                };
            }
        }
        console.log( "Location : ", hotelResult.location );

        req.write( JSON.stringify( hotelResult ) );
        req.end();
    }
}

function queryStringBuilder(queryParameters) {
    var result = "?";
    if (queryParameters) {
        for (var query in queryParameters) {
            result += "" + query + "=" + queryParameters[query];
            result += "&";
        }
    }
    return result;
}