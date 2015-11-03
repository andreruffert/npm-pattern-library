var Rain = require('./lib/npm-rain');
var rain;

document.querySelector('[data-js="♥"]').addEventListener('mouseover', function(e) {
  if (!rain) {
    rain = new Rain({ baseurl: npm.page.baseurl }).init();
    rain.canvas.addEventListener('click', function(e) {
      rain.stop();
    });
  }
  rain.start();
});
