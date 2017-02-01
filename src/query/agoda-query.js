/* globals require */
var _connect = require( '../common/connect' );
var _https = require( 'https' );
var _url = require('url');

/**
 * City Codes:
 * - Kuala Lumpur -> 14524
 * - Singapore -> 4064
 * - Shah Alam -> 5435
 * - Ipoh -> 15523
 * - Jakarta -> 8691
 * 
*/

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

function mapValues( param ){
    return param;
}

function buildQuery( param ){
    var result = "" + urlPath + "?";
    var mergedParameters = mapValues( Object.assign( defaultQueryParameters, param ? param : {} ) );
    for( var key in mergedParameters ){
        result += key + '=' + mergedParameters[key];
    }
    return result;
}

function connect( parameters, callback ){
    if( typeof callback !== "function" ){ callback = function(){} };
    var path = buildQuery( parameters );
    _connect.connect( path, function(err, data){ 
        if( err ){ callback( err ) };
        parseData( data, callback );  
    });
}

function parseData( data, callback ){
    if( typeof callback !== "function" ){ callback = function(){}; };
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
        callback( null, result );
    }
}

function _query( parameters, callback ){
    if( typeof callback !== "function" ){
        callback = function( err, data ){
            console.log( data );
        };
    }
    connect( parameters, callback );
}

module.exports = {
    query : _query
}
