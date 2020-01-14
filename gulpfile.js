const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

//compile scss to css
function ScssToCss() {
    return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}


function watch() {
    browserSync.init({
        server: {
            baseDir: "./src",
            index: "/index.html"
        },
        port: 3405
    });

    gulp.watch("src/scss/**/*.scss", ScssToCss);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./js/**/*.js").on('change', browserSync.reload);
}

exports.ScssToCss = ScssToCss;
exports.watch = watch;