// PRIVATE ------------------------------------------------------------------------------------

var _page;
var _public = {};
var pagesAPI = require('../../libs/pagesAPI');

function _createPage() {
	_page = new tabris.Page({
		background: '#FFFFFF',
		id: 'pgLogo',
		title: 'Logo',
		topLevel: true
	});
	new tabris.ImageView({
		image: {src: './src/imgs/franklin-logo.png'},
		layoutData: {top: tabris.device.get('screenHeight')/4, centerX: 0},
		scaleMode: 'auto'
	}).appendTo(_page);
}

// PUBLIC -------------------------------------------------------------------------------------

_public.open = function() {
	if (!_page) {
		_createPage();
	}
	_page.open();
};

module.exports = _public;