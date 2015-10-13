module Resource {
  export class Share {
    static registre: { [id: string]: any } = {};
    
    static set(key: string, value: any): Share {
      Share.registre[key] = value;
      return this;
    }
    
    static delete(key: string): Share {
      delete Share.registre[key];
      return this;
    }
    
    static get(key: string): any {
      return Share.registre[key];
    }
    
  }  
}
