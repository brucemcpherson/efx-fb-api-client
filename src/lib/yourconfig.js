'use strict';

/**
 * parameters to identify api defaults
 */

module.exports = {

  prod: {
    base: 'https://ephex-auth.appspot.com',
    basePort: ''
  },
  dev: {
    base: 'https://s-dev-dot-ephex-auth.appspot.com',
    basePort: ''
  },
  debug: {
    base: 'https://nodestuff-xlibersion.c9users.io',
    basePort: '8080'
  },
  fb: {
    base: 'https://efxapi.com/v2',              //'https://us-central1-effex-fb.cloudfunctions.net/efxfb',
    basePort: ''
  },
  
  clientInfo: {
    version:"2.1.2",
    pushSupport:"firebase"
  },
  
  "firebase-config": {
    apiKey: "AIzaSyxxxxxb1Ag",
    authDomain: "xx.firebaseapp.com",
    databaseURL: "xx",
    projectId: "xx",
    storageBucket: "xx",
    messagingSenderId: "xx"
  }
  
};