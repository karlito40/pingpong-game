// var typescript = require('gulp-tsc')
var gulp = require('gulp')
, ts = require('gulp-typescript')
, concat = require('gulp-concat')
, runSequence = require('run-sequence');

var builderPath = './public/js/game/';

gulp.task('ts', function(){
  gulp.src([
    'src/*/*/*.ts',
    'src/*/*.ts',
    'src/Game.ts',
    'src/Main.ts',
  ])
  // .pipe(typescript())
  .pipe( ts({ out: 'all.js'}) )
  .pipe( gulp.dest(builderPath) );
  
});


// gulp.task('concat', function() {
//   gulp.src([
//     builderPath + '*/*.js',
//     builderPath + 'Game.js',
//     builderPath + 'Main.js',
//   ])
//   .pipe(concat('all.js'))
//   .pipe(gulp.dest(builderPath))
// });

