// Private ------------------------------------------------------------------------------------

var _ = require('../libs/underscore');
var Point = require('./Point.js');
var spells = require('../libs/spellAPI.js');

var scrollView;

// Public -------------------------------------------------------------------------------------

var _public = {};

_public.addInformation = function(info, clrText) {
  new tabris.TextView({
    layoutData: {left: 10, top: ['prev()', 5]},
    text: info,
    textColor: clrText
  }).appendTo(scrollView);
  window.setTimeout(
    function() {
      scrollView.set('scrollY', scrollView.get('scrollY') + 24);
    }, 100
  );
};

_public.drawFieldArea = function(fieldArea, page) {
  scrollView = new tabris.ScrollView({
    left: 0, right: 0, top: 0, bottom: fieldArea.deviceHeight - fieldArea.boundingHeight + 14,
    direction: 'vertical',
    background: '#234'
  }).appendTo(page);
};

module.exports = _public;