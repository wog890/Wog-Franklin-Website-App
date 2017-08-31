// Private ------------------------------------------------------------------------------------

var _ = require('./underscore');
var _history = [];
var _pages;
var _public = {};

// Public -------------------------------------------------------------------------------------

_public.back = function() {
	var pageId = _.last(_history);
	_history.slice(-1, 1);
	_pages[pageId].open();
}

_public.close = function(pageId) {
	_pages[pageId].close();
};

_public.init = function(pages) {
	_pages = pages;
};

_public.open = function(pageId, canNavigateBack, oProps) {
	if (!canNavigateBack) {
		_history = [];
	}
	_history.push(pageId);
	_pages[pageId].open(oProps);
};

module.exports = _public;