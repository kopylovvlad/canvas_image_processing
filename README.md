# canvas image processing

Canvas Image Processing (cip) is easy image processing by canvas.
It can work in nodejs and in browser.
Micro lib for image resizing and cropping without any dependencies.

## Example of usage

```js
const CIP = require('canvas_image_processing');
const canvas_item = CIP.image64ToCanvas(base64_image_string);
```

## Methods

```js
/* converting */
// conver base64-image string to Image (HTMLImageElement instance)
CIP.image64ToImage(base64Image);
// conver base64-image string to Image (HTMLImageElement instance) asynchronously
CIP.image64ToImageAsync(base64Image);
// conver base64-image string to canvas
CIP.image64ToCanvas(base64Image);
// conver image string to canvas
CIP.imageToCanvas(image);

/* resizing */
// resize base64-string
CIP.resizeImage64(base64, newWidth, newHeight);
// resize image (HTMLImageElement instance)
CIP.resizeImage(image, newWidth, newHeight);

/* cropping */

// cropping image from base64-image string
CIP.cropImage64(base64, x, y, newWidth, newHeight);
// cropping image (HTMLImageElement instance)
CIP.cropImage(image, x, y, newWidth, newHeight);

/* calculations */

// calculating parameter for vertical crop
CIP.calculateVerticalCrop((imageWidth = 0), (imageHeight = 0), (items = 0));
// calculating parameter for horizontal crop
CIP.calculateHorizontalCrop((imageWidth = 0), (imageHeight = 0), (items = 0));
```

## Installation

With [npm](https://npmjs.org) do

```bash
$ npm install canvas_image_processing
```

With [yarn](https://yarnpkg.com/en/) do

```bash
$ yarn add canvas_image_processing
```

## License

(MPL-2.0)
