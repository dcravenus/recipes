const gulp = require('gulp');
const rename = require('gulp-rename');
//const markdown = require('gulp-markdown');

const markdownIt = require('markdown-it');
const markdownItFrontMatter = require('markdown-it-front-matter');

const through = require('through2');
const fs = require('fs');


gulp.task('default', ['frontMatter']);

gulp.task('frontMatter', ['recipes'], (done) => {
  fs.readFile("dist/front-matter.json", function(err, data){
    const frontMatter = JSON.parse(data);
    let html = '';
    frontMatter.forEach((item)=>{
      html = html + `<p><a href="">${item.title}</a></p>`;
    });
    fs.writeFile("dist/index.html", html, () => {
      fs.unlink("dist/front-matter.json", done)
    });
  });

});

gulp.task('recipes', (done) => {
  const frontMatter = [];
  const md = markdownIt().use(markdownItFrontMatter, function(fm){
    frontMatter.push(JSON.parse(fm));
  });

  var stream = gulp.src('recipes/*.md')
    .pipe(through.obj((file, enc, cb)=>{
      file.contents = new Buffer(md.render(file.contents.toString()));
      cb(null, file);
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest('dist'));

  stream.on('end', function(){
    fs.writeFile("dist/front-matter.json", JSON.stringify(frontMatter), done);
  });
})
