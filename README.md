# canvas image processing

Canvas Image Processing (cip) is easy image processing by canvas.
It works in browser.
Micro lib for image resizing and cropping without any dependencies.

## Example of usage

Crop and resize image from file-input

```js
/* <input type="file" onchange="action"> */
const CIP = require('canvas_image_processing');

function action(event) {
  if (event.target.files[0]) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      let base64_image = e.target.result;

      CIP.cropImage64(base64_image, 0, 0, 200, 200).then(cropped_image => {
        console.log('cropped base64 image: ', cropped_image);
      });

      CIP.resizeImage64(base64_image, 600, 600).then(cropped_image => {
        console.log('resized base64 image: ', cropped_image);
      });
    };
    reader.readAsDataURL(file);
  }
}
```

## Methods

```js
/* converting */

// convert base64-image string to Image (HTMLImageElement instance) asynchronously
// returns promise with HTMLImageElement
CIP.image64ToImage(base64Image);

// convert base64-image string to canvas
// returns promise with HTMLCanvasElement
CIP.image64ToCanvas(base64Image);

// convert image string to canvas
// returns HTMLCanvasElement element
CIP.imageToCanvas(image);

/* resizing */

// resize base64-string
// returns promise with base64 string
CIP.resizeImage64(base64, newWidth, newHeight);

// resize image (HTMLImageElement instance)
// returns base64 string
CIP.resizeImage(image, newWidth, newHeight);

/* cropping */

// cropping image from base64-image string
// returns promise with base64 string
CIP.cropImage64(base64, x, y, newWidth, newHeight);

// cropping image (HTMLImageElement instance)
// returns base64 string
CIP.cropImage(image, x, y, newWidth, newHeight);

/* calculations */

// calculating parameter for vertical crop
// returns array like [[x, y, newWidth, newHeight]...]
CIP.calculateVerticalCrop((imageWidth = 0), (imageHeight = 0), (items = 0));

// calculating parameter for horizontal crop
// returns array like [[x, y, newWidth, newHeight]...]
CIP.calculateHorizontalCrop((imageWidth = 0), (imageHeight = 0), (items = 0));
```

## Installation

With [npm](https://npmjs.org) do

```bash
$ npm install canvas_image_processing
```

With [yarn](https://yarnpkg.com) do

```bash
$ yarn add canvas_image_processing
```

## Run test

```bash
yarn test
```

## License

(MPL-2.0)
