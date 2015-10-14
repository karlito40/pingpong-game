/// <reference path="./LoaderController.ts"/>
/// <reference path="./ILoadable.ts"/>
/// <reference path="../resources/Share.ts"/>

class Loader {
  assets: Array<ILoadable>;
  controller: LoaderController;
  
  constructor(controller: LoaderController) {
    this.controller = controller;
    this.assets = new Array<ILoadable>();
  }
  
  add(asset: ILoadable): Loader {
    this.assets.push(asset);
    this.controller.add(asset.getAlias(), asset.getPath());
    return this;    
  }
  
  load(cb: () => void): void {
    this.controller.load((loader, resources) => {
      var res = Resource.Share.get('resources') || {};
      for(var key in resources) {
        res[key] = resources[key];
      }
      Resource.Share.set('resources', res);
      cb();
    });
  }
}