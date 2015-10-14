/// <reference path="./loaders/Loader.ts"/>

class BaseApp {
  protected loaderEntry: Loader;
  protected loaderGame: Loader;
  
  constructor() {
    this.loaderEntry = new Loader(PIXI.loader);
    this.loaderGame = new Loader(PIXI.loader);
  }
  
  /**
   * Return the loader app (logo, youssoupha, ...)
   */
  getLoaderEntry(): Loader {
    return this.loaderEntry;
  }
  
  /**
   * Return the loader game (sound, assets, ...)
   */
  getLoaderGame(): Loader {
    return this.loaderGame;
  }
}