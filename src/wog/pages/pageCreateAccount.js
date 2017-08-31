// PRIVATE ------------------------------------------------------------------------------------

var _margin = tabris.device.get('screenWidth')/6;
var _padding = 16;
var _page;
var _public = {};
var pagesAPI = require('../../libs/pagesAPI');

function _createAccount() {
	var email = _page.find('#inpEmail').get('text');
	var password = _page.find('#inpPassword').get('text');
	var passwordConfirm = _page.find('#inpPasswordConfirm').get('text');

	if (_validatePage(email, password, passwordConfirm)) {
		/*wogBackendless.registerUser(email, password, {username: username}).then(
			function(oUser) {
				pagesAPI.open('pageLogin', true, {
					password: _page.find('#inpPassword').get('text'),
					username: _page.find('#inpUsername').get('text')
				});
			}
		);*/
	}
}

function _createPage() {
	_page = new tabris.Page({
		background: '#FFFFFF',
		id: 'pgCreateAccount',
		title: 'Create Account',
		topLevel: false
	});
	var comCreate = new tabris.Composite({
		background: '#819196',
		cornerRadius: 14,
		id: 'comCreate',
		layoutData: {left: _margin, top: 140, right: _margin}
	}).appendTo(_page);
	var comCreateHeader = new tabris.Composite({
		background: '#555E61',
		cornerRadius: 14,
		id: 'comCreateHeader',
		layoutData: {left: 0, top: 0, right: 0}
	}).appendTo(comCreate);
	new tabris.TextView({
		alignment: 'center',
		font: 'bold 24px',
		layoutData: {left: 0, top: 8, right: 0, bottom: 8},
		text: 'Create Account'
	}).appendTo(comCreateHeader);
	var comCreateBody = new tabris.Composite({
		layoutData: {left: 0, top: ['#comCreateHeader', 8], right: 0}
	}).appendTo(comCreate);
	var inpEmail = new tabris.TextInput({
		id: 'inpEmail',
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding},
		message: 'Email'
	}).appendTo(comCreateBody);
	var inpPassword = new tabris.TextInput({
		id: 'inpPassword',
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding},
		message: 'Password',
		type: 'password'
	}).appendTo(comCreateBody);
	var inpPasswordConfirm = new tabris.TextInput({
		id: 'inpPasswordConfirm',
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding},
		message: 'Confirm Password',
		type: 'password'
	}).appendTo(comCreateBody);
	var btnCreate = new tabris.Button({
		background: '#60B342',
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding},
		text: 'Create an Account'
	}).appendTo(comCreateBody).on('tap', _createAccount);
	new tabris.Composite({
		layoutData: {left: _padding, top: ['prev()', 8], right: _padding}
	}).appendTo(comCreateBody);
}

function _validatePage(email, password, passwordConfirm) {
	var fErr = false;
	var sErr;
	if (password !== passwordConfirm) {
		fErr = true;
		sErr = 'Passwords do not match';
	}
	if (password === '') {
		fErr = true;
		sErr = 'Please create a password';
	}
	if (email === '') {
		fErr = true;
		sErr = 'Please provide an email';
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
				case 'email': _page.find('#inpEmail').set('text', oProps[s]); break;
				case 'password':
					_page.find('#inpPassword').set('text', oProps[s]);
					_page.find('#inpPasswordConfirm').set('text', oProps[s]);
				break;
			}
		}
	}
	_page.open();
};

module.exports = _public;