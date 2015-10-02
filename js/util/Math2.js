'use strict';

(function(exports){
  
  exports.Math2 = {
    degToRad: function(deg) {
      return deg*PIXI.DEG_TO_RAD;
    }
  };
  
})(window.Util = window.Util || {});