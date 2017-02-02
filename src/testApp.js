/* globals require */

var _agoda = require( "./query/agoda-query" );
var _elasticseach = require( "./datastore/elasticsearch-store" );

console.log( _agoda );

_agoda.query( {}, function( err, data ){
    if( err ){ 
        console.log( err );
        return;
    }

    _elasticseach.index( "agoda-search", data, function( err, response ){
        if( err ){
            console.log( err );
            return;
        }

        console.log( response );
    });
});