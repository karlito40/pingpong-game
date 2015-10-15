var gulp = require('gulp')
, ts = require('gulp-typescript')
, concat = require('gulp-concat')
, runSequence = require('run-sequence');

var builderPath = './public/games/js/game/';

gulp.task('ts', function(){
  gulp.src([
    'src/*/*/*.ts',
    'src/*/*.ts',
    'src/Game.ts',
    'src/Main.ts',
  ])
  .pipe( ts({ out: 'all.js'}) )
  .pipe( gulp.dest(builderPath) );
  
});
