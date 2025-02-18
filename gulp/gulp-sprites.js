import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import spritesmith from 'gulp.spritesmith';
import clean from 'rimraf';
import sizeOf from 'image-size';
import mergeStream from 'merge-stream';
import {sync} from 'glob';
import {each} from 'lodash';
import vinylBuffer from 'vinyl-buffer';

// https://github.com/Ensighten/grunt-spritesmith/issues/67#issuecomment-34786248
const MAX_SPRITESHEET_SIZE = 1024 * 1024 * 3;

const IMG_DIST_PATH = 'website/client/src/assets/images/sprites/';
const CSS_DIST_PATH = 'website/client/src/assets/css/sprites/';

function checkForSpecialTreatment(name) {
  const regex = /^hair|skin|beard|mustach|shirt|flower|^headAccessory_special_\w+Ears|^eyewear_special_\w+TopFrame|^eyewear_special_\w+HalfMoon/;
  return name.match(regex) || name === 'head_0';
}

function calculateImgDimensions (img, addPadding) {
  let dims = sizeOf(img);

  const requiresSpecialTreatment = checkForSpecialTreatment(img);
  if (requiresSpecialTreatment) {
    const newWidth = dims.width < 90 ? 90 : dims.width;
    const newHeight = dims.height < 90 ? 90 : dims.height;
    dims = {
      width: newWidth,
      height: newHeight,
    };
  }

  let padding = 0;

  if (addPadding) {
    padding = dims.width * 8 + dims.height * 8;
  }

  if (!dims.width || !dims.height) console.error('MISSING DIMENSIONS:', dims); // eslint-disable-line no-console

  const totalPixelSize = dims.width * dims.height + padding;

  return totalPixelSize;
}

function calculateSpritesheetsSrcIndicies (src) {
  let totalPixels = 0;
  const slices = [0];

  each(src, (img, index) => {
    const imageSize = calculateImgDimensions(img, true);
    totalPixels += imageSize;

    if (totalPixels > MAX_SPRITESHEET_SIZE) {
      slices.push(index - 1);
      totalPixels = imageSize;
    }
  });

  return slices;
}

function cssVarMap (sprite) {
  // For hair, skins, beards, etc. we want to output a '.customize-options.WHATEVER' class,
  // which works as a 60x60 image pointing at the proper part of the 90x90 sprite.
  // We set up the custom info here, and the template makes use of it.
  const requiresSpecialTreatment = checkForSpecialTreatment(sprite.name);
  if (requiresSpecialTreatment) {
    sprite.custom = {
      px: {
        offsetX: `-${sprite.x + 25}px`,
        offsetY: `-${sprite.y + 15}px`,
        width: '60px',
        height: '60px',
      },
    };
  }
  if (sprite.name.indexOf('shirt') !== -1) sprite.custom.px.offsetY = `-${sprite.y + 35}px`; // even more for shirts
  if (sprite.name.indexOf('hair_base') !== -1) {
    const styleArray = sprite.name.split('_').slice(2, 3);
    if (Number(styleArray[0]) > 14) sprite.custom.px.offsetY = `-${sprite.y}px`; // don't crop updos
  }
}

function createSpritesStream (name, src) {
  const spritesheetSliceIndicies = calculateSpritesheetsSrcIndicies(src);
  const stream = mergeStream();

  each(spritesheetSliceIndicies, (start, index) => {
    const slicedSrc = src.slice(start, spritesheetSliceIndicies[index + 1]);

    const spriteData = gulp.src(slicedSrc)
      .pipe(spritesmith({
        imgName: `spritesmith-${name}-${index}.png`,
        cssName: `spritesmith-${name}-${index}.css`,
        algorithm: 'binary-tree',
        padding: 1,
        cssTemplate: 'website/raw_sprites/css/css.template.handlebars',
        cssVarMap,
      }));

    const imgStream = spriteData.img
      .pipe(vinylBuffer())
      .pipe(imagemin())
      .pipe(gulp.dest(IMG_DIST_PATH));

    const cssStream = spriteData.css
      .pipe(gulp.dest(CSS_DIST_PATH));

    stream.add(imgStream);
    stream.add(cssStream);
  });

  return stream;
}

gulp.task('sprites:main', () => {
  const mainSrc = sync('slay-images/**/*.png');
  return createSpritesStream('main', mainSrc);
});

gulp.task('sprites:clean', done => {
  clean(`${IMG_DIST_PATH}spritesmith*,${CSS_DIST_PATH}spritesmith*}`, done);
});

gulp.task('sprites:compile', gulp.series('sprites:clean', 'sprites:main', done => done()));
