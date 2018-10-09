(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const main = {
  /**
   * conver base64-image string to Image (HTMLImageElement instance) asynchronously
   * @param  {string} base64
   * @returns {Promise}
   */
  image64ToImage(base64) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = base64;
      image.onload = function() {
        resolve(this);
      };
      image.onerror = function() {
        reject(this);
      };
    });
  },

  /**
   * conver base64-image string to canvas
   * @param  {string} base64
   * @returns {Promise}
   */
  async image64ToCanvas(base64) {
    const img = await this.image64ToImage(base64);
    return this.imageToCanvas(img);
  },

  /**
   * conver image string to canvas
   * @param  {Image} image
   * @returns {Canvas}
   */
  imageToCanvas(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return canvas;
  },

  /**
   * resize base64-string
   * @param  {string} base64
   * @param  {integer} newWidth
   * @param  {integer} newHeight
   * @returns {Promise} with base64-image
   */
  async resizeImage64(base64, newWidth, newHeight) {
    const img = await this.image64ToImage(base64);
    return this.resizeImage(img, newWidth, newHeight);
  },

  /**
   * resize image (HTMLImageElement instance)
   * @param  {image} image
   * @param  {integer} newWidth
   * @param  {integer} newHeight
   * @returns {string} base64-image string
   */
  resizeImage(image, newWidth, newHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    return canvas.toDataURL('image/jpeg');
  },

  /**
   * cropping image from base64-image string
   * @param  {string} base64
   * @param  {integer} x
   * @param  {integer} y
   * @param  {integer} newWidth
   * @param  {integer} newHeight
   * @returns {Promise} with base64-image string
   */
  async cropImage64(base64, x, y, newWidth, newHeight) {
    const img = await this.image64ToImage(base64);
    return this.cropImage(img, x, y, newWidth, newHeight);
  },

  /**
   * cropping image (HTMLImageElement instance)
   * @param  {image} image
   * @param  {integer} x
   * @param  {integer} y
   * @param  {integer} newWidth
   * @param  {integer} newHeight
   * @returns {string} base64-image string
   */
  cropImage(image, x, y, newWidth, newHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, x, y, newWidth, newHeight, 0, 0, newWidth, newHeight);
    return canvas.toDataURL('image/jpeg');
  },

  /**
   * calculating parameter for vertical crop
   * @param  {integer} imageWidth=0
   * @param  {integer} imageHeight=0
   * @param  {integer} items=0
   * @returns {array} [[x, y, newWidth, newHeight]...]
   */
  calculateVerticalCrop(imageWidth = 0, imageHeight = 0, items = 0) {
    if (imageWidth === 0 || imageHeight === 0 || items === 0) {
      return [];
    }

    const oneUnit = Math.floor(imageWidth / items);
    const widthArr = Array(...Array(items)).map(
      Number.prototype.valueOf,
      oneUnit,
    );
    if (imageWidth % items !== 0) {
      widthArr[widthArr.length - 1] =
        imageWidth - (widthArr.length - 1) * oneUnit;
    }

    return widthArr.map((el, index, arr) => {
      const subArray = arr.slice(0, index);
      const newX =
        subArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        ) || 0;

      return [newX, 0, el, imageHeight];
    });
  },

  /**
   * calculating parameter for horizontal crop
   * @param  {integer} imageWidth=0
   * @param  {integer} imageHeight=0
   * @param  {integer} items=0
   * @returns {array} [[x, y, newWidth, newHeight]...]
   */
  calculateHorizontalCrop(imageWidth = 0, imageHeight = 0, items = 0) {
    if (imageWidth === 0 || imageHeight === 0 || items === 0) {
      return [];
    }

    const oneUnit = Math.floor(imageHeight / items);
    const heightArr = Array(...Array(items)).map(
      Number.prototype.valueOf,
      oneUnit,
    );
    if (imageHeight % items !== 0) {
      heightArr[heightArr.length - 1] =
        imageHeight - (heightArr.length - 1) * oneUnit;
    }

    return heightArr.map((el, index, arr) => {
      const subArray = arr.slice(0, index);
      const newY =
        subArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        ) || 0;

      return [0, newY, imageWidth, el];
    });
  },
};

