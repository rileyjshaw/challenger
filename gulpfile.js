var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var to5ify = require('6to5ify');
var paths = require('./paths.js');

var argv = process.argv;
var PROD = argv[argv.length - 1] === '--prod' || argv[2] === 'deploy';

process.env.NODE_ENV = PROD ? 'production' : 'development';

gulp.task('lint', function () {
  return gulp.src(paths.scripts.all)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

var bundler =
  browserify(paths.client.scripts.entry, {
    debug: !PROD,
    standalone: 'scrutineer',
  });

gulp.task('scripts', function() {
  return bundler.transform(to5ify)
    .bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    // if we're in production, uglify it
    .pipe($.if(PROD, $.uglify()))
    // else, hook up sourcemaps
    //.pipe($.if(!PROD, $.sourcemaps.init({loadMaps: true})))
    //.pipe($.if(!PROD, $.sourcemaps.write('./')))
    .pipe(gulp.dest(paths.client.dist));
});

gulp.task('sass', function () {
  return gulp.src(paths.client.stylesheets.entry)
    .pipe($.sass({ indentedSyntax: true }))
    .pipe($.autoprefixer({
      browsers: ['ie >= 8', '> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
    }))
    .pipe(gulp.dest(paths.client.temp));
});

gulp.task('css_concat', ['sass'], function () {
  return gulp.src(paths.client.stylesheets.plugins.concat(paths.client.temp + '*.css'))
    .pipe($.concat('main.css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.client.dist))
});

gulp.task('static', function () {
  return gulp.src(paths.client.static.all, { dot: true })
    .pipe(gulp.dest(paths.client.dist));
});

gulp.task('watch', function () {
  gulp.watch([paths.client.scripts.all, paths.shared.scripts.all], [/*'lint', 'test',*/ 'scripts']);
  gulp.watch([paths.client.stylesheets.all], ['css_concat']);
  gulp.watch([paths.client.static.dir], ['static']);
});

gulp.task('webserver', function () {
  return gulp.src(paths.client.dist)
    .pipe($.webserver({
      host: 'localhost',
      livereload: true,
      open: true
    }));
});

gulp.task('test', ['scripts'], function () {
  return gulp.src(paths.tests.entry, {read: false})
    .pipe($.mocha({reporter: 'nyan'}));
});

gulp.task( 'build', ['scripts', 'css_concat', 'static']);
gulp.task( 'default', [ 'build', 'watch', 'webserver' ] );

gulp.task('deploy', ['build'], function () {
  return gulp.src(paths.client.dist + '/**/*', { dot: true })
    .pipe($.ghPages('https://github.com/rileyjshaw/challenger.git', 'origin'));
});
