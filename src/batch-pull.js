/* globals require */

var _util = require( './common/util');
var _moment = require( 'moment' );
var _agoda = require( "./query/agoda-query" );
var _elasticsearch = require( "./datastore/elasticsearch-store" );

var startDate = '2017-03-01';
var period = 7;

var dateParameters = [];

for( var i = 0; i < period; i++ ){
    var currentMoment = _moment(startDate).add( i, 'd' );
    console.log( "Current Date : ", currentMoment.format('YYYY-MM-DD') );
    var checkInDate = currentMoment.format('YYYY-MM-DD');
    var checkOutDate = currentMoment.add( 1, 'd' ).format('YYYY-MM-DD');
    dateParameters.push({
        checkIn : checkInDate,
        checkOut : checkOutDate
    })
}

console.log( dateParameters );

var cityParameters = [ { city : '14524' }, { city : '4064' } ];

console.log( cityParameters );

// var queryParameters = [];
// for( var i = 0; i < cityParameters.length; i++ ){
//     var cityParameter = cityParameters[i];
//     for( var j = 0; j < dateParameters.length; j++ ){
//         var dateParam = dateParameters[j];
//         queryParameters.push({
//             city : cityParameter.city,
//             checkIn : dateParam.checkIn,
//             checkOut : dateParam.checkOut
//         });
//     }
// }

var queryParameters = _util.crossJoin( cityParameters, dateParameters );

console.log( queryParameters );

for( var i = 0; i < queryParameters.length; i++ ){
    _agoda.query( queryParameters[i], function( err, data ){
        if( err ){
            console.log( err );
            return;
        }

        console.log( data.ResultList );
        // _elasticsearch.index( "agoda-search", data, function( err, response ){
        //     if( err ){
        //         console.log( err );
        //         return;
        //     }

        //     console.log( response );
        // });
    });
}