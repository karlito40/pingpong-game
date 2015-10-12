/// <reference path="./AssetBase.ts"/>
/// <reference path="./Type.ts"/>

module Asset {
  export class Sound extends AssetBase {
  
    constructor(alias: string, path: string) {
      super(alias, path, Type.SOUND);
    }
    
  }  
}
