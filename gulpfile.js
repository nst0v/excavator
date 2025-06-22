const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');

// Paths
const paths = {
  html: {
    src: 'src/*.html',
    dest: 'docs/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'docs/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'docs/js/'
  },
  public: {
    src: 'public/**/*',
    dest: 'docs/'
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

// Копирование файлов из public с правильной обработкой бинарных файлов
function copyPublic() {
  return gulp.src(paths.public.src, { 
    buffer: true,  // Важно для бинарных файлов
    encoding: false // Не применять кодировку к бинарным файлам
  })
    .pipe(gulp.dest(paths.public.dest));
}

// Watch files
function watchFiles() {
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.public.src, copyPublic);
}

// BrowserSync
function serve() {
  browserSync.init({
    server: {
      baseDir: './docs'
    },
    port: 3000
  });
}

// Build task
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, copyPublic));
const dev = gulp.series(clean, gulp.parallel(html, styles, scripts, copyPublic), gulp.parallel(serve, watchFiles));

// Watch task
const watch = gulp.series(build, gulp.parallel(watchFiles, serve));

// Export tasks
exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.copyPublic = copyPublic;
exports.build = build;
exports.watch = watch;
exports.default = watch;