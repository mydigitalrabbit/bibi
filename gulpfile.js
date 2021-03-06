/*!
 *                                                                                                                                (℠)
 *  # gulpfile for Bibi
 *
 */

'use strict';

const gulp = require('gulp'), del = require('del'), fs = require('fs'), rename = require('gulp-rename'), zip = require('gulp-zip');

const Package = JSON.parse(fs.readFileSync('package.json'));
const Bibi = require('./bibi.info.js');

gulp.task('clean', done => {
    del.sync([
        '**/.DS_Store',
        '**/Thumbs.db',
        'LICENSE',
        '*.md',
        'bibi/*.html',
        'bibi/and',
        'bibi/extensions',
        'bibi/presets',
        'bibi/resources',
        'bibi/wardrobe',
        'bib/i/*.html',
        'bib/i.js',
        'bib/i/presets'
    ].map(
        X => Bibi.DIST + '/' + X
    ));
    [
        'bibi',
        'bibi-bookshelf',
        'bib/i',
      //'bib/bookshelf',
        'bib'
    ].forEach(Dir => {
        try { Dir = Bibi.DIST + '/' + Dir ; if(!fs.readdirSync(Dir).length) del.sync(Dir); } catch(E) {}
    });
    del.sync(Bibi.ARCHIVETMP);
    done();
});

gulp.task('initialize', done => {
    [
        'bibi',
        'bibi-bookshelf'
    ].concat(Bibi.WithBCK ? [
        'bib',
        'bib/i',
      //'bib/bookshelf'
    ] : []).forEach(Dir => {
        fs.mkdirSync((Bibi.ForPack ? Bibi.ARCHIVETMP : Bibi.DIST) + '/' + Dir, { recursive: true });
    });
    done();
});

gulp.task('reset', gulp.series(
    'clean',
    'initialize'
));

gulp.task('make:dress-template', () => {
    return gulp.src([
        Bibi.SRC + '/bibi/wardrobe/_dress-codes/**',
    ], {
        base: Bibi.SRC + '/bibi/wardrobe/_dress-codes'
    }).pipe(gulp.dest(
        Bibi.SRC + '/bibi/wardrobe/DRESS-TEMPLATE-' + new Date(Date.now() + 1000 * 60 * 60 * (new Date().getTimezoneOffset() / -60)).toISOString().split('.')[0].replace(/[-:]/g, '').replace('T', '-')
    ));
});

gulp.task('make:package', () => {
    const PackageName = (Package.name == 'bibi' ? 'Bibi' : Package.name) + '-v' + Package.version + (Bibi.WithBCK ? '_with_BackCompatKit' : '') + '.zip';
    del.sync([
        Bibi.ARCHIVES + '/' + PackageName
    ]);
    return gulp.src([
        'LICENSE',
        'README.md',
        'bibi/*.html',
        'bibi/and/**',
        'bibi/extensions/**',
        'bibi/presets/**',
        'bibi/resources/**',
        'bibi/wardrobe/**',
        'bibi-bookshelf'
    ].concat(Bibi.WithBCK ? [
        'README.BackCompatKit.md',
        'bib/i/*.html',
        'bib/i.js',
        'bib/i/presets/**',
      //'bib/bookshelf'
    ] : []).map(
        X => Bibi.ARCHIVETMP + '/' + X
    ), {
        base: Bibi.ARCHIVETMP
    }).pipe(zip(
        PackageName
    )).pipe(gulp.dest(
        Bibi.ARCHIVES
    ));
});
