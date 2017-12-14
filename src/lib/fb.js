const firebase = require("firebase");

module.exports = (ns => {

  ns.uid = ""; // /push is public - no sign in required - TODO>>

  // this is using firebase instead of firestore as
  // there's a problem developing in node with protobuf
  // the rest of the data is in firestore
  // just the push notification is still in fb
  // 

  ns.init = function() {
    const config = require('./config')["firebase-config"];
    firebase.initializeApp(config);
    ns.db = firebase.database();
  };

  // no need to sign in
  ns.in = function() {
    return ns.db ?
      Promise.resolve(ns.uid) :
      Promise.reject("first initialize firebase");
  };

  // check that ping is available
  ns.pingPush = () => ns.fetch("services", "ping/response");

  // check we're signed in and initialized
  ns.checkIn = () => {
    if (!ns.db) {
      ns.init();
    }
    return ns.in();
  };

  // get a doc and the data out of it
  ns.fetch = (collection, doc) => ns.get(collection, doc)
    .then(doc => {
      const exists = doc.val() ? true : false;
      const data = exists ? doc.val() : null;
      return data;
    });

  // get a doc
  ns.get = (collection, doc) => ns.ref(collection, doc)
    .then(ref => ref.once('value'));

  // set a doc
  ns.set = (collection, doc, ob) =>
    ns.ref(collection, doc)
    .then(ref => ref.set(ob))
    .then(r => ns.ref(collection, doc));

  ns.ref = (collection, doc) =>
    ns.checkIn()
    .then(uid => ns.db.ref(collection + "/" + doc));

  // check that onsnapshot is working
  ns.pingPushOn = (func, message) => {
    const now = new Date().getTime();
    const doc = "pingPushOn";
    const ob = {
      message: message || "pingPushOn test",
      expires: now + 30000,
      created: new Date(now).toString(),
      docId: doc
    };

    // set a watch
    // !!TODO - this is causing me to have WRITE access open
    // change this to provoke a write to the given reference
    // 
    return ns.setOn("uqs", doc, func)
      .then(ref => ref.set(ob))
      .then(ref => ob);
  };

  // set listener for a specific key
  ns.setOn = (collection, docr, func) => {
    
    return ns.ref(collection, docr).then(ref => {
      
      ref.on('value', doc => {
       
        const exists = doc.val() ? true : false;
        const data = exists ? doc.val() : null;
        return func({
          ok: exists ? true : false,
          value: data,
        });
      });
      return ref;
    });
  };

  return ns;
})({});
