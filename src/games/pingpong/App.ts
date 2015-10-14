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
      console.log('app start todo')

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
          .add(new Asset.Font('OogieBoogie', 'public/fonts/OogieBoogie/OogieBoogie.fnt'))
          .add(new Asset.Font('OogieBoogieMin', 'public/fonts/OogieBoogie/OogieBoogieMin.fnt'))
          .add(new Asset.Image('youssy-ball', 'public/images/youssy-ball.png'))
          .add(new Asset.Image('bg-cloud', 'public/images/bg-cloud.png'))
          .add(new Asset.Image('bg-record', 'public/images/bg-record.png'))
          .add(new Asset.Image('bg-party', 'public/images/bg-party.png'))
          .add(new Asset.Image('pencil', 'public/images/pencil.png'))
          .add(new Asset.Image('line', 'public/images/line.png'))
          .add(new Asset.Image('circle', 'public/images/circle.png'))
          .add(new Asset.Image('youss', 'public/images/youss.png'))
          .add(new Asset.Image('sep', 'public/images/sep.png'));
        
        this.loaderGame.load(() => {
          console.log('loader game complete')
          splashScene.close();
        });
        
      });
      
      
      
    }     
  }  
}
