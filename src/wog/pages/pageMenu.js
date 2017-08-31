// PRIVATE ------------------------------------------------------------------------------------

var _page;
var _public = {};
var pagesAPI = require('../../libs/pagesAPI');

function _createPage() {
	_page = new tabris.Page({
		background: '#73068F',
		id: 'pgMenu',
		title: 'Menu',
		topLevel: true
	});
}

// PUBLIC -------------------------------------------------------------------------------------

_public.open = function() {
	if (!_page) {
		_createPage();
	}
	_page.open();
};

module.exports = _public;