'use strict';

(function(exports){
  exports.Color = {
    
    componentToHex: function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    
    rgbToHex: function(rgb) {
      var rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      return "0x" + this.componentToHex( parseInt(rgb[1]) ) + this.componentToHex( parseInt(rgb[2]) ) + this.componentToHex( parseInt(rgb[3]) );
    },
    
    hexaToColor: function(hexa){
      return '#' + hexa.toString().slice(2);
    },
    
    colorToHexa: function(color) {
      return '0x' + color.toString().slice(1);
    }
    
  };

})(window.Util = window.Util || {})
