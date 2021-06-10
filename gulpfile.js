
const project_folder = "dist";
const source_folder = "src";

const path = {
  build: {
    html: project_folder + "/",
    php: project_folder + "/php/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: source_folder + "/html/*.html",
    php: source_folder + "/php/**/*.php",
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.+(png|jpg|gif|ico|webp|svg)",
    fonts: source_folder + "/fonts/*.+(otf|ttf|woff|woff2)",
  },
  watch: {
    html: source_folder + "/**/*.html",
    php: source_folder + "/php/**/*.php",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.+(png|jpg|gif|ico|webp)",
  },
  clean: "./" + project_folder + "/",
};

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");
const prettyHtml = require('gulp-pretty-html');
const scss = require("gulp-sass");
const autoPrefixer = require("gulp-autoprefixer");
const groupMedia = require("gulp-group-css-media-queries");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const cheerio = require("gulp-cheerio");
const babel = require("gulp-babel");
const ghPages = require("gulp-gh-pages");
//const realFavicon = require('gulp-real-favicon');
const del = require("del");
const fs = require('fs');

gulp.task("html", function () { // setting html
  return gulp.src(path.src.html)
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(prettyHtml({
      indent_size: 3
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
});

gulp.task("php", function () { // setting html
  return gulp.src(path.src.php)
    .pipe(gulp.dest(path.build.php))
    .pipe(browserSync.stream());
});

gulp.task("css", function () {  // setting css
  return gulp.src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded", //compressed
      })
    )
    .pipe(groupMedia())
    .pipe(
      autoPrefixer({
        //overrideBrowserslist: ["defaults"],
        cascade: true,
      })
    )
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task("js", function () { // setting js
  return gulp.src(path.src.js)
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});

gulp.task("img", function () { // setting image
  return gulp.src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: true }],
        interlaced: true,
        optimizationLevel: 5, // 0 to 7
      })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
});

gulp.task('fonts', async function () { // setting fonts
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
})

gulp.task("browser-sync", function () { // setting browser
  browserSync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
});

gulp.task('clean', function () { // setting clean
  return del(path.clean);
});

gulp.task('watch', function () { // setting watch
  gulp.watch([path.watch.html], gulp.parallel('html'));
  gulp.watch([path.watch.css], gulp.parallel('css'));
  gulp.watch([path.watch.js], gulp.parallel('js'));
  gulp.watch([path.watch.img], gulp.parallel('img'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'php', 'js', 'img', 'css', 'fonts')));

gulp.task('default', gulp.parallel('build', 'watch', 'browser-sync'));
