/* globals require */

function crossJoin(){
  console.log( arguments );
  var result = [];
  if( arguments.length == 1 ){
    if( typeof arguments === "object" ){
      result.push( arguments[0] );
    }
  } else if( arguments.length == 2 ){
    var arr1 = arguments[0];
    if( !Array.isArray( arr1 ) ){
      if( typeof arr1 === "object" ){
        arr1 = [ arr1 ];
      }
    }
    
    var arr2 = arguments[1];
    if( !Array.isArray( arr2 ) ){
      if( typeof arr2 === "object" ){
        arr2 = [arr2 ];
      }
    }
    
    for( var i in arr1 ){
      var a1 = arr1[i];
      for( var j in arr2 ){
        var a2 = arr2[j];
        var obj = Object.assign( {}, a2 );
        obj = Object.assign( obj, a1 );
        result.push( obj );
      }
    }
  } else {
    result = ( crossJoin( crossJoin.apply( null, Array.prototype.slice.call( arguments, 1 ) ), arguments[0] ) );
  }
  console.log( "Result ", result );
  return result;
}

module.exports = {
    crossJoin : crossJoin
};