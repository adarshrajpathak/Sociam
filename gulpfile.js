const gulp=require('gulp'); //task runner to automate workflow
const sass=require('gulp-sass')(require('node-sass'));  //scss->css
const cssnano=require('gulp-cssnano');  //minifying css
const uglify=require('gulp-uglify-es').default;
// const rev=require('gulp-rev');   CommonJS import
// import rev from 'gulp-rev';  .mjs or in package.json "type":"module"
let rev;    //rename file with content hash

function loadRev() {
    return import('gulp-rev').then((module) => {
        rev = module.default;
    });
}
// const imagemin=require('gulp-imagemin'); //requireOrImport may try
let imagemin;
function loadImageMin() {
    return import('gulp-imagemin').then((module) => {
        imagemin = module.default;
    });
}
// const del=require('del');
let del;
function loadDel() {
    return import('del').then((module) => {
        del = module;
    });
}

function css() {    //css task
    console.log("minifying css........");
    gulp.src('./assets/sass/**/*.scss') //scss->css
    //pipe function calling all the plugins, acting as middleware with the gulp
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));   //destination of scss->css files compile into one assets.css
    
    //should be returned to mark completion or use done callback function in args css(done){ at last done();}
    return gulp.src('./assets/**/*.css')    //rename from
    .pipe(rev())    //revise name
    .pipe(gulp.dest('./public/assets'))     //destination of changed named files
    // .pipe(rev.manifest({        //store manifest(mapping of file names)
    //     cwd:'public',   //overrides the cwd of manifest file
    //     merge:true  //if already exits manifest files
    // }))
    .pipe(gulp.dest('./public/assets'));    //destination of manifest json
}

function js(done){
    console.log('minifying js.....');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    // .pipe(rev.manifest({
    //     cwd:'public',
    //     merge:true
    // }))
    // .pipe(gulp.dest('./public/assets'));
    done();
}

function images(done){
    console.log('Compressing Images.....');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    // .pipe(rev.manifest({
    //     cwd:'public',
    //     merge:true
    // }))
    // .pipe(gulp.dest('./public/assets/'));
    done();
}
function manifest(done) {
    gulp.src('./assets/**/*')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
}
//empty the public/assets (whenever building project clear prev. build)
gulp.task('clean:assets',function(done){
    del.deleteSync(['./public/assets'],{force:true});
    done();
})

//running all task(independently)
gulp.task('build', gulp.series(loadDel,'clean:assets', loadRev, css, js, loadImageMin, images, manifest, function(done){
    console.log('Building assets:)');
    done();
}));    //for the synchronous import of the rev

