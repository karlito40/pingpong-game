'use strict';

/**
 * config
 */



/**
 * Code studio
 */

var Resource = Resource || {}
, Game = Game || {}
, PIXI = PIXI || {}
, Style = Resource.StyleSheet;

/**
 * Constants
 */
var NB_BOXES = 1
, DEBUG = false
, FIREWORK = false
, STEP_THEME = false
, RADIUS_POINT = 10
, RAINBOW_STEP = 10
, ALPHA_TUTO = 0.4
// , TRAIL_PARTICLE_DELAY = 50
, TRAIL_PARTICLE_DELAY = 40
// , GRAVITY = 0.0004
// , JUMP_BY = -0.35
// , GRAVITY = 0.0015
, GRAVITY = 0.002
, JUMP_BY = -0.7
// , JUMP_BY = -0.6
, SCROLL_SPEED = 5
, GARBAGE_DELAY = 2000
, STEP_ALTITUDE = 1000
, GARBAGE_TYPE = ['trampoline', 'particle']
, PLATFORM_TUTO = 'tuto'
, PLATFORM_SPEED = SCROLL_SPEED/13; // ok
// , PLATFORM_SPEED = 0;


(function(){
  var colorTrail = [
    0x000000,
    0xfe0000, // Red
    0x0024ff, // Blue
    0xc500ff, // Purple
    0xff009c, // Pink
  ];
  var colorTrailI = 0;
  
  function Main() {
    PIXI.loader
      .add('OogieBoogie', 'res/OogieBoogie/OogieBoogie.fnt')
      .add('OogieBoogieMin', 'res/OogieBoogie/OogieBoogieMin.fnt')
      .add('youssy-ball', 'res/youssy-ball.png')
      .add('bg-cloud', 'res/bg-cloud.png')
      .add('bg-record', 'res/bg-record.png')
      .add('pencil', 'res/pencil2.png')
      .add('line', 'res/line.png')
      .add('circle', 'res/circle2.png')
      .add('youss', 'res/youss.png')
      .add('sep', 'res/sep.png')
      .load(Scenary);
  }
  
  function Scenary(loader, resources) {
    Resource.Share.set('resources', resources);

    var worldManager = new Game.WorldManager();
    var height = Resource.Share.get('height');
    var width = Resource.Share.get('width');
  
    var scroller = new Game.Scroller();
    
    scroller.onStepReach = function(step) {
      if(!step) {
        return;
      }
      ball.rainbowMode = (step >= RAINBOW_STEP);
      var color = 0x000000;
      if(!colorTrail[colorTrailI]) {
        colorTrailI = 0;
      }
      color = colorTrail[colorTrailI++];
      
      ball.setTrail(color);
      
      if(FIREWORK) {
        var nbParticles = 50;
        for(var i=0; i<nbParticles; i++) {
          var x = ~~(Math.random() * width);
          var y = height;
          var p = new Game.Particle(x, y, {
            radius: ~~(Math.random() * 20) + 20, 
            rainbow: true
          });
          p.fire('drop');
          
        }  
      }
    };
    
    worldManager.addUpdate(scroller.update.bind(scroller));
    
    var hasEnd = false;
    var staticPlatforms = [];
    var tutorialScreen = new Game.TutorialScreen();
    
    // Le tutorial declenche la chute de la balle
    tutorialScreen.onClose = function() {
      hasEnd = false;
      colorTrailI = 0;
      ball.setTrail(0x000000);
      ball.active();
      scroller.active();
    }
    tutorialScreen.start();
    
    var ball = new Game.Ball();
    
    
    // Le sortie de la balle declenche le end game
    // ce qui engendre l'affichage du tuto
    var nbParty = 1;
    ball.onMove = function(pos) {
      if(pos.y > height && !hasEnd) {
        nbParty++;
        hasEnd = true;
        staticPlatforms = [];
        
        ball.stop();
        
        worldManager.removeBodies('trampoline');
        
        tutorialScreen.start();
        platformMaker.reset();
        scroller.stop();
      } 
    };
    
    function startStaticPlatform() {
      if(!staticPlatforms.length) {
        return;
      }
      
      staticPlatforms.forEach(function(trampoline){
        var vx = trampoline.state.vel.x;
        trampoline.state.vel.set(vx, PLATFORM_SPEED);
      });
      staticPlatforms = [];
    }
    
    ball.onAfterCollision = function() {
      startStaticPlatform();  
    }
    
    worldManager.addUpdate(ball.update.bind(ball));
        
    // La création d'une plateforme déclenche la fin du tutoriel
    var platformMaker = new Game.PlatformMaker();
    platformMaker.onBuild = function(trampoline){
      if(!trampoline.state.vel.y) {
        staticPlatforms.push(trampoline);  
      } else if(staticPlatforms.length) {
        startStaticPlatform();
      }
      
      tutorialScreen.close();
    }
    
    worldManager.addEvents([
      ball.getEvents(),
      platformMaker.getEvents()
    ]);
    
    
  }
  
  Main();
  
  
  
})();
