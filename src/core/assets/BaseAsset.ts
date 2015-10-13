/// <reference path="../loaders/ILoadable.ts"/>

module Asset {
  export class BaseAsset implements ILoadable{
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
    
    setPath(path: string): BaseAsset {
      this.path = path;
      return this;
    }
    
    setAlias(alias: string): BaseAsset {
      this.alias = alias;
      return this;
    }
  }
}
