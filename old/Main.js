'use strict';

var Style = Resource.StyleSheet
, Storage = Sys.Storage;

/**
 * Constants
 */
var NB_BOXES = 1
, DEBUG = false                     // Display Fps
, ACTIVE_TRAIL = false
, ACTIVE_TITLE_SONG = false
, FIREWORK_ON_STEP = false          // Firework on new step
, FIREWORK_ON_RECORD = false         // Firework on new record
, STEP_THEME = false                // Color on new step
, RAINBOW_STEP = 10                 // At which step the rainbow mode will be fire
, ALPHA_TUTO = 0.25                  // Alpha of the tuto popup
, ANIM_BALL_ON_HIT = true
, TRAIL_PARTICLE_DELAY = 70
, GRAVITY = 0.002
, JUMP_BY = -0.7
, SCROLL_SPEED = 5
, GARBAGE_DELAY = 2000
, STEP_ALTITUDE = 1000
, TOP_LIMIT = -500
, GARBAGE_TYPE = ['trampoline', 'particle']
, PLATFORM_TUTO = 'tuto'
, PLATFORM_SPEED = SCROLL_SPEED/13; // ok
// , PLATFORM_SPEED = SCROLL_SPEED/10; // ok
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
      .add('bg-party', 'res/bg-party.png')
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


    function fireworkAlSuperGay() {
      var nbParticles = 10;
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

    scroller.onStepReach = function(step) {
      ball.rainbowMode = (step >= RAINBOW_STEP);
      if(!step) {
        return;
      }

      var color = 0x000000;
      if(!colorTrail[colorTrailI]) {
        colorTrailI = 0;
      }
      color = colorTrail[colorTrailI++];

      ball.setTrail(color);

      if(FIREWORK_ON_STEP) {
        fireworkAlSuperGay();
      }
    };

    scroller.onRecord = function() {
      if(FIREWORK_ON_RECORD) {
        fireworkAlSuperGay();
      }
    };

    worldManager.addUpdate(scroller.update.bind(scroller));

    var hasEnd = false;
    var staticPlatforms = [];
    var startScreen = new Game.StartScreen();

    // Le tutorial declenche la chute de la balle
    startScreen.onClose = function() {
      hasEnd = false;
      colorTrailI = 0;
      ball.setTrail(0x000000);
      ball.active();
      scroller.active();
    }
    startScreen.start();

    var ball = new Game.Ball();


    // Le sortie de la balle declenche le end game
    // ce qui engendre l'affichage du tuto
    var nbParty = 1;
    ball.onMove = function(pos) {
      // pos.y < TOP_LIMIT to fix a physic bug engine
      if(pos.y < TOP_LIMIT || pos.y > height && !hasEnd) {
        nbParty++;

        hasEnd = true;
        staticPlatforms = [];

        scroller.stop();
        ball.stop();
        worldManager.removeBodies('trampoline');

        Storage.set('nbGame', nbParty);

        var currentAltitude = scroller.getAltitude();
        var altitudeRecord = Storage.get('altitudeRecord');
        if(!altitudeRecord || altitudeRecord < currentAltitude) {
          Storage.set('altitudeRecord', currentAltitude);
        }

        startScreen.start();
        platformMaker.reset();

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

      startScreen.close();
    }

    worldManager.addEvents([
      ball.getEvents(),
      platformMaker.getEvents()
    ]);


  }

  Main();



})();
