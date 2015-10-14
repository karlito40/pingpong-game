/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../../typings/greensock/greensock.d.ts"/>
/// <reference path="../resources/Share.ts"/>
/// <reference path="../popups/IPopup.ts"/>

module Scene {
  
  var CURRENT_SCENE = 'current_scene'; 
  
  export abstract class BaseScene extends PIXI.Container {
    
    onClose: Function;
    
    protected className: string;
    protected open: boolean;
    protected popups: Array<Popup.IPopup>;
    protected stage: PIXI.Container;
    protected Share: any;
    protected layerMask: any;
    
    abstract create(): void;
    abstract logic(): void;
    
    static getCurrent(): BaseScene {
      return Resource.Share.get(CURRENT_SCENE);
    }
    
    constructor(className: string) {
      super();
      
      this.className = className;
      this.open = false;
      // this.visible = false;
      this.popups = new Array<Popup.IPopup>();
      this.onClose = null;
      this.Share = Resource.Share;
      this.stage = this.Share.get('stage');
    }
    
    /**
     * Attach the scene to the current stage
     */
    start(): void {
      if(this.open) {
        return;
      }
      
      var currentScene = this.Share.get(CURRENT_SCENE);
      if(currentScene) {
        currentScene.close();
      }
      
      this.Share.set(CURRENT_SCENE, this);
      
      this.open = true;
      this.create();
      
      this.stage.addChild(this);
      
      this.animOpen();
      
      this.logic();
    }
    
    protected animOpen(): void {
      this.layerMask = new PIXI.Graphics();
      this.layerMask.beginFill(0x000000)
        .drawRect(0, 0, this.Share.get('width'), this.Share.get('height'))
        .endFill();
    
      this.addChild(this.layerMask);
      
      TweenLite.to(this.layerMask, 0.7, {alpha: 0});
    }
    
    /**
     * Close the scene
     */
    close(): void {
      if(!this.open) {
        return;
      }
      
      this.removeAllPopup();
      this.Share.set(CURRENT_SCENE, null);
      this.open = false;
      this.clean();
      
      if(this.onClose) {
        this.onClose();
      }
      
    }
    
    /**
     * Restart the scene
     */
    restart(): void {
      var restartScene = new Scene[this.className]();
      restartScene.start();
    }
    
    /**
     * Attach a popup to the scene
     */
    addPopup(popup: Popup.IPopup): void {
      this.popups.push(popup);
      this.stage.addChild(popup);
    }
    
    /**
     * Destroy every popup from the scene
     */
    removeAllPopup(): void {
      this.popups.forEach((popup) => {
        this.stage.removeChild(popup);
      });
      
      this.popups.length = 0;
    }
    
    /**
     * Remove a specific popup
     */
    removePopup(popup): void {
      var index: number = this.popups.indexOf(popup);
      if(index == -1) {
        return;
      }
      
      this.popups.splice(index, 1);
    }
    
    private clean(): void {
      this.stage.removeChild(this);
    }
    
  }
  
}