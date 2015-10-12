/// <reference path="../loaders/Loadable.ts"/>

module Asset {
  export class AssetBase implements Loadable{
    alias: string;
    path: string;
    type: number;
    
    constructor(alias: string, path: string, type: number) {
      this.alias = alias;
      this.path = path;
      this.type = type;
    }
    
    getAlias(): string {
      return this.alias;
    }
    
    getPath(): string {
      return this.path;
    }
    
    getType(): number {
      return this.type;
    }
    
    setPath(path: string): AssetBase {
      this.path = path;
      return this;
    }
    
    setAlias(alias: string): AssetBase {
      this.alias = alias;
      return this;
    }
  }
}
