module Resource {

  class SystemStorage {
    static _map = {};
    
    static getItem(key: string): any {
      if(localStorage) {
        SystemStorage._map[key] = localStorage.getItem(key);
      }
      return SystemStorage._map[key];
    }
    
    static setItem(key: string, value: any): void {
      SystemStorage._map[key] = value;
      if(localStorage) {
        localStorage.setItem(key, value);
      }
    }
    
  }


  
  export class Storage {
    
    static get(key: string): any {
      var val = SystemStorage.getItem(key);
      var o = JSON.parse(val);
      
      
      if(o && o._lonely) {
        return o._lonely;
      }
      
      return o;
    }
    
    static set(key: string, value: any): void {
      if(typeof value != 'object') {
        value = {_lonely: value};
      }
      
      value = JSON.stringify(value);
      return SystemStorage.setItem(key, value);
    }
    
  }
  
}