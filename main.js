var _pagesAPI = require('./src/libs/pagesAPI');
var _pageCreateAccount = require('./src/wog/pages/pageCreateAccount');
var _pageLogin = require('./src/wog/pages/pageLogin');
var _pageLogo = require('./src/wog/pages/pageLogo');
var _pageMenu = require('./src/wog/pages/pageMenu');
var _websocket = require('./src/libs/websocket');

function init() {
	tabris.ui.set('displayMode', 'fullscreen');
	tabris.ui.set('toolbarVisible', false);
	_pagesAPI.init({
		pageCreateAccount: _pageCreateAccount,
		pageLogin: _pageLogin,
		pageLogo: _pageLogo
	});
	_pagesAPI.open('pageLogo', false);
	_websocket.init().then(
		function() {
			var firebaseThings = window.FirebaseDatabasePlugin.ref('things')
			navigator.notification.alert(firebaseThings, function(){}, error);
			_pagesAPI.open('pageLogin', true, {username: 'wog890', password: 'mbwc16295'});
		},
		function(err) {
			switch(err) {
				case 'WebSocket Error': navigator.notification.alert('Error connection to server', function(){}, 'Error'); break;
				case 'Network Error': navigator.notification.alert('No internet connection', function(){}, 'Error'); break;
			}
		}
	);
}

init();