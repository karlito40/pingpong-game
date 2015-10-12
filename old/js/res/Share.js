'use strict';

(function(exports){
  var registre = {}; 
  
  exports.Share = {
    set: function(key, value) {
      registre[key] = value;
    },
    
    delete: function(key) {
      delete registre[key];
    },
    
    get: function(key) {
      return registre[key];
    }
  };

})(window.Resource = window.Resource || {})