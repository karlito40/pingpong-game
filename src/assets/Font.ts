/// <reference path="./BaseAsset.ts"/>
/// <reference path="./Type.ts"/>

module Asset {
  export class Font extends BaseAsset {
    
    constructor(alias: string, path: string) {
      super(alias, path, Type.FONT);
    }
    
  }
}