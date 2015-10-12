/// <reference path="./AssetBase.ts"/>
/// <reference path="./Type.ts"/>

module Asset {
  export class Image extends AssetBase {
  
    constructor(alias: string, path: string) {
      super(alias, path, Type.IMAGE);
    }
    
  }  
}
