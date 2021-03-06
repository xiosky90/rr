var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build', 'scripts'], function() {
    browserSync({
        server: {
            baseDir: ['_site']
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/default.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});


/**
 * Compile files from assets/js/ into both _site/assets/js (for live injecting) and site (for future jekyll builds)
 */
gulp.task('scripts', function(){
  return gulp.src(paths.script)
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

/** 
 * Patchs for files HTML SCSS and JS 
*/
var paths = {
    html:['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*'],
    scss:['_scss/*.scss', '_scss/**/*.scss'],
    script:['assets/js/*.js']
};

/**
 * Watch scss files for changes & recompile
 * Watch html and js files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.html, ['jekyll-rebuild']);
    gulp.watch(paths.script, ['scripts']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
