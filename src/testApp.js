/* globals require */

var _agoda = require( "./query/agoda-query" );

console.log( _agoda );

_agoda.query( {}, function( err, data ){
    if( err ){ 
        console.log( err );
        return;
    }
    console.log( data );
});