module.exports = main;

},{}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],5:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":9}],6:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":11}],7:[function(require,module,exports){
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],8:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],9:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],10:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],11:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],12:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":14}],13:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


}).call(this,require('_process'))
},{"_process":14}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
module.exports = require('./lib/_stream_duplex.js');

},{"./lib/_stream_duplex.js":16}],16:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};
},{"./_stream_readable":18,"./_stream_writable":20,"core-util-is":6,"inherits":10,"process-nextick-args":13}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":19,"core-util-is":6,"inherits":10}],18:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var destroyImpl = require('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":16,"./internal/streams/BufferList":21,"./internal/streams/destroy":22,"./internal/streams/stream":23,"_process":14,"core-util-is":6,"events":8,"inherits":10,"isarray":24,"process-nextick-args":13,"safe-buffer":31,"string_decoder/":25,"util":3}],19:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":16,"core-util-is":6,"inherits":10}],20:[function(require,module,exports){
(function (process,global,setImmediate){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = require('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"./_stream_duplex":16,"./internal/streams/destroy":22,"./internal/streams/stream":23,"_process":14,"core-util-is":6,"inherits":10,"process-nextick-args":13,"safe-buffer":31,"timers":42,"util-deprecate":43}],21:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
var util = require('util');

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}
},{"safe-buffer":31,"util":3}],22:[function(require,module,exports){
'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":13}],23:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":8}],24:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],25:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":31}],26:[function(require,module,exports){
module.exports = require('./readable').PassThrough

},{"./readable":27}],27:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":16,"./lib/_stream_passthrough.js":17,"./lib/_stream_readable.js":18,"./lib/_stream_transform.js":19,"./lib/_stream_writable.js":20}],28:[function(require,module,exports){
module.exports = require('./readable').Transform

},{"./readable":27}],29:[function(require,module,exports){
module.exports = require('./lib/_stream_writable.js');

},{"./lib/_stream_writable.js":20}],30:[function(require,module,exports){
(function (process,setImmediate){
var through = require('through');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = function (write, end) {
    var tr = through(write, end);
    tr.pause();
    var resume = tr.resume;
    var pause = tr.pause;
    var paused = false;
    
    tr.pause = function () {
        paused = true;
        return pause.apply(this, arguments);
    };
    
    tr.resume = function () {
        paused = false;
        return resume.apply(this, arguments);
    };
    
    nextTick(function () {
        if (!paused) tr.resume();
    });
    
    return tr;
};

}).call(this,require('_process'),require("timers").setImmediate)
},{"_process":14,"through":41,"timers":42}],31:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":5}],32:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":8,"inherits":10,"readable-stream/duplex.js":15,"readable-stream/passthrough.js":26,"readable-stream/readable.js":27,"readable-stream/transform.js":28,"readable-stream/writable.js":29}],33:[function(require,module,exports){
(function (process,setImmediate){
var defined = require('defined');
var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var createResult = require('./lib/results');
var through = require('through');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function' && process.browser !== true
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

exports = module.exports = (function () {
    var harness;
    var lazyLoad = function () {
        return getHarness().apply(this, arguments);
    };
    
    lazyLoad.only = function () {
        return getHarness().only.apply(this, arguments);
    };
    
    lazyLoad.createStream = function (opts) {
        if (!opts) opts = {};
        if (!harness) {
            var output = through();
            getHarness({ stream: output, objectMode: opts.objectMode });
            return output;
        }
        return harness.createStream(opts);
    };
    
    return lazyLoad
    
    function getHarness (opts) {
        if (!opts) opts = {};
        opts.autoclose = !canEmitExit;
        if (!harness) harness = createExitHarness(opts);
        return harness;
    }
})();

function createExitHarness (conf) {
    if (!conf) conf = {};
    var harness = createHarness({
        autoclose: defined(conf.autoclose, false)
    });
    
    var stream = harness.createStream({ objectMode: conf.objectMode });
    var es = stream.pipe(conf.stream || createDefaultStream());
    if (canEmitExit) {
        es.on('error', function (err) { harness._exitCode = 1 });
    }
    
    var ended = false;
    stream.on('end', function () { ended = true });
    
    if (conf.exit === false) return harness;
    if (!canEmitExit || !canExit) return harness;
    
    var _error;

    process.on('uncaughtException', function (err) {
        if (err && err.code === 'EPIPE' && err.errno === 'EPIPE'
        && err.syscall === 'write') return;
        
        _error = err
        
        throw err
    })

    process.on('exit', function (code) {
        if (_error) {
            return
        }

        if (!ended) {
            var only = harness._results._only;
            for (var i = 0; i < harness._tests.length; i++) {
                var t = harness._tests[i];
                if (only && t.name !== only) continue;
                t._exit();
            }
        }
        harness.close();
        process.exit(code || harness._exitCode);
    });
    
    return harness;
}

exports.createHarness = createHarness;
exports.Test = Test;
exports.test = exports; // tap compat
exports.test.skip = Test.skip;

var exitInterval;

function createHarness (conf_) {
    if (!conf_) conf_ = {};
    var results = createResult();
    if (conf_.autoclose !== false) {
        results.once('done', function () { results.close() });
    }
    
    var test = function (name, conf, cb) {
        var t = new Test(name, conf, cb);
        test._tests.push(t);
        
        (function inspectCode (st) {
            st.on('test', function sub (st_) {
                inspectCode(st_);
            });
            st.on('result', function (r) {
                if (!r.ok && typeof r !== 'string') test._exitCode = 1
            });
        })(t);
        
        results.push(t);
        return t;
    };
    test._results = results;
    
    test._tests = [];
    
    test.createStream = function (opts) {
        return results.createStream(opts);
    };
    
    var only = false;
    test.only = function (name) {
        if (only) throw new Error('there can only be one only test');
        results.only(name);
        only = true;
        return test.apply(null, arguments);
    };
    test._exitCode = 0;
    
    test.close = function () { results.close() };
    
    return test;
}

}).call(this,require('_process'),require("timers").setImmediate)
},{"./lib/default_stream":34,"./lib/results":35,"./lib/test":36,"_process":14,"defined":7,"through":41,"timers":42}],34:[function(require,module,exports){
(function (process){
var through = require('through');
var fs = require('fs');

module.exports = function () {
    var line = '';
    var stream = through(write, flush);
    return stream;
    
    function write (buf) {
        for (var i = 0; i < buf.length; i++) {
            var c = typeof buf === 'string'
                ? buf.charAt(i)
                : String.fromCharCode(buf[i])
            ;
            if (c === '\n') flush();
            else line += c;
        }
    }
    
    function flush () {
        if (fs.writeSync && /^win/.test(process.platform)) {
            try { fs.writeSync(1, line + '\n'); }
            catch (e) { stream.emit('error', e) }
        }
        else {
            try { console.log(line) }
            catch (e) { stream.emit('error', e) }
        }
        line = '';
    }
};

}).call(this,require('_process'))
},{"_process":14,"fs":4,"through":41}],35:[function(require,module,exports){
(function (process,setImmediate){
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var through = require('through');
var resumer = require('resumer');
var inspect = require('object-inspect');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = Results;
inherits(Results, EventEmitter);

function Results () {
    if (!(this instanceof Results)) return new Results;
    this.count = 0;
    this.fail = 0;
    this.pass = 0;
    this._stream = through();
    this.tests = [];
}

Results.prototype.createStream = function (opts) {
    if (!opts) opts = {};
    var self = this;
    var output, testId = 0;
    if (opts.objectMode) {
        output = through();
        self.on('_push', function ontest (t, extra) {
            if (!extra) extra = {};
            var id = testId++;
            t.once('prerun', function () {
                var row = {
                    type: 'test',
                    name: t.name,
                    id: id
                };
                if (has(extra, 'parent')) {
                    row.parent = extra.parent;
                }
                output.queue(row);
            });
            t.on('test', function (st) {
                ontest(st, { parent: id });
            });
            t.on('result', function (res) {
                res.test = id;
                res.type = 'assert';
                output.queue(res);
            });
            t.on('end', function () {
                output.queue({ type: 'end', test: id });
            });
        });
        self.on('done', function () { output.queue(null) });
    }
    else {
        output = resumer();
        output.queue('TAP version 13\n');
        self._stream.pipe(output);
    }
    
    nextTick(function next() {
        var t;
        while (t = getNextTest(self)) {
            t.run();
            if (!t.ended) return t.once('end', function(){ nextTick(next); });
        }
        self.emit('done');
    });
    
    return output;
};

Results.prototype.push = function (t) {
    var self = this;
    self.tests.push(t);
    self._watch(t);
    self.emit('_push', t);
};

Results.prototype.only = function (name) {
    if (this._only) {
        self.count ++;
        self.fail ++;
        write('not ok ' + self.count + ' already called .only()\n');
    }
    this._only = name;
};

Results.prototype._watch = function (t) {
    var self = this;
    var write = function (s) { self._stream.queue(s) };
    t.once('prerun', function () {
        write('# ' + t.name + '\n');
    });
    
    t.on('result', function (res) {
        if (typeof res === 'string') {
            write('# ' + res + '\n');
            return;
        }
        write(encodeResult(res, self.count + 1));
        self.count ++;

        if (res.ok) self.pass ++
        else self.fail ++
    });
    
    t.on('test', function (st) { self._watch(st) });
};

Results.prototype.close = function () {
    var self = this;
    if (self.closed) self._stream.emit('error', new Error('ALREADY CLOSED'));
    self.closed = true;
    var write = function (s) { self._stream.queue(s) };
    
    write('\n1..' + self.count + '\n');
    write('# tests ' + self.count + '\n');
    write('# pass  ' + self.pass + '\n');
    if (self.fail) write('# fail  ' + self.fail + '\n')
    else write('\n# ok\n')

    self._stream.queue(null);
};

function encodeResult (res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.toString().replace(/\s+/g, ' ') : '';
    
    if (res.skip) output += ' # SKIP';
    else if (res.todo) output += ' # TODO';
    
    output += '\n';
    if (res.ok) return output;
    
    var outer = '  ';
    var inner = outer + '  ';
    output += outer + '---\n';
    output += inner + 'operator: ' + res.operator + '\n';
    
    if (has(res, 'expected') || has(res, 'actual')) {
        var ex = inspect(res.expected);
        var ac = inspect(res.actual);
        
        if (Math.max(ex.length, ac.length) > 65) {
            output += inner + 'expected:\n' + inner + '  ' + ex + '\n';
            output += inner + 'actual:\n' + inner + '  ' + ac + '\n';
        }
        else {
            output += inner + 'expected: ' + ex + '\n';
            output += inner + 'actual:   ' + ac + '\n';
        }
    }
    if (res.at) {
        output += inner + 'at: ' + res.at + '\n';
    }
    if (res.operator === 'error' && res.actual && res.actual.stack) {
        var lines = String(res.actual.stack).split('\n');
        output += inner + 'stack:\n';
        output += inner + '  ' + lines[0] + '\n';
        for (var i = 1; i < lines.length; i++) {
            output += inner + lines[i] + '\n';
        }
    }
    
    output += outer + '...\n';
    return output;
}

function getNextTest (results) {
    if (!results._only) {
        return results.tests.shift();
    }
    
    do {
        var t = results.tests.shift();
        if (!t) continue;
        if (results._only === t.name) {
            return t;
        }
    } while (results.tests.length !== 0)
}

function has (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),require("timers").setImmediate)
},{"_process":14,"events":8,"inherits":10,"object-inspect":40,"resumer":30,"through":41,"timers":42}],36:[function(require,module,exports){
(function (process,setImmediate,__dirname){
var Stream = require('stream');
var deepEqual = require('deep-equal');
var defined = require('defined');
var path = require('path');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Test;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

inherits(Test, EventEmitter);

var getTestArgs = function (name_, opts_, cb_) {
    var name = '(anonymous)';
    var opts = {};
    var cb;
    
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var t = typeof arg;
        if (t === 'string') {
            name = arg;
        }
        else if (t === 'object') {
            opts = arg || opts;
        }
        else if (t === 'function') {
            cb = arg;
        }
    }
    return { name: name, opts: opts, cb: cb };
};

function Test (name_, opts_, cb_) {
    if (! (this instanceof Test)) {
        return new Test(name_, opts_, cb_);
    }

    var args = getTestArgs(name_, opts_, cb_);

    this.readable = true;
    this.name = args.name || '(anonymous)';
    this.assertCount = 0;
    this.pendingCount = 0;
    this._skip = args.opts.skip || false;
    this._plan = undefined;
    this._cb = args.cb;
    this._progeny = [];
    this._ok = true;

    for (prop in this) {
        this[prop] = (function bind(self, val) {
            if (typeof val === 'function') {
                return function bound() {
                    return val.apply(self, arguments);
                };
            }
            else return val;
        })(this, this[prop]);
    }
}

Test.prototype.run = function () {
    if (!this._cb || this._skip) {
        return this._end();
    }
    this.emit('prerun');
    try {
        this._cb(this);
    }
    catch (err) {
        this.error(err);
        this._end();
        return;
    }
    this.emit('run');
};

Test.prototype.test = function (name, opts, cb) {
    var self = this;
    var t = new Test(name, opts, cb);
    this._progeny.push(t);
    this.pendingCount++;
    this.emit('test', t);
    t.on('prerun', function () {
        self.assertCount++;
    })
    
    if (!self._pendingAsserts()) {
        nextTick(function () {
            self._end();
        });
    }
    
    nextTick(function() {
        if (!self._plan && self.pendingCount == self._progeny.length) {
            self._end();
        }
    });
};

Test.prototype.comment = function (msg) {
    this.emit('result', msg.trim().replace(/^#\s*/, ''));
};

Test.prototype.plan = function (n) {
    this._plan = n;
    this.emit('plan', n);
};

Test.prototype.end = function (err) { 
    var self = this;
    if (arguments.length >= 1) {
        this.ifError(err);
    }
    
    if (this.calledEnd) {
        this.fail('.end() called twice');
    }
    this.calledEnd = true;
    this._end();
};

Test.prototype._end = function (err) {
    var self = this;
    if (this._progeny.length) {
        var t = this._progeny.shift();
        t.on('end', function () { self._end() });
        t.run();
        return;
    }
    
    if (!this.ended) this.emit('end');
    var pendingAsserts = this._pendingAsserts();
    if (!this._planError && this._plan !== undefined && pendingAsserts) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount
        });
    }
    this.ended = true;
};

Test.prototype._exit = function () {
    if (this._plan !== undefined &&
        !this._planError && this.assertCount !== this._plan) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount,
            exiting : true
        });
    }
    else if (!this.ended) {
        this.fail('test exited without ending', {
            exiting: true
        });
    }
};

