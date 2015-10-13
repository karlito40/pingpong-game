/// <reference path="../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../resources/Share.ts"/>

module Scene {
  
  var Share = Resource.Share;
  var CURRENT_SCENE = 'current_scene'; 
  
  export class BaseScene extends PIXI.Container {
    
    protected className: string;
    protected viewName: string;
    protected open: boolean;
    
    constructor(className: string, viewName: string) {
      super();
      
      this.className = className;
      this.viewName = viewName;
      this.open = false;
      this.visible = false;
    
    }
    
    start(): void {
      if(this.open) {
        return;
      }
      
      var currentScene = Share.get(CURRENT_SCENE);
      if(currentScene) {
        currentScene.close();
      }
      
      Share.set(CURRENT_SCENE, this);
      
      this.open = true;
      this.create();
      
      Share.get('stage')
        .addChild(this);
      
      this.visible = true;
      
      
      this.logic();
    }
    
    /**
     * Create the view
     */
    create(): void {
      
    }
    
    /**
     * Add logic to the view (click on button ...)
     */
    logic(): void {
      
    }
    
    /**
     * Close the scene
     */
    close(): void {
      
    }
    
    /**
     * Restart the scene
     */
    restart(): void {
      
    }
    
    /**
     * Attach a popup to the scene
     */
    addPopup(popup: Object): void {
      
    }
    
    /**
     * Destroy every popup from the scene
     */
    removeAllPopup(): void {
      
    }
    
    private clean(): void {
      
    }
    
  }
  
}