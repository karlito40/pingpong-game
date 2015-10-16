module Resource {
  
  export class Style {
    static config = {
      circle: {
        strokeStyle: 0xcb4b16,
        lineWidth: 1,
        fillStyle: 'transparent'  
      },
    
      line: {
        strokeStyle: 0xab8951,
        lineWidth: 4
      },
      
      font: {
        font: '30px OogieBoogie',
        fill: 0xFFFFFF
      },
    
      // background: 0xfae337
      background: 0x171715
    };
    
    static get(key: string): any {
      return Style.config[key];
    }
  }
  
}