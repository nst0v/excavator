const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');

// Paths - изменяем на docs
const paths = {
  html: {
    src: 'src/*.html',
    dest: 'docs/'  // Изменено с 'dist/' на 'docs/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'docs/css/'  // Изменено с 'dist/css/' на 'docs/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'docs/js/'  // Изменено с 'dist/js/' на 'docs/js/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'docs/images/'  // Изменено с 'dist/images/' на 'docs/images/'
  }
};

// Clean docs folder
function clean(cb) {
  if (fs.existsSync('docs')) {
    fs.rmSync('docs', { recursive: true, force: true });
  }
  cb();
}

// HTML task
function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Styles task
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: ['src/scss']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Scripts task
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Images task
function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

// Watch files
function watchFiles() {
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
}

// BrowserSync
function serve() {
  browserSync.init({
    server: {
      baseDir: './docs'  // Изменено с './dist' на './docs'
    },
    port: 3000
  });
}

// Build task
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, images));

// Watch task
const watch = gulp.series(build, gulp.parallel(watchFiles, serve));

// Export tasks
exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;