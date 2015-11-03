/**
 * Inspired by the awesome emoji-rain from Monica Dinculescu <@notwaldorf>
 * https://github.com/notwaldorf/emoji-rain
 */

function Rain(options = { baseurl: '' }) {
  this.options = Object.assign({}, options);
  this.imageQuantity = 250;
  this._boundAnimate = this._animate.bind(this);
  return this;
}

Rain.prototype.init = function() {
  this.imagesForDrawing = [];

  this._imageSrc = [
    '/assets/images/icon-npm.png',
    '/assets/images/icon-wombat.png',
    '/assets/images/icon-heart.png'
  ];

  this._images = this._getImages();
  this._totalImages = this._images.length;

  this.canvas = this._createCanvas();
  this.context = this.canvas.getContext('2d');
  this.context.fillStyle = 'black';

  this._resizeWindow();
  this._scaleCanvas();
  this._generateImages();

  // Care about window resizing.
  window.addEventListener('resize', () => {
    this._resizeWindow();
  }, false);

  return this;
};

Rain.prototype.start = function() {
  this.active = true;
  this._animate();
  this.canvas.removeAttribute('hidden');
};

Rain.prototype.stop = function() {
  this.active = false;
  clearTimeout(this.timeout);
  window.cancelAnimationFrame(this.animationFrame);
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvas.setAttribute('hidden', 'true');
};

Rain.prototype._getImages = function() {
  var images = this._imageSrc.map((src) => {
    var img = new Image();
    img.src = this.options.baseurl + src;
    return img;
  });
  return images;
};

Rain.prototype._createCanvas = function() {
  var canvas = document.createElement('canvas');
  canvas.hidden = true;
  canvas.style.cssText = [
    'background: transparent',
    'position: fixed',
    'top: 0',
    'left:0',
    'z-index: 1'
  ].join(';');
  document.body.appendChild(canvas);
  return canvas;
};

Rain.prototype._animate = function() {
  this.timeout = setTimeout(() => {
    this.animationFrame = window.requestAnimationFrame(this._boundAnimate);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0, l = this.imagesForDrawing.length; i < l; i++) {
      this._paintImage(this.imagesForDrawing[i]);
    }
  }, 1000 / 60);
};

/**
 * Gets you an ready-to-be-used image object.
 * @return {Object}
 */
Rain.prototype.giveMeARandomImage = function() {
  var image = {}

  // 1 to window size
  image.x = Math.floor((Math.random() * this.canvas.width) + 1);
  image.y = Math.floor((Math.random() * this.canvas.height) + 1);

  // I am pulling these numbers out of a hat.
  image.speed = Math.floor(Math.random() * 10 + 1);
  image.opacity = 1;
  image.opacitySpeed = 0.02 * (Math.random() * 2 + 1);
  image.img = this._images[Math.floor((Math.random() * this._totalImages))];
  return image;
};

/**
 * Draws one image on the canvas.
 * @param {Object}
 */
Rain.prototype._paintImage = function(image) {
  var isEven = image.arrayIndex % 2;
  var size = isEven ? 20 : 30;
  if (image.y >= this.canvas.height || image.opacity < 0.1) {
    var i = image.arrayIndex;
    image = this.giveMeARandomImage();
    image.arrayIndex = i;
    this.imagesForDrawing[i] = image;
  }
  else {
    image.y += image.speed;
    image.opacity -= image.opacitySpeed;
  }
  this.context.globalAlpha = image.opacity;
  this.context.drawImage(image.img, image.x, image.y, size, size);
  this.context.restore();
},

/**
 * Create a set of images.
 */
Rain.prototype._generateImages = function() {
  this.imagesForDrawing = [];
  for (let i = 0; i < this.imageQuantity; i++) {
    let drop = this.giveMeARandomImage();
    drop.arrayIndex = i;
    this.imagesForDrawing.push(drop);
  }
};

Rain.prototype._resizeWindow = function() {
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
};

Rain.prototype._scaleCanvas = function() {
  // Finally query the various pixel ratios.
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
                          this.context.mozBackingStorePixelRatio ||
                          this.context.msBackingStorePixelRatio ||
                          this.context.oBackingStorePixelRatio ||
                          this.context.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;

  // Upscale the canvas if the two ratios don't match.
  if (devicePixelRatio !== backingStoreRatio) {
    var oldWidth = this.canvas.width;
    var oldHeight = this.canvas.height;
    this.canvas.width = oldWidth * ratio;
    this.canvas.height = oldHeight * ratio;
    this.canvas.style.width = oldWidth + 'px';
    this.canvas.style.height = oldHeight + 'px';

    // Now scale the context to counter the fact that we've manually scaled
    // our canvas element.
    this.context.scale(ratio, ratio);
  }
};

module.exports = Rain;