Test.prototype._pendingAsserts = function () {
    if (this._plan === undefined) {
        return 1;
    }
    else {
        return this._plan - (this._progeny.length + this.assertCount);
    }
};

Test.prototype._assert = function assert (ok, opts) {
    var self = this;
    var extra = opts.extra || {};
    
    var res = {
        id : self.assertCount ++,
        ok : Boolean(ok),
        skip : defined(extra.skip, opts.skip),
        name : defined(extra.message, opts.message, '(unnamed assert)'),
        operator : defined(extra.operator, opts.operator)
    };
    if (has(opts, 'actual') || has(extra, 'actual')) {
        res.actual = defined(extra.actual, opts.actual);
    }
    if (has(opts, 'expected') || has(extra, 'expected')) {
        res.expected = defined(extra.expected, opts.expected);
    }
    this._ok = Boolean(this._ok && ok);
    
    if (!ok) {
        res.error = defined(extra.error, opts.error, new Error(res.name));
    }
    
    var e = new Error('exception');
    var err = (e.stack || '').split('\n');
    var dir = path.dirname(__dirname) + '/';
    
    for (var i = 0; i < err.length; i++) {
        var m = /^\s*\bat\s+(.+)/.exec(err[i]);
        if (!m) continue;
        
        var s = m[1].split(/\s+/);
        var filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[1]);
        if (!filem) {
            filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[3]);
            
            if (!filem) continue;
        }
        
        if (filem[1].slice(0, dir.length) === dir) continue;
        
        res.functionName = s[0];
        res.file = filem[1];
        res.line = Number(filem[2]);
        if (filem[3]) res.column = filem[3];
        
        res.at = m[1];
        break;
    }
    
    self.emit('result', res);
    
    var pendingAsserts = self._pendingAsserts();
    if (!pendingAsserts) {
        if (extra.exiting) {
            self._end();
        } else {
            nextTick(function () {
                self._end();
            });
        }
    }
    
    if (!self._planError && pendingAsserts < 0) {
        self._planError = true;
        self.fail('plan != count', {
            expected : self._plan,
            actual : self._plan - pendingAsserts
        });
    }
};

