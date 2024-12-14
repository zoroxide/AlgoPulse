const sha256 = require('js-sha256');

function getGravatarURL(email, size = 100, defaultImage = 'identicon', rating = 'g') {
  // Normalize the email (trim, lowercase)
  const address = String(email).trim().toLowerCase();

  // Create the SHA256 hash of the email address
  const hash = sha256(address);

  // Construct the Gravatar URL with query parameters
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=${rating}`;
}

module.exports = { getGravatarURL };
