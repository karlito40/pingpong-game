/// <reference path="./BaseAsset.ts"/>
/// <reference path="./Type.ts"/>

module Asset {
  export class Sound extends BaseAsset {
  
    constructor(alias: string, path: string) {
      super(alias, path, Type.SOUND);
    }
    
  }  
}
