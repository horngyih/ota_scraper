/* globals require */

var _elasticstore = require( './datastore/elasticsearch-store' );

_elasticstore.index( 'test-index', {
    testID : 192321,
    testMessage : 'test message',
    createdBy : 'ME',
    createdOn : new Date()
}, function( err, response ){
    if( err ) { console.log( err ); };
    console.log( response );
});
