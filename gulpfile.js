var gulp = require("gulp");
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task("ts", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['./src/js/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest("./dist/js"));
});

// gulp.task('ts-app', function() {
//     return gulp.src('./src/app.ts')
//         .pipe(ts({
//             declaration: true
//         }))
//         .pipe(gulp.dest('./dist/'));
// });

gulp.task('ts-app', function() {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('style', function() {
    gulp.src('./src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('style watcher',function() {
    gulp.watch('src/css/*.scss',['styles']);
});

gulp.task('ts watcher',function() {
    gulp.watch('src/public/js/*.ts',['ts']);
    gulp.watch('src/*.ts',['ts-app']);
});