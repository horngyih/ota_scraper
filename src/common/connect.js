/* globals require */
var _https = require( 'https' );
var _http = require( 'http' );
var _url = require('url');

function _connect( urlpath, callback ){
    var url = _url.parse( urlpath );
    var getMethod = null;
    if( url.protocol.startsWith( "http:" ) ){
        getMethod = _http.get;
    } else if( url.protocol.startsWith( "https:" ) ){
        getMethod = _https.get;
    }

    if( typeof getMethod === "function" ){
        getMethod( urlpath, function(response){ _handleResponse( response, callback ); } );
    } else {
        callback( new Error( "Unrecognized protocol" ) );
    }
}

function _buildQueryString( urlPath, param ){
    var result = "" + urlPath + "?";
    if( typeof param === "object" ){
        for( var key in param ){
            result += key + '=' + param[key];
            result += "&";
        }
    }
    return result;
}


function _handleResponse( response, callback ){
    if( typeof callback !== "function" ){ callback = function(){}; };

    if( response ){
        if( response.statusCode === 200 ){
            var rawData = "";
            response.on( "data", function(chunk){ rawData += chunk; } );
            response.on( "end", function(){ callback( null, rawData ); } );
        }
        else if( response.statusCode === 301 ){
            if( response.headers.location ){
                connect( response.headers.location, callback );
            }
            else {
                callback( new Error( "Redirect with no redirect location" ) );
            }
        }
        else {
            callback( new Error( response.statusCode + " " + response.statusMessage ) );
        }
    } else {
        if( typeof callback === "function" ){
            callback( new Error( "No response" ) );
        }
    }
}

module.exports = {
    connect : _connect,
    buildQueryString : _buildQueryString
}