/// <reference path="./GameScene.ts"/>
/// <reference path="./Physic.ts"/>
/// <reference path="../../core/scenes/SplashScene.ts"/>
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
      var splashScene = new Scene.SplashScene();
      splashScene.onClose = () => {
        gameScene.start()
      };
  
      // Load the app asset
      this.loaderEntry.load(() => {
        console.log('loader entry complete')
        splashScene.start();  
      
        // Load the game asset
        this.loaderGame
          .add(new Asset.Font('OogieBoogie', 'fonts/OogieBoogie/OogieBoogie.fnt'))
          .add(new Asset.Font('OogieBoogieMin', 'fonts/OogieBoogie/OogieBoogieMin.fnt'))
          .add(new Asset.Image('youssy-ball', 'images/youssy-ball.png'))
          .add(new Asset.Image('bg-cloud', 'images/bg-cloud.png'))
          .add(new Asset.Image('bg-record', 'images/bg-record.png'))
          .add(new Asset.Image('bg-party', 'images/bg-party.png'))
          .add(new Asset.Image('pencil', 'images/pencil.png'))
          .add(new Asset.Image('line', 'images/line.png'))
          .add(new Asset.Image('circle', 'images/circle.png'))
          .add(new Asset.Image('youss', 'images/youss.png'))
          .add(new Asset.Image('sep', 'images/sep.png'));
        
        this.loaderGame.load(() => {
          console.log('loader game complete')
          splashScene.close();
        });
        
      });
      
      
      
    }     
  }  
}
