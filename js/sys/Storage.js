'use strict';

(function(exports){
  
  var SystemStorage = window.localStorage;
  if(!SystemStorage) {
    SystemStorage = {
      _map: {},
      getItem: function(key) {
        return this._map[key];
      },
      
      setItem: function(key, value) {
        this._map[key] = value;
      }
    }
  }
  
  
  var Storage = {
    get: function(key) {
      var val = SystemStorage.getItem(key);
      var o = JSON.parse(val);
      
      
      if(o && o._lonely) {
        return o._lonely;
      }
      
      return o;
    },
    
    set: function(key, value) {
      if(typeof value != 'object') {
        value = {_lonely: value};
      }
      
      value = JSON.stringify(value);
      return SystemStorage.setItem(key, value);
    }
  }
  
  exports.Storage = Storage;
   
})(window.Sys = window.Sys || {});