module PingPong {
  
  export class Config {
    static DEBUG = false;
    static FIREWORK_ON_STEP = false;
    static FIREWORK_ON_RECORD = false;
    static STEP_THEME = false;
    static RAINBOW_STEP = 10;
    static ALPHA_TUTO = 0.25;
    static TRAIL_PARTICLE_DELAY = 70;
    static GRAVITY_MIN = 0.002;
    static GRAVITY_MAX = 0.002;
    static JUMP_BY = -0.7;
    static GARBAGE_DELAY = 2000;
    static STEP_ALTITUDE = 1000;
    static TOP_LIMIT = -500;
    static GARBAGE_TYPE = ['trampoline', 'particle'];
    static PLATFORM_TUTO = 'tuto';
    
    static SCROLL_SPEED = 5;
    // static PLATFORM_SPEED = 0.5;
    static PLATFORM_SPEED_MIN = 0.2;
    static PLATFORM_SPEED_MAX = 0.5;
  }
  
}