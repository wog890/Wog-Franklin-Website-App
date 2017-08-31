/***********************************************************************************************************************
wogBackend.js
An NPM module which provides high level access to backend methods.

CLASSES:

PROPERTY METHODS:

METHODS:

HISTORY:
  11-08-2016: Initial version.

***********************************************************************************************************************/

var Backendless = require ('backendless');

Backendless.enablePromises();

// PRIVATE -------------------------------------------------------------------------------------------------------------

var _public = {};
var _user;


// PUBLIC --------------------------------------------------------------------------------------------------------------

/*_public.getUser = function(sToken) {
  return new Promise(function(fResolve, fReject) {
    if (_user) {
      fResolve(_user);
    }
    else {
      Backendless.UserService.isValidLogin().then(function(fValid) {
        if (fValid) {
          console.log(Backendless.UserService.getCurrentUser());
        }
      });
    }
  });


  return new Promise(function(fResolve, fReject) {
    Backendless.UserService.isValidLogin().then(function(fSuccess) {
      console.log('Valid: ' + fSuccess);
    }).catch(function(oError) {
      console.error(oError);
      fReject(oError);
    })
  });
};*/

// init()
// ...
_public.init = function() {
  Backendless.initApp('C1E0E377-5572-A865-FFC2-A65F0BCFF700', 'C31112BB-6517-0FBB-FF03-EA7EE5486C00', 'v1');
};

_public.login = function(sId, sPass, fPersist) {
  return new Promise(function (fResolve, fReject) {
    Backendless.UserService.login(sId, sPass, fPersist).then(function(oUser) {
      window.plugins.toast.showLongBottom('Login Successful');
      fResolve(oUser);
    }).catch(function(oError) {
      window.plugins.toast.showShortBottom(oError.message);
      fReject(oError);
    });
  });
};

_public.registerUser = function(sEmail, sPassword, oAddP) {
  var mUser;
  return new Promise(function(fResolve, fReject) {
    mUser = new Backendless.User();
    mUser.email = sEmail;
    mUser.password = sPassword;
    if (oAddP) {
      for (var s in oAddP) {
        if (oAddP.hasOwnProperty(s)) {
          mUser[s] = oAddP[s];
        }
      }
    }
    Backendless.UserService.register(mUser).then(function(oUser) {
      window.plugins.toast.showShortBottom('Registration Successful');
      fResolve(oUser);
    }).catch(function(oError) {
      window.plugins.toast.showShortBottom(oError.message);
      fReject(oError);
    });
  });
};

module.exports = _public;