const { src, dest, parallel, watch, task} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

function style() {
  return src([
    'node_modules/bootstrap/scss/bootstrap.scss',
    'src/scss/*.scss'
  ])
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
}


function js() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
  ], { sourcemaps: true })
  .pipe(concat('app.min.js'))
  .pipe(dest("src/js", { sourcemaps: true }))
  .pipe(browserSync.stream());
}

function image() {
  return src('src/img/**/*')
  .pipe(imagemin())
  .pipe(dest('src/imgmin'))
  .pipe(browserSync.stream());
}

function watchFile() {
  browserSync.init({
    server: {
      baseDir: './src'
    },
    browser: 'chrome'
  });
  watch('./src/scss/**/*.scss', style);
  watch('./src/img/**/*', image);
  watch('./src/**/*.html').on('change', browserSync.reload);
  watch('./src/js/**/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.js = js;
exports.image = image;
exports.watchFile = parallel(js, style, image, watchFile);
