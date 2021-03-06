const gulp = require('gulp');
const rename = require('gulp-rename');

const markdownIt = require('markdown-it');
const markdownItFrontMatter = require('markdown-it-front-matter');

const through = require('through2');
const fs = require('fs');
const path = require('path');

const critical = require('critical').stream;
const cleanCSS = require('gulp-clean-css');

const htmlmin = require('gulp-htmlmin');

const postcss = require('gulp-postcss');
const cssDeclarationSorter = require('css-declaration-sorter');

gulp.task('default', ['htmlmin', 'js']);

gulp.task('frontMatter', ['recipes'], (done) => {
  fs.readFile("dist/front-matter.json", function(err, data){
    const frontMatter = JSON.parse(data);
    let html = `
      <link rel="stylesheet" href="main.css">
      <header>
        <label for="recipe-filter">Filter Recipes</label>
        <input id="recipe-filter" type="text" style="display:none;">
      </header>
      <main>
    `;
    frontMatter.forEach((item)=>{
      html = html + `<h3><a href="${item.filename}">${item.title}</a></h3>`;
    });
    html = html + '</main><script src="main.js"></script>';

    fs.writeFile("dist/index.html", html, () => {
      fs.unlink("dist/front-matter.json", done)
    });
  });

});

gulp.task('recipes', (done) => {
  const frontMatter = [];

  var stream = gulp.src('recipes/*.md')
    .pipe(through.obj((file, enc, cb)=>{
      //Get HTML filename
      let filename = path.basename(file.path, '.md') + '.html';

      const md = markdownIt().use(markdownItFrontMatter, function(fm){
        fm = JSON.parse(fm);
        fm.filename = filename;
        frontMatter.push(fm);
      });

      let recipeHTML = md.render(file.contents.toString());
      recipeHTML = '<link rel="stylesheet" href="recipe.css">' + recipeHTML;

      file.contents = new Buffer(recipeHTML);
      cb(null, file);
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest('dist'));

  stream.on('end', function(){
    fs.writeFile("dist/front-matter.json", JSON.stringify(frontMatter), done);
  });
});

gulp.task('prettifycss', () => {
  return gulp.src('*.css')
            .pipe(postcss([cssDeclarationSorter]))
            .pipe(gulp.dest('./'));
});

gulp.task('css', ['prettifycss'], () => {
  return gulp.src('*.css')
      .pipe(cleanCSS())
      .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
  return gulp.src('*.js')
             .pipe(gulp.dest('dist'));
});

gulp.task('critical', ['frontMatter', 'css', '404'], () => {
  return gulp.src('dist/*.html')
      .pipe(critical({
        base: 'dist/',
        inline: true,
        css: ['dist/modest.css']
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('htmlmin', ['critical'], () => {
  return gulp.src('dist/*.html')
      .pipe(htmlmin({
        collapseWhitespace: true
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('404', () => {
  return gulp.src('404.html')
             .pipe(gulp.dest('dist'));
});
