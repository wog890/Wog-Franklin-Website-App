// Private ------------------------------------------------------------------------------------

var _isOpen = false;
var _public = {};
var _webSocket;

function _checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState === Connection.UNKNOWN || networkState === Connection.NONE) {
		return false;
	}
	return true;
}

function _connectionMessage(event) {

}

// Public -------------------------------------------------------------------------------------

_public.checkConnection = _checkConnection;

_public.init = function() {
	return new Promise(function(resolve, reject) {
		if (_checkConnection()) {
			_webSocket = new WebSocket('ws://limitless-caverns-76781.herokuapp.com/', 'echo-protocol');
			_webSocket.onclose = function(event) {
				_isOpen = false;
				console.log(event);
				console.log((new Date()) + ' Client disconnected from server');
				reject(Error('WebSocket Error'));
			}
			_webSocket.onmessage = _connectionMessage;
			_webSocket.onopen = function(event) {
				_isOpen = true;
				console.log((new Date()) + ' Client connected to server');
				resolve();
			}
		}
		else {
			reject(Error('Network Error'));
		}
	});
};

_public.send = function(message) {
	_webSocket.send(message);
};

_public.sendJSON = function(message) {
	_webSocket.send(JSON.stringify(message));
};

module.exports = _public;