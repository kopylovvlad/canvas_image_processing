const CIP = require('../index');
const test = require('tape');
const testImage64 = require('./assets/test_img_01');

test('image64ToImage', function(t) {
  CIP.image64ToImage(testImage64).then(function(el) {
    t.ok(el instanceof HTMLImageElement);
    t.ok(el.src.length === 91895);
    console.log('image64ToImage image:', el.src);
    t.end();
  });
});

test('image64ToCanvas', function(t) {
  CIP.image64ToCanvas(testImage64).then(function(el) {
    t.ok(el instanceof HTMLCanvasElement);
    t.end();
  });
});

test('imageToCanvas', function(t) {
  CIP.image64ToImage(testImage64).then(function(el) {
    let canv = CIP.imageToCanvas(el);
    t.ok(canv instanceof HTMLCanvasElement);
    t.end();
  });
});

test('resizeImage64', function(t) {
  CIP.resizeImage64(testImage64, 200, 200).then(function(el_str) {
    console.log('resizeImage64 image', el_str);
    t.ok(el_str.length === 3031);
    CIP.image64ToImage(el_str).then(function(el) {
      t.ok(el instanceof HTMLImageElement);
      t.ok(el.width === 200);
      t.ok(el.height === 200);
      t.end();
    });
  });
});

test('resizeImage', function(t) {
  CIP.image64ToImage(testImage64).then(function(el_image) {
    let el_str = CIP.resizeImage(el_image, 250, 250);
    t.ok(el_str.length === 4367);
    console.log('resizeImage image :', el_str);
    CIP.image64ToImage(el_str).then(function(el) {
      t.ok(el instanceof HTMLImageElement);
      t.ok(el.width === 250);
      t.ok(el.height === 250);
      t.end();
    });
  });
});

test('cropImage64', function(t) {
  CIP.cropImage64(testImage64, 0, 0, 200, 250).then(function(el_str) {
    console.log('cropImage64 image: ', el_str);
    t.ok(el_str.length === 2795);
    CIP.image64ToImage(el_str).then(function(el) {
      t.ok(el instanceof HTMLImageElement);
      t.ok(el.width === 200);
      t.ok(el.height === 250);
      t.end();
    });
  });
});

test('cropImage', function(t) {
  CIP.image64ToImage(testImage64).then(function(el_image) {
    let cropped_str = CIP.cropImage(el_image, 0, 0, 300, 350);
    console.log('cropImage image: ', cropped_str);
    t.ok(cropped_str.length === 5211);
    CIP.image64ToImage(cropped_str).then(function(el) {
      t.ok(el instanceof HTMLImageElement);
      t.ok(el.width === 300);
      t.ok(el.height === 350);
      t.end();
    });
  });
});

test('calculateVerticalCrop', function(t) {
  items = CIP.calculateVerticalCrop(360, 300, 3);
  t.deepEqual(items, [
    [0, 0, 120, 300],
    [120, 0, 120, 300],
    [240, 0, 120, 300],
  ]);
  t.end();
});

test('calculateHorizontalCrop', function(t) {
  items = CIP.calculateHorizontalCrop(360, 300, 3);
  t.deepEqual(items, [
    [0, 0, 360, 100],
    [0, 100, 360, 100],
    [0, 200, 360, 100],
  ]);
  t.end();
});
