/* globals require */

var _elasticsearch = require( "elasticsearch" );

var defaultServerOptions = {
    host : 'localhost',
    port : '9200'
};

function _serverOptions(){
    var options = {
        host : process.env.ELASTICHOST || null,
        port : process.env.ELASTICPORT || null
    };
    var mergedOptions = Object.assign( defaultServerOptions, options );
    return {
        host : mergedOptions.host + ":" + mergedOptions.port
    };
}

function _index( indexName, data, callback ){
    if( typeof callback !== "function" ){ callback = function(){}; };
    var client = new _elasticsearch.Client( _serverOptions() );
    if( client ){
        client.index({
            index : indexName || 'generic',
            type : 'mtype',
            body : data || '{}'
        },
        callback );
    }
}

module.exports = {
    index : _index
}