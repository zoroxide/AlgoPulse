"use strict";

var sha256 = require('js-sha256');
function getGravatarURL(email) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  var defaultImage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'identicon';
  var rating = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'g';
  // Normalize the email (trim, lowercase)
  var address = String(email).trim().toLowerCase();

  // Create the SHA256 hash of the email address
  var hash = sha256(address);

  // Construct the Gravatar URL with query parameters
  return "https://www.gravatar.com/avatar/".concat(hash, "?s=").concat(size, "&d=").concat(defaultImage, "&r=").concat(rating);
}
module.exports = {
  getGravatarURL: getGravatarURL
};