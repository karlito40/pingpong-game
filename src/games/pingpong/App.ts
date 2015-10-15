/// <reference path="./GameScene.ts"/>
/// <reference path="./Physic.ts"/>
/// <reference path="./SplashScene.ts"/>
/// <reference path="../../core/scenes/FantouchScene.ts"/>
/// <reference path="../../core/BaseApp.ts"/>
/// <reference path="../../core/assets/Font.ts"/>
/// <reference path="../../core/assets/Image.ts"/>
/// <reference path="../../core/assets/Sound.ts"/>


module PingPong {
  
  export class App extends BaseApp {
    
    protected physic: Physic;
      
    constructor() {
      super();
      console.log('init ping pong game')
      this.physic = new Physic();
    }
    
    start(): void {

      var gameScene = new GameScene(this.physic);  
      
      var splashScene = new SplashScene(true, 0x000000);
      splashScene.onClose = gameScene.start.bind(gameScene);
      
      var fantouchScene = new Scene.FantouchScene();
      fantouchScene.onClose = splashScene.start.bind(splashScene);
  
      // Load the app asset
      this.loaderEntry.load(() => {
        console.log('loader entry complete')
        fantouchScene.start();  
      
        // Load the game asset
        this.loaderGame
          .add(new Asset.Image('youssy-splash', '/games/images/youssy-splash.png'))
          .add(new Asset.Image('youssy-ball', '/games/images/youssy-ball.png'))
          .add(new Asset.Image('left-gold', '/games/images/left-gold.png'))
          .add(new Asset.Image('repeat-gold', '/games/images/repeat-gold.png'))
          .add(new Asset.Image('repeat-brown', '/games/images/repeat-brown.png'))
          .add(new Asset.Image('left-brown', '/games/images/left-brown.png'))
          .add(new Asset.Image('bg-cloud', '/games/images/bg-cloud.png'))
          .add(new Asset.Image('bg-record', '/games/images/bg-record.png'))
          .add(new Asset.Image('bg-party', '/games/images/bg-party.png'))
          .add(new Asset.Image('pencil', '/games/images/pencil.png'))
          .add(new Asset.Image('line', '/games/images/line.png'))
          .add(new Asset.Image('circle', '/games/images/circle.png'))
          .add(new Asset.Image('youss', '/games/images/youss.png'))
          .add(new Asset.Image('sep', '/games/images/sep.png'));
        
        this.loaderGame.load(() => {
          console.log('loader game complete')
          fantouchScene.close();
        });
        
      });
      
      
      
    }     
  }  
}
