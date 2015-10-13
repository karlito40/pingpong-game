/// <reference path="./LoaderController.ts"/>
/// <reference path="./Loadable.ts"/>

class Loader {
  assets: Array<Loadable>;
  controller: LoaderController;
  
  constructor(controller?: LoaderController) {
    this.controller = controller;
    this.assets = new Array<Loadable>();
  }
  
  add(asset: Loadable): Loader {
    this.assets.push(asset);
    if(this.controller) {
      this.controller.add(asset.getAlias(), asset.getPath());
    }
    return this;    
  }
  
  load(cb: (loader, resources) => void): void {
   if(this.controller) {
     this.controller.load(cb);
   } 
  }
}