Test.prototype.fail = function (msg, extra) {
    this._assert(false, {
        message : msg,
        operator : 'fail',
        extra : extra
    });
};

Test.prototype.pass = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'pass',
        extra : extra
    });
};

Test.prototype.skip = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'skip',
        skip : true,
        extra : extra
    });
};

Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= function (value, msg, extra) {
    this._assert(value, {
        message : msg,
        operator : 'ok',
        expected : true,
        actual : value,
        extra : extra
    });
};

Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= function (value, msg, extra) {
    this._assert(!value, {
        message : msg,
        operator : 'notOk',
        expected : false,
        actual : value,
        extra : extra
    });
};

Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= function (err, msg, extra) {
    this._assert(!err, {
        message : defined(msg, String(err)),
        operator : 'error',
        actual : err,
        extra : extra
    });
};

Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.is
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= function (a, b, msg, extra) {
    this._assert(a === b, {
        message : defined(msg, 'should be equal'),
        operator : 'equal',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNotEqual
= Test.prototype.isNot
= Test.prototype.not
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= function (a, b, msg, extra) {
    this._assert(a !== b, {
        message : defined(msg, 'should not be equal'),
        operator : 'notEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.same
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.deepLooseEqual
= Test.prototype.looseEqual
= Test.prototype.looseEquals
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notDeepEqual
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should not be equivalent'),
        operator : 'notDeepEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.notDeepLooseEqual
= Test.prototype.notLooseEqual
= Test.prototype.notLooseEquals
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'notDeepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype['throws'] = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    }
    catch (err) {
        caught = { error : err };
        var message = err.message;
        delete err.message;
        err.message = message;
    }

    var passed = caught;

    if (expected instanceof RegExp) {
        passed = expected.test(caught && caught.error);
        expected = String(expected);
    }

    this._assert(passed, {
        message : defined(msg, 'should throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error: !passed && caught && caught.error,
        extra : extra
    });
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    }
    catch (err) {
        caught = { error : err };
    }
    this._assert(!caught, {
        message : defined(msg, 'should not throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error : caught && caught.error,
        extra : extra
    });
};

function has (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

Test.skip = function (name_, _opts, _cb) {
    var args = getTestArgs.apply(null, arguments);
    args.opts.skip = true;
    return Test(args.name, args.opts, args.cb);
};

// vim: set softtabstop=4 shiftwidth=4:

}).call(this,require('_process'),require("timers").setImmediate,"/node_modules/tape/lib")
},{"_process":14,"deep-equal":37,"defined":7,"events":8,"inherits":10,"path":12,"stream":32,"timers":42}],37:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":38,"./lib/keys.js":39}],38:[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],39:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],40:[function(require,module,exports){
module.exports = function inspect_ (obj, opts, depth, seen) {
    if (!opts) opts = {};
    
    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
    if (depth === undefined) depth = 0;
    if (depth > maxDepth && maxDepth > 0) return '...';
    
    if (seen === undefined) seen = [];
    else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }
    
    function inspect (value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }
    
    if (typeof obj === 'string') {
        return inspectString(obj);
    }
    else if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    }
    else if (obj === null) {
        return 'null';
    }
    else if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.tagName).toLowerCase() + '>';
        return s;
    }
    else if (isArray(obj)) {
        if (obj.length === 0) return '[]';
        var xs = Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    else if (typeof obj === 'object' && typeof obj.inspect === 'function') {
        return obj.inspect();
    }
    else if (typeof obj === 'object' && !isDate(obj) && !isRegExp(obj)) {
        var xs = [], keys = [];
        for (var key in obj) {
            if (has(obj, key)) keys.push(key);
        }
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (/[^\w$]/.test(key)) {
                xs.push(inspect(key) + ': ' + inspect(obj[key], obj));
            }
            else xs.push(key + ': ' + inspect(obj[key], obj));
        }
        if (xs.length === 0) return '{}';
        return '{ ' + xs.join(', ') + ' }';
    }
    else return String(obj);
};

