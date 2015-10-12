/// <reference path="./AssetBase.ts"/>
/// <reference path="./Type.ts"/>

module Asset {
  export class Font extends AssetBase {
    
    constructor(alias: string, path: string) {
      super(alias, path, Type.FONT);
    }
    
  }
}