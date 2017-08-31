// Private ------------------------------------------------------------------------------------

var _ = require('../../libs/underscore');
var fieldData = require('../fieldData.js');
var spellCasting = require('../spellCasting.js');
var spellField = require('../spellField.js');

var page = new tabris.Page({
  background: '#AAAAAA',
  title: 'Dueling',
  topLevel: true
});

fieldData.formatCombatScreen(tabris.device.get('screenHeight'), tabris.device.get('screenWidth'), 5, 3);
spellField.drawFieldArea(fieldData.getFieldArea(), page);
spellCasting.drawCastingArea(fieldData.getCastingArea(), page, '#1B5E20', '#404240', '#1B5E20', '#8D918D', 14);

// Public -------------------------------------------------------------------------------------

var _public = {};

_public.addInformation = function(info, clrText) {
  spellField.addInformation(info, clrText);
};

_public.sendMessage = function(msg) {
  websocket.sendMessage(msg);
};

_public.open = function() {
  page.open();
};

module.exports = _public;