function quote (s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray (obj) {
    return {}.toString.call(obj) === '[object Array]';
}

function isDate (obj) {
    return {}.toString.call(obj) === '[object Date]';
}

function isRegExp (obj) {
    return {}.toString.call(obj) === '[object RegExp]';
}

function has (obj, key) {
    if (!{}.hasOwnProperty) return key in obj;
    return {}.hasOwnProperty.call(obj, key);
}

function nameOf (f) {
    if (f.name) return f.name;
    var m = f.toString().match(/^function\s*([\w$]+)/);
    if (m) return m[1];
}

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
}

function isElement (x) {
    if (!x || typeof x !== 'object') return false;
    if (typeof HTMLElement !== 'undefined') {
        return x instanceof HTMLElement;
    }
    else return typeof x.nodeName === 'string'
        && typeof x.getAttribute === 'function'
    ;
}

function inspectString (str) {
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return "'" + s + "'";
    
    function lowbyte (c) {
        var n = c.charCodeAt(0);
        var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
        if (x) return '\\' + x;
        return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
    }
}

},{}],41:[function(require,module,exports){
(function (process){
var Stream = require('stream')

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}


}).call(this,require('_process'))
},{"_process":14,"stream":32}],42:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":14,"timers":42}],43:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],44:[function(require,module,exports){
module.exports =
  'data:image/jpeg;base64,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';

},{}],45:[function(require,module,exports){
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

},{"../index":1,"./assets/test_img_01":44,"tape":33}]},{},[45]);
