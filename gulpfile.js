var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;          
var miniJS  = require('gulp-uglify'); 
var sass = require('gulp-sass');     
var replace = require('gulp-replace');
var cssBase64 = require('gulp-base64');  
var autoprefixer = require('gulp-autoprefixer');
var px2rem = require('gulp-px2rem-plugin');


/*sass开发*/
gulp.task('sass_dev', function() {
    return gulp.src('src/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0','last 3 Explorer versions','Firefox >= 20'],
            cascade: true, 
            remove:true 
         }))
        // .pipe(px2rem({'width_design':750,'valid_num':2,'pieces':7.5}))
        .pipe(gulp.dest('src/css/'))
        .pipe(reload({stream:true}))
})


gulp.task('server', function() {
    browserSync({
        ui:false,
        server: {
            baseDir: 'src',
            directory: true
        },
        notify: false,
        ghostMode:false,
        port: 8080,
        open: "external"
    }, function(err, arg) {
        console.log('loaclhost:8080');
    })
})


gulp.task('default', [
    'sass_dev',
    'server'
], function() {
    gulp.watch('src/html/*.html', reload);
    gulp.watch('src/js/*.js',reload);
    gulp.watch('src/sass/*.scss',['sass_dev']);
})
