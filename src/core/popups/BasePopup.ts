/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../resources/Share.ts"/>
/// <reference path="../scenes/BaseScene.ts"/>
/// <reference path="./IPopup.ts"/>
/// <reference path="../../../typings/greensock/greensock.d.ts"/>

module Popup {
  
  var Share = Resource.Share;
  
  export abstract class BasePopup extends PIXI.Container implements IPopup {
    
    static current = null;
    static id: number = 0;
    
    protected filterAlpha: number;
    protected openState: boolean;
    protected filter: PIXI.Graphics;
    
    onClose: Function;
    
    abstract create(): void;
    
    constructor() {
      super();
      
      this.filterAlpha = 0.55;
      this.openState = false;
      this.onClose = null;
    }
    
    open(): void {
      BasePopup.current = this;
      this.openState = true;
      this.alpha = 0;
      
      this.addFilter();
      
      this.create();
      
      Scene.BaseScene
        .getCurrent()
        .addPopup(this);
          
      TweenLite.to(this, 0.5, {alpha: 1});
      
    }
    
    protected addFilter(): void {
      this.filter = new PIXI.Graphics();
      this.filter.beginFill(0x000000)
        .drawRect(0, 0, Share.get('width'), Share.get('height'))
        .endFill();

	     this.filter.alpha = this.filterAlpha;

	     this.addChild(this.filter);
    }
    
    close(): void {
      if(!this.openState) {
        return ;
      }
      
      BasePopup.current = null;
      this.openState = false;
      if(this.onClose) {
        this.onClose();
      }
      
      TweenMax.to(this, 0.3, {alpha: 0, onComplete: () => {
        Scene.BaseScene
          .getCurrent()
          .removePopup(this);
      }});
      
    }
    
  }
  
}