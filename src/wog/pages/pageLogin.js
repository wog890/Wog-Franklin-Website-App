// PRIVATE ------------------------------------------------------------------------------------

var _margin = tabris.device.get('screenWidth')/6;
var _padding = 16;
var _page;
var _public = {};
var pagesAPI = require('../../libs/pagesAPI');

function _createPage() {
	_page = new tabris.Page({
		background: '#FFFFFF',
		title: 'Login',
		topLevel: false
	});
	var comLogin = new tabris.Composite({
		background: '#819196',
		cornerRadius: 14,
		id: 'comLogin',
		layoutData: {left: _margin, top: 140, right: _margin}
	}).appendTo(_page);
	var comLoginHeader = new tabris.Composite({
		background: '#555E61',
		cornerRadius: 14,
		id: 'comLoginHeader',
		layoutData: {left: 0, top: 0, right: 0}
	}).appendTo(comLogin);
	new tabris.TextView({
		alignment: 'center',
		font: 'bold 24px',
		layoutData: {left: 0, top: 8, right: 0, bottom: 8},
		text: 'Sign In'
	}).appendTo(comLoginHeader);
	var comLoginBody = new tabris.Composite({
		layoutData: {left: 0, top: ['#comLoginHeader', 8], right: 0}
	}).appendTo(comLogin);
	var inpUsername = new tabris.TextInput({
		id: 'inpUsername',
		layoutData: {left: _padding, top: 0, right: _padding},
		message: 'Username'
	}).appendTo(comLoginBody);
	var inpPassword = new tabris.TextInput({
		id: 'inpPassword',
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding},
		message: 'Password',
		type: 'password'
	}).appendTo(comLoginBody);
	var chxRemember = new tabris.CheckBox({
		id: 'chxRemember',
		layoutData: {left: _padding, top: 'prev()', right: _padding},
		text: 'Remember password?'
	}).appendTo(comLoginBody);
	var btnLogin = new tabris.Button({
		background: '#60B342',
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding},
		text: 'Log In'
	}).appendTo(comLoginBody).on('tap', _login);
	new tabris.Composite({
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding}
	}).appendTo(comLoginBody);
	var btnCreateAccount = new tabris.TextView({
		alignment: 'right',
		font: '16px',
		highlightOnTouch: true,
		layoutData: {top: ['#comLogin', 8], right: _margin + _padding},
		text: 'Create an account',
		textColor: '#3366BB'
	}).appendTo(_page).on('tap', _openPageCreateAccount);
}

function _login() {
	var sPass = _page.find('#inpPassword').get('text');
	var sUser = _page.find('#inpUsername').get('text');

	if (_validatePage(sUser, sPass)) {
		/*wogBackendless.login(sUser, sPass, true).then(
			function(oUser) {
				
			}
		);*/
	}
}

function _openPageCreateAccount(widget, gesture) {
	pagesAPI.open('pageCreateAccount', true, {
		password: _page.find('#inpPassword').get('text'),
		username: _page.find('#inpUsername').get('text')
	});
}

function _validatePage(sUser, sPass) {
	var fErr = false;
	var sErr;
	if (sPass === '') {
		fErr = true;
		sErr = 'Please enter a password';
	}
	if (sUser === '') {
		fErr = true;
		sErr = 'Please enter a username';
	}
	if (fErr) {
		window.plugins.toast.showShortBottom(sErr);
	}
	return !fErr;
}

// PUBLIC -------------------------------------------------------------------------------------

_public.open = function(oProps) {
	if (!_page) {
		_createPage();
	}
	if (oProps) {
		for (var s in oProps) {
			switch(s) {
				case 'password': _page.find('#inpPassword').set('text', oProps[s]); break;
				case 'username': _page.find('#inpUsername').set('text', oProps[s]); break;
			}
		}
	}
	_page.open();
};

module.exports = _public;