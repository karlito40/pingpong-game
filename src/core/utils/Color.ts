module Util {
  
  export class Color {
    
    static componentToHex(c): string {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    
    static rgbToHax(rgb: string): string {
      var rgbList = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      return "0x" + 
        Color.componentToHex( parseInt(rgbList[1]) ) 
        + Color.componentToHex( parseInt(rgbList[2]) ) 
        + Color.componentToHex( parseInt(rgbList[3]) );
    }
    
    static hexaToColor(hexa): string {
      return '#' + hexa.toString().slice(2);
    }
    
    static colorToHexa(color): string {
      return '0x' + color.toString().slice(1);
    }
    
  }
  
}