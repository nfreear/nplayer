/*
  PlayerError | Nick Freear, 04-July-2018.
*/

// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
// https://javascript.info/custom-errors

module.exports = PlayerError;

function PlayerError (message, code, etc) {
  this.name = 'PlayerError';
  this.message = message;
  this.code = code || 500.1;
  this.etc = etc || null;
  this.stack = (new Error()).stack;
}

PlayerError.prototype = new Error(); // <- remove this if you do not
//                                         want MyError to be instanceof Error
