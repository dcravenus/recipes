const gulp = require('gulp');
const rename = require('gulp-rename');
//const markdown = require('gulp-markdown');

const markdownIt = require('markdown-it');
const markdownItFrontMatter = require('markdown-it-front-matter');

const through = require('through2');

gulp.task('default', (done) => {

/*
    gulp.src('recipes/*.md')
        .pipe(markdown())
        .pipe(rename({
          extname: ".html"
        }))
        .pipe(gulp.dest('dist'))

*/

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
    console.log(frontMatter);
    done();
  });

});

gulp.task('test', () => {
  console.log('test');
  var foo = 0;
  foo++;
  console.log(foo);
})
