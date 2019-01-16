const gulp = require('gulp');
const sass = require('gulp-sass');
const useref = require('gulp-useref');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("gulp-babel");
const fontSpider = require( 'gulp-font-spider' );
const fileinclude = require('gulp-file-include');
const del = require('del');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const wiredep = require('wiredep').stream;
const plumber = require('gulp-plumber');

const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');

const hashSrc = require('gulp-hash-src');

// 可以通过 gulp-load-plugins 来减少每个插件的引入
// const gulpLoadPlugins = require('gulp-load-plugins');
// const $ = gulpLoadPlugins();

let env = {
  PRODUCT: 'product',
  LOCAL: 'local'
}

let mode = process.argv[2] === 'build' ? env.PRODUCT : env.LOCAL;
mode = env.PRODUCT;

gulp.task('styles', function () {
  let task = gulp.src('./app/styles/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/styles/'))
    .pipe(reload({stream: true}));
  return task;
});

gulp.task('scripts', () => {
  let task = gulp.src('app/scripts/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
  return task;
});

gulp.task('images', function() {
  let task = gulp.src('./app/images/**')
    .pipe(gulp.dest('.tmp/images'))
    .pipe(gulp.dest('dist/images'));
  return task;
});

gulp.task('wiredep', gulp.parallel([], 
  () => {
    let task = gulp.src('app/**/*.html')
      .pipe(wiredep({
        ignorePath: /^(\.\.\/)*\.\./
      }))
      .pipe(gulp.dest('app'))
    return task;
  })
);

gulp.task('html', gulp.series([], 
  () => {
    let task = gulp.src('app/**/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(useref({
      searchPath: ['.tmp', 'app', '.']
    }))

    if(mode == env.PRODUCT){
      task.pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('.css', cssnano({safe: true, autoprefixer: false})))
      .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('.tmp'))
      .pipe(gulp.dest('dist'));
      return task;
    }

    task.pipe(gulp.dest('.tmp'))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}));
    return task;
  })
);


/** css 中引入的图片增加hash */
gulp.task('hash:css', () => {
  return gulp.src('dist/**/*.css')
    .pipe(hashSrc({
      build_dir: 'dist',
      src_path: './app',
      query_name: 'v',
      hash_len: 6
    }))
    .pipe(gulp.dest('dist'));
})

/** html 中引入的标签增加hash，包括：js、img、css */
gulp.task('hash:html', () => {
  return gulp.src('.tmp/**/*.html')
    .pipe(hashSrc({
      build_dir: '.tmp',
      src_path: './app',
      query_name: 'v',
      hash_len: 6,
      regex: /(href|src|pc-bg)\s*=\s*(?:(")([^"]*)|(')([^']*)|([^'"\s>]+))|url\s*\((?:(")([^"]+)|(')([^']+)|([^'"\)]+))/gi
    }))
    .pipe(gulp.dest('dist'));
})

gulp.task('fonts', gulp.series([],
  () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
      .concat('app/fonts/**/*'))
      .pipe(gulp.dest('.tmp/fonts'))
      .pipe(gulp.dest('dist/fonts'));
  })
);

gulp.task('fontspider', gulp.series([],
  () => {
    let task = gulp.src([
      '{.tmp,dist}/**/*.html'
    ])
    .pipe(fontSpider({ignore: ['\.woff2$']}));
    return task;
  }
));

gulp.task('extras', gulp.series([], 
  () => {
    return gulp.src([
      'app/*.*',
      'app/pdf/**/*',
      'app/videos/**/*',
      '!app/*.html'
    ], {
      base: 'app/',
      dot: true
    }).pipe(gulp.dest('dist'));
  })
);

// 清理
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// 开发环境
gulp.task('serve', gulp.series(['wiredep', 'fonts', 'html', 'fontspider', 'styles', 'scripts', 'images'], 
  () => {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    })

    gulp.watch([
      'app/images/**/*'
    ]).on('change', reload);

    gulp.watch('app/**/*.html', gulp.series(['html']));
    gulp.watch('app/styles/**/*.scss', gulp.series(['styles']));
    gulp.watch('app/scripts/**/*.js', gulp.series(['scripts']));
    gulp.watch('app/fonts/**/*', gulp.series(['fonts']));
  })
);

// 生产环境
gulp.task('build', gulp.series(['fonts', 'images', 'html', 'hash:css', 'hash:html', 'fontspider', 'extras'], 
  () => {
    return gulp.src('dist/**/*').pipe(size({title: 'build', gzip: true, showFiles: true}));
  })
);
