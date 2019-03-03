const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
module.exports = withImages()

// default DEV settings
var BASE_URL = '/base';
var API_URL = 'https://localhost:1350';

process.argv.forEach( function(element, index) {
  if(element.indexOf('--api=')>=0)
  {
    API_URL = element.replace(/--api=(.*)/,'$1');
  }
  else if(element.indexOf('--path=')>=0)
  {
    BASE_URL = element.replace(/--path=(.*)/,'$1');
  }
});
console.log(`API_URL = ${API_URL}`);
console.log(`BASE_URL = ${BASE_URL}`);

module.exports = withImages(withSass({
	assetPrefix: BASE_URL,
	publicRuntimeConfig: { // Will be available on both server and client
		BASE_URL: BASE_URL,
		API_URL: API_URL,
	},
}))