/// <reference path="./Config.ts"/>
/// <reference path="./GameScene.ts"/>
/// <reference path="../../core/scenes/SplashScene.ts"/>
/// <reference path="../../core/resources/Style.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="../../core/BaseApp.ts"/>
/// <reference path="../../core/assets/Font.ts"/>
/// <reference path="../../core/assets/Image.ts"/>
/// <reference path="../../core/assets/Sound.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>

module PingPong {
  
  var Style = Resource.Style;
  var Share = Resource.Share;
  
  export class App extends BaseApp {
    
    protected world: PhysicsWorld;
    protected renderer: PixiRenderer;
      
    constructor() {
      super();
      console.log('init ping pong game')
       
      // Create a world
      Physics({}, this.onWorldReady.bind(this));
    }
    
    /**
     * World configuration
     */
    onWorldReady(world: PhysicsWorld): void {
      this.world = world;
      
      this.renderer = <PixiRenderer> Physics.renderer('pixi', {
        el: 'viewport',
        meta: Config.DEBUG,
        autoResize: true,
        styles: {
          'color': Style.get('background'),
          'circle': Style.get('circle'),
          'rectangle': Style.get('line')
        }
      });
      
      Share.set('width', this.renderer.width);
      Share.set('height', this.renderer.height);
      Share.set('renderer', this.renderer);
      Share.set('stage', this.renderer.stage);
      
      var gravity = Physics.behavior('constant-acceleration', {
        acc: { x : 0, y: Config.GRAVITY } 
      });

      this.world.add([
        this.renderer,
        gravity,
        Physics.behavior('body-impulse-response'),
        Physics.behavior('body-collision-detection'),
        Physics.behavior('sweep-prune')
      ]);
      
      Physics.util.ticker.on((time, dt) => {
        Share.set('dt', dt);
        this.world.step(time);
      });
      
      this.world.on('step', () => {
        this.world.render();
      });
      
    }
    
    start(): void {
      console.log('app start todo')

      var gameScene = new GameScene(this.world);  
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
