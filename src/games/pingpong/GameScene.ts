/// <reference path="./Viewport.ts"/>
/// <reference path="./Physic.ts"/>
/// <reference path="./Ball.ts"/>
/// <reference path="./StarterPopup.ts"/>
/// <reference path="./PlatformManager.ts"/>
/// <reference path="../../core/scenes/BaseScene.ts"/>
/// <reference path="../../core/resources/Style.ts"/>

module PingPong {
  export class GameScene extends Scene.BaseScene {
    
    protected physic: Physic;
    protected viewport: Viewport;
    protected starter: StarterPopup;
    protected ball: Ball;
    protected platformManager: PlatformManager;
    protected gameActive: boolean;
    
    constructor(physic: Physic) {
      super('GameScene');  
      this.physic = physic;
      this.gameActive = false;
    }
    
    create(): void {
      var bg = new PIXI.Graphics();
      bg.beginFill(0xfae337);
      bg.drawRect(0, 0, this.Share.get('width'), this.Share.get('height'));
      bg.endFill();
      
      this.addChild(bg);
      
      this.viewport = new Viewport();
      this.addChild(this.viewport);
    }
    
    logic(): void {
      
      // The ball cannot be add on create
      // as a stage.addChild will be done on this.physic.addBody
      // Conclusion: the background will hide the background.       
      this.ball = new Ball(this.physic);
      this.ball.onLost = this.endGame.bind(this);
      this.physic.addBody(this.ball.getBody());
      
      this.platformManager = new PlatformManager(this.physic);
      this.platformManager.onBuild = this.startGame.bind(this);
      
      this.starter = new StarterPopup();
      this.starter.open();

      this.physic.addUpdate(() => {
        this.viewport.update();
        this.ball.update();
      });
    }
    
    private startGame() {
      if(this.gameActive) {
        return;
      }
      this.gameActive = true;
      
      this.platformManager.start();
      this.ball.start();
      this.viewport.start();
      
      this.starter.close();
    }
    
    private endGame() {
      if(!this.gameActive) {
        return;
      }
      
      this.gameActive = false;
      
      this.platformManager.stop();
      this.ball.stop();
      this.viewport.stop();
      
      this.starter = new StarterPopup();
      this.starter.open();
    }
     
  }
}