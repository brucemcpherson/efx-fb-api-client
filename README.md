# effex-api-client
Node/JavaScript api client for Ephemeral exchange

A cross platform cache, with a simple HTTP REST API that supports CORS and various platform libraries.

## Getting started

This documentation  is primarily for the JavaScript and Node clients, but will serve as the master for all platform SDKS. 

### NPM

For Node, or if you are developing using a package manager, install the client
```
npm install effex-api-client --save
```
Then in your code
```
var efx = require ('effex-api-client');
```

### SCRIPT tag

If you are including the library with a script tag

```
<script src="https://efxapi.com/scripts/effex-api-client-v2.2.min.js"></script>
```
Then in your code
```
var efx = EffexApiClient;
```

## To check you have connectivity

```
efx.ping().then(function(result)  {
  console.log( result.data );
});
```

## The console and dashboard
To create reader and writer keys you'll need an an account (free). See the console to register and to take the API tutorial.
https://efxapi.com/

## Access keys
Before you can write to the store, you need a writer key. You need to generate writer keys using the API. 
Here are the different kinds of access keys and how to get them. To start with you only need a boss key (created in the console),
which you can use to create a writer key.

| Access key type | what are they for | how to get one |
| ------------- |---------------| ---------------| 
| boss     | generating other access keys | from the console app | 
| writer      | reading, updating, writing or removing data from the store | with the API and a boss key |  
| updater | reading and updating data from the store      | with the API and a boss key |
| reader | reading | data from the store      | with the API and a boss key |
| item | needed to access a data item | by writing an item to the store with the API |
| alias | can be used to assign a constant name to a data item | by assigning an alias to to a particular key/item combination using a writer key |
| intent | authorization for a follow on action | by issuing a read with an intention parameter |
| watch | a tracking key for push notification, used internally | by issuing a .on API subscription request |

Typically the account owner would keep the boss keys and writer keys private, and share item ,updater or reader keys with collaborators or collaborating applications. Intent keys are an advanced topic, dealt with later in this documentation.

To be able to access an item, these things need to happen
1. A writer key is needed to write data to the store. An item key is generated. The same writer key can be used to write many items. 
2. An item can be read back, updated or removed using the writer key plus the item key.
3. To assign read access to an item, you can specify a comma separated list of readers as a parameter when creating the item. Any reader keys mentioned in that list can read the item using the reader key plus the item key.
4. To assign update access to an item, you can specify a comma separated list of updaters as a parameter when creating the item. Any updater keys mentioned in that list can read or update the item using the updater key plus the item key.
5. To register an alias, you need a writer key and a data item id. You can then register an alias to a key/item combination and that key can use the alias to access the item to which it has been assigned.

## Expiration and disabling
Because this is a store for ephemeral data,
everthing expires - accounts, data items, access keys and aliases - and their lifetime can each be individually set. Keys can last for months, but in the free version, data items expire after a maximum of 12 hours although this may be revised as the service comes out of beta.

Lifetimes are set by explicit parameters, or inherited from the key used to create them.

All access keys and items are associated with a specific account and will be immediately stop working if you disable or remove an account. You can create multiple accounts and manage them in the API console. You can stop a boss key being able to generate new keys by deleting it from the API console.

## Security
This is a public store, and there is no authentication required. However, keys are required for all data accesses, and both the data and its keys are encrypted in the store. You may also choose to further encrypt it before sending it to the store too. In any case, to ensure you comply with your country's privacy laws on the storage of personally identifiable data, don't do it. 

# Client API SDK for Node and JavaScript
The API has a simple HTTP REST API - take the tutorial to see the structure of each call if you want to write your own client.  The tutoral is part of the API console, which you can find at https://efxapi.com.  The console also has a JSON editor and viewer to allow you to directly access data in the store. You can even use a browser to access the store if you want - handy for debugging.

For convenience this node/JavaScript client is available, and of course you can use it in a web app too. There are other platform clients available too. 

## Initialization 

Include either with a package manager or a script tag: 


## Responses
Unless its a transport error, http responses will always be 200. If there is a structural error in your call, or for example, data is missing - this will be reported in the response. 

A typical response would consist of various properties describing the api access. In normal circumstances, the only one of interest is *response.data*, where a successful request would return something as shown below. The rest of the response can be used to find out more detail about the request and for troubleshooting any transport failures.

Note that additional useful properties may be added to the response in later versions.

```
{ writer:"wxk-eb1-o1cbq17qfbre"
  ok:true
  id:"dx1f7-g1x-127ib7e77bfn"
  plan:"x"
  accountId:"1f7"
  lifetime:3600
  size:175
  code:201
}
```
And a fail would be

``` 
{ reader:"wxk-eb1-o1cbq17qfbre"
  ok:false
  id:"dx1f7-51b-1t7ibudfmbfr"
  accountId:"1f7"
  plan:"x"
  value:null
  code:404
  error:"item is missing"
}
```
The property "ok" is present on all responses and is a simple way to test for success. The code property matches a typical http code (https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for the type of operation being performed, and will be a value from this list - So although an http error is not actually provoked, the code for an error of that type will be given in the response along with a description in the error property.
```
    "errors": {
      "NOT_FOUND": 404,
      "BAD_REQUEST": 400,
      "UNAUTHORIZED": 401,
      "FORBIDDEN": 403,
      "LOCKED": 423,
      "INTERNAL": 500,
      "OK": 200,
      "CREATED": 201,
      "ACCEPTED": 202,
      "NO_CONTENT": 204,
      "CONFLICT": 409,
      "GONE": 410
    }
```

## Promises
All responses from api requests are returned as promises.

## Methods
There's an example of a request and response for each of the methods that access the API. This is not an exhaustive list, as it does not cover the administrative account management functions which are not currently available in the free tier.

### Parameters
Many api calls take parameters. They all follow the same format. The data payload can be text or an object, and is specified as a argument to methods that can write or update data.

Here is a list of the parameters that the API understands and where they can be used with this client. Params are always passed as a key/value pair object.


| Parameter | what it is for | when used in client |
| ------------- | ---------------| ---------------|
| data |	If GET is used (rather than POST), this parameter can be used to specify the data to be written | Not needed. It is generated automatically when required |
| readers |	A comma separated list of reader keys that can read this item. | when creating an item | 
| updaters	|A comma separated list of updater keys that can read or update this item. | when creating an item |
| lifetime |	Lifetime in seconds of the data item, after which it will expire | when creating an item or alias |
| callback |	Provide a callback function name to request a JSONP response | all |
| days | How many days an access key should live for | generating access keys |
| seconds | As an alternative to days, how many seconds an access key should live for | generating access keys |
| intention | To signal an intention for further operations, such as an update following a read | to lock updating for a time |
| intent | An authorization key to proceed with a follow on operation | to fulfill a previous signalled intention |
| backoff | Whether to use exponential backoff automatically | when issuing a read with an intent in case another also is doing it at the same time |
| watchable | a watchable key | to filter an event log query by a specific watchable id |



### setBase (url)

Sets the API base url. Note that this is likely to change or be removed as the service moves from beta. It's unlikely you would need to use this anyway, as it already defaults to the production API. 

```
efx.setBase("https://efxapi.com/v2");
```
### ping ()

Checks the service is up

example
```
efx.ping ()
.then (function (response) {
  // do something with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/ping
```
example response
```
ok:true
value:"PONG"
code:200
```
### info ()

Gets version info for service

example
```
efx.info ()
.then (function (response) {
  // do something with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/info
```
example response
```
ok:true
code:200
▶info:{} 2 keys
api:"effex-api"
version:"1.01"
```

### generateKey (bosskey , type [,params])

Generates 1 or more keys of the given type ('writer', 'updater', 'reader')

example
```
efx.generateKey ("bx1f7-e11-b731jbd5p1fo" , "writer", {count:1} )
.then (function (response) {
  // do something with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/generate/bx1f7-e11-b731jbd5p1fo/writer?count=1
```
example response
```
type:"writer"
plan:"x"
lockValue:""
ok:true
validtill:"2017-03-17T13:01:54.593Z"
▶keys:[] 1 item
0:"wxk-eb1-v5oc917zfbfz"
accountId:"1f7"
```

### validateKey (key)

Validate any kind of key and get its expiration date

example
```
efx.validateKey ("bx1f7-e11-b731jbd5p1fo")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/validate/uxk-f1z-b17ce5kcvoeb
```

example response
```
ok:true
key:"uxk-f1z-b17ce5kcvoeb"
validtill:"2017-03-17T13:01:53.996Z"
type:"updater"
plan:"x"
accountId:"1f7"
code:200
```
### write (data , writer , method, params)

Write data to the store and get an id back. The method can be post (preferred) or get (for small amounts of data where post is not possible - eg from browser). The params can be used to define which keys can read this item and its lifetime.

example
```
efx.write (data , "wxk-eb1-i5ocq17bfbga")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/writer/wxk-eb1-i5ocq17bfbga
```

example response
```
writer:"wxk-eb1-i5ocq17bfbga"
ok:true
id:"dx1f7-k19-127mbaeiobft"
plan:"x"
accountId:"1f7"
lifetime:3600
size:175
code:201
```

Here's an example with some reader and updater keys authorized. Note that the keys must be valid unexpired keys for the request to succeed.

```
efx.write (data , "wxk-eb1-v5oc917zfbfz" , "POST" , {
  updaters:"uxk-f1z-b17ce5kcvoeb",
  readers:"rxk-ec5-fc571rowbbf1"
}).then (function (response) {
  // do something
});
```
translates to native api url

```
https://efxapi.com/v2/writer/wxk-eb1-v5oc917zfbfz?readers=rxk-ec5-fc571rowbbf1&updaters=uxk-f1z-b17ce5kcvoeb
```
example response

```
writer:"wxk-eb1-v5oc917zfbfz"
ok:true
id:"dx1f7-811-1576boei2bft"
plan:"x"
accountId:"1f7"
▶readers:[] 1 item
0:"rxk-ec5-fc571rowbbf1"
▶updaters:[] 1 item
0:"uxk-f1z-b17ce5kcvoeb"
lifetime:3600
size:211
code:201
```
### read (id,  key , params)

Read a data item from the store, where id is the id returned by a write operation (or an alias - see later), and key is any kind of key that has been authorized to read this item. Note that a writer key can always read, update or remove an item it has created.

example
```
efx.read ("dx1f7-s18-167ibfeb9bfm", "rxk-ebb-fe971gtqbbt1")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/reader/rxk-ebb-fe971gtqbbt1/dx1f7-s18-167ibfeb9bfm
```

example response. The data payload will be in the value property.
```
reader:"rxk-ebb-fe971gtqbbt1"
ok:true
id:"dx1f7-s18-167ibfeb9bfm"
accountId:"1f7"
plan:"x"
value:"a data item that can be read by another"
code:200
modified:1489752873661
```

### update (data, id, updater, method  , params)

Update a data item in the store, where id is the id returned by a write operation (or an alias - see later), and key is any kind of key that has been authorized to update this item. Note that a writer key can always update an item it has created, and data is the new value to set for the given item id. As with write, it is possible (but not preferred), to use a GET method instead of the default POST.

example
```
efx.update (data , "dx1f7-m12-167ibfev9bfh", "uxk-f1m-b17ce9uo_t9b")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/updater/uxk-f1m-b17ce9uo_t9b/dx1f7-m12-167ibfev9bfh
```

example response. 
```
updater:"uxk-f1m-b17ce9uo_t9b"
ok:true
id:"dx1f7-m12-167ibfev9bfh"
plan:"x"
accountId:"1f7"
lifetime:3600
modified:1489752873655
size:196
code:201
```
### remove (id, writer , params)

It's not normally necessary to remove items, as they will expire anyway. Only the writer key that created an item can remove it.

example

```
efx.remove ("dx1f7-s18-167ibfeb9bfm", "wxk-eb1-e9tbh177fbm9")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url

```
https://efxapi.com/v2/writer/wxk-eb1-e9tbh177fbm9/dx1f7-s18-167ibfeb9bfm
```

example response. 

```
writer:"wxk-eb1-e9tbh177fbm9"
ok:true
id:"dx1f7-s18-167ibfeb9bfm"
accountId:"1f7"
plan:"x"
code:204
```

### registerAlias (writer, key, id, alias, params)

It's possible to use an alias for a data item. This allows you to use a consistent reference to the same data abstaction even though the specific item it refers to changes. Like this, a collaborating app only needs a key that can reference that item along with the alias. 

An alias doesn't apply to a data item - it refers to an access key/data item combination. Assigning the alias to this combination is done with register alias. Only the data item writer key can assign an alias.

example

```
efx.registerAlias ("wxk-eb1-e9tbh177fbm9", "uxk-f1m-b17ce9uo_t9b","dx1f7-m12-167ibfev9bfh","some-awesome-data")
.then (function (response) {
  // do something  with response.data
});
```
translates to native api url

```
https://efxapi.com/v2/wxk-eb1-e9tbh177fbm9/uxk-f1m-b17ce9uo_t9b/alias/some-awesome-data/dx1f7-m12-167ibfev9bfh
```

example response. 

```
type:"alias"
plan:"x"
lockValue:""
ok:true
validtill:"2017-03-17T14:14:31.992Z"
key:"uxk-f1m-b17ce9uo_t9b"
alias:"some-awesome-data"
id:"dx1f7-m12-167ibfev9bfh"
accountId:"1f7"
writer:"wxk-eb1-e9tbh177fbm9"
code:201
```

Once an alias has been established, it can be used anywhere a data id can be used. 

example
```
efx.read ("some-awesome-data", "uxk-f1m-b17ce9uo_t9b")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url

```
https://efxapi.com/v2/reader/uxk-f1m-b17ce9uo_t9b/some-awesome-data
```

example response. 

```
reader:"uxk-f1m-b17ce9uo_t9b"
ok:true
id:"dx1f7-m12-167ibfev9bfh"
accountId:"1f7"
plan:"x"
alias:"some-awesome-data"
value:"a data item that can be updated by another"
code:200
modified:1489753261680
```
### writeAlias (data , alias , writer , method, params)

This version of the write method allows you to create an alias at the same time as writing the item. The alias will be associated with the writer key. Any updaters or readers you specify in the params will also automatically have aliases for that item created for them at the same time.

example
```
efx.writeAlias (data , "myalias", "wxk-eb1-i5ocq17bfbga")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/writer/wxk-eb1-i5ocq17bfbga/alias/myalias
```

example response
```
writer:"wxk-eb1-i5ocq17bfbga"
ok:true
id:"dx1f7-k19-127mbaeiobft"
plan:"x"
accountId:"1f7"
lifetime:3600
size:175
code:201
alias:"myalias"
```
# Advanced topics

These are experimental, under development (and may not be yet visible in the prod version), and may only be available to plans other than the free one in the future.

## Intentions

It's quite difficult to preserve atomicity in a rest API since by definition it is stateless. This means that if you read an item, and then want to update it, it's possible that the item has been modified or removed by someone else in the meantime. Because of the typical usage of the store, this is probably not a likely event, but still needs to be catered for. This is how the store deals with preserving atomicity

### What are intentions

You can register the intention of doing further work on an item. For now the only intention supported is update. The existence of an intention is short, and will expire after a short period of time (to be determined). While an item has an intention taken out on it, it is still readable, but cannot be updated or deleted by anyone else.

### Identifying the intention

Using intentions can be tricky. Here a are a few important points.

#### Intention key

This key is created by the API, and returned when a read operation with an intention is requested. It must be returned to fulfill the intention. An intention key can be used only once.

#### Access key

An intention key is associated with a specific access key - the one that initiated the intention update request -, so you should use a writer or an updater key (that has been authorized to access the item) to read the item, and then follow it up with an update action using the same key. An intention request with a reader key will create an intention (to allow for future intention types), but will be assigned to the reader key. Therefore, the initial read request for an intention should always be made with the key that will eventually consume the intention request.

#### Alias

As usual, you can use an alias to read an item, and its underlying item id will be returned along with the data, and the generated intention key. Although you *can* follow up with an update request using the alias, you *should* instead use the returned native item id. This avoids the  situation where an alias has been reassigned to a different item in the meantime. This is an unlikely situation since an alias is associated with a specific access key, and there would need to be a registration of an alias with the same updater key and alias name in the time between your intention request and fullfillment - which is a stretch, but nevertheless possible.

#### Update attempts while intention is active

If an item has an active intention on it, and an attempt is made to update (or remove) it without specifiy matching intention or from another key, the request will be rejected. If you think this is likely to happen you should cater for it. A read response to an item that has an active intention on it, will include when the intention expires, so a good way to deal with it is to re-issue the request after that time.

### Intention parameter

An intention request is specified by a parameter in the read request.

### read (id,  key , {intention:"update"} )

Read a data item from the store, where id is the id returned by a write operation (or an alias), and key is any kind of key that has been authorized to read this item. Note that a writer key can always read, update or remove an item it has created, so in the case of an intention to update, the key should be an updater or writer.

example
```
efx.read ("dx1f7-s18-167ibfeb9bfm", "uxk-f1m-b17ce9uo_t9b", {intention:"update"})
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/reader/uxk-f1m-b17ce9uo_t9b/dx1f7-s18-167ibfeb9bfm?intention=update
```

example response. The data payload will be in the value property. The intentExpires property is how many seconds the intention will be in place for (from the time it was registered)
```
reader:"uxk-f1m-b17ce9uo_t9b"
ok:true
id:"dx1f7-s18-167ibfeb9bfm"
accountId:"1f7"
plan:"x"
value:"a data item that can be read by another"
code:200
modified:1489752873661
intent:"ix1f7-s23-fm123h9dhdo"
intentExpires:10
```

### update (data, id, updater, method  , params)

Update a data item in the store, where id is the id returned by a write operation (or an alias), and key is any kind of key that has been authorized to update this item. Note that a writer key can always update an item it has created, and data is the new value to set for the given item id. As with write, it is possible (but not preferred), to use a GET method instead of the default POST. The intent parameter should be the intention key returned by the initial read request.

example
```
efx.update (data , "dx1f7-m12-167ibfev9bfh", "uxk-f1m-b17ce9uo_t9b","post",{intent:"ix1f7-s23-fm123h9dhdo"})
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url
```
https://efxapi.com/v2/updater/uxk-f1m-b17ce9uo_t9b/dx1f7-m12-167ibfev9bfh?intent=ix1f7-s23-fm123h9dhdo
```

example response. 
```
updater:"uxk-f1m-b17ce9uo_t9b"
ok:true
id:"dx1f7-m12-167ibfev9bfh"
plan:"x"
accountId:"1f7"
lifetime:3600
modified:1489752873655
size:196
```
The response to an update attempt that is prevented from completing by an outstanding intention will contain a error message, and code of 423 along with an intentExpires value, which will indicate the number of seconds from when the request was made until the current lock expires.

### release (id , intent)

The intent parameter should be the intention key returned by the initial read request. The id should be the id or alias against which it was taken out. This delete request removes an intent. Updating with an intent does this anyway, and in any case the intent will expire after a while. However, if you take out an intent, and then decide not to follow up with an update, explicitly releasing the intent instead of allowing it to time out will allow others to get to the item more quickly

example
```
efx.release ("dx1f7-m12-167ibfev9bfh", "uxk-f1m-b17ce9uo_t9b", "ixk-ms9f6-yp5t1154c9fb")
.then (function (response) {
  // do something  with response.data
});

```
translates to native api url (DELETE)
```
https://efxapi.com/v2/release/dx1f7-m12-167ibfev9bfh/uxk-f1m-b17ce9uo_t9b/ixk-ms9f6-yp5t1154c9fb
```
example response. 
```
{ ok: true,
  key: 'ixk-ms9f6-yp5t1154c9fb',
  validtill: '2017-05-10T12:45:36.804Z',
  type: 'intent',
  plan: 'x',
  accountId: '1f9',
  code: 204 }
```

### exponentional backoff

The Node/JavaScript client has a general exponential backoff built in which is not specific to the Ephemeral Exchange API. In other words, you can use it with other APIS too. It can be used with Effex API automatically by setting the backoff parameter true, in order to avoid races between multiple clients making an intention read as in the example below.

```
efx.read ("dx1f7-s18-167ibfeb9bfm", "uxk-f1m-b17ce9uo_t9b", {intention:"update",backoff:true})
.then (function (response) {
  // do something  with response.data
});
```
In fact, this simply wraps your read request in this code, which uses the general exponential backoff function to detect a lock state (423), which indicates that there is already a lock in progress. It will try again until it succeeds or gives up. Note that the wait time is optimized by inspecting the API return that shows how long any current lock has got to live.
```
return ns.expBackoff(
      
      // read an item and decalre an intention to update
      () => read_(id, reader, params),
      
      // function for checking if we want to do a retry, because we got a lock 
      (lastResult) => params.backoff && lastResult.data.code === 423, {
      
        // we have a custom wait time to leverage info about lock lifetime
        setWaitTime: (waitTime, passes, result, proposed) => {
          return Math.min(proposed, ((result && result.data && result.data.intentExpires) || 0) * 1000);
        }
        
      });
      
```
#### expBackoff ( action, doRetry [, options])

This general purpose expBackoff function returns a Promise which is resolved when action is finally finished or rejected if it gives up by having tried too many times. Whether or not to retry is decided by a true or false return by the doRetry callback, and the behavior is controlled by the options which can be any of

| Property | what it is for | when used in client |
| ------------- | ---------------| ---------------|
| maxPasses |	Maximum times to try | default is 5 |
| waitTime |	The base for the caclulation of waiting time | default is 500ms | 
| passes	|how many times weve already tried | will probably always be 0 |
| setWaitTime |	a callback which can receive (waitTime , passes , result , proposed)| to change the waitTime for the next pass from the value in proposed |

Using the setWaitTime option can be used to alter the proposed waiting time as calculated by the backoff function, to some other values, perhaps based on the response received from the last call to 'action'. The arguments received by this callback are
- *waitTime* the base waitTime
- *passes* how many times tried so far
- *result* the last result received from the action function
- *proposed* how long expBackoff proposes to wait before trying the next pass
To change proposed to some different value, return any non-zero number of milliseconds

The doRetry callback receives these arguments
- *passes* how many times tried so far
- *result* the last result received from the action function
and should return true if the expBackoff should reattempt the action function

The action function can be a regular function or a Promise (or even an actual value instead of a function) - all are turned into Promises internally.

## Key management

The client provides a few utilities for managing keys. 

### setKeys (keys)

Setting the keys is a handy way of keeping reader, updater , writer keys somewhere for easy retrieval. You'd use it like this

```
efx.setKeys ({
  reader:'xxx',
  updater:'yyy',
  writer:'zzz'
});
```
Some of the methods can access this object for default keys when they are not supplied as an argument. 

### getKeys ()

Returns anything that's been stored with setKeys().

```
var keys = efx.getKeys (); 
```

Note that it doesn't care what you store in here so it can be useful to add other stuff and keys here too, for example

```
efx.setKeys( efx,getKeys()).myOtherApiKey = "uuuuuuu";
```

but see makeKeys ...

### makeKeys (bossKey[,params])

Quite often you'll want to make a whole set of keys. This is an aggregated function to create one of each type of key. Note this overwrites anything that has been written with setKeys()

```
efx.makeKeys( bossKey ).then (()=>console.log (efx.getKeys());
```
### getUriKeys ()

You don't have to call this explicitly as it happens by default, if it detects you are running in a browser. If any of these parameters are found in the URI
```
["updater", "reader", "item","boss","writer","alias","id"]
```
getKeys will use these are default values to start with.


## Watching

You can subscribe to watch an item to listen for changes. A subscription is made by a combination of access key and item id (since a key is needed to validate that you have access to an item). You can use any of reader, writer and updater keys to subscribe with, as long as they have read access to the target item. Note that watching is managed within the SDK. It is possible to create a watch with the REST API, and then query it periodically to see if there have been any events recorded, but for optimum usage it's best to use the SDK for your platform.

### Lifetime

A subscription can be set to have a lifetime after which it disappears. In any case it will disappear a period of time after the last time the item it was watching was last updated.

### Alias or id

You can watch either a specific item, or  an alias. Alias subscription will follow changes in the alias assignment to new items, whereas a specific item subscription will only last as long as the item lasts. An alias subscription will last for as long as an alias is assigned to some item and there is some activity on the item.
return efx.on("update", items[k].id, items[k].writer, callbacks[k], onOptions[k])

### Watch subscriptions

Subscribing to an event is with the .on method

### on (event , id,  key , callback [,options] [,params] )

Because not all platforms can support all forms of communication, there are multiple ways of getting messages when a watchable has something to report. Both push and pull notifications are supported. These are the types that can be specified in the type property of the options parameter.
- push uses socket.io to communicate with the push server api, and your callback is invoked whenever a tracked event happens. This is the most transparent form of watching and should be used where your platform supports it.
- pull schedules regular checks for updates with the server, and invokes your callback if an event is detected during a polling operation. The frequency property (number of seconds between checking) can be set in the options parameter. The client handles the scheduling of the polling.
- url invokes a url as a callback. You specify the url in the callback parameter, and the method to use (default is POST) can be specified in the method property of the options parameter. There is no local notification of events - they are sent to the url. This is also a push notification as messages are initiated by the push server, which will keep on doing that until you unwatch or the subscription expires
- manually. You can use the getEventLog method to return a list of event timestamps for a given  item and watchable at any time. 

Here's some examples of watch notification subscriptons. In this section I'm using es6 syntax for brevity.

push

```
efx.on ("update" ,
	"dx1f9-skvue9-jee1fb14fjlm", 
	"uxk-yrmf1l-b19fle0ipede" , 
 	(watchId, pack)=>console.log (pack.event + ' detected for ' + pack.id) , 
 	{type:"push"});
```

pull 

```
efx.on ("remove" ,
	"myalias", 
	"uxk-yrmf1l-b19fle0ipede" , 
 	(watchId, pack)=>console.log (pack.event + ' detected for ' + pack.id) , 
 	{type:"pull",frequency:10});
```

url. Note that I've used the message option to pass a key that the receiving url can use to read the item with.

```
efx.on ("expire" ,
	"anotheralias", 
	"uxk-yrmf1l-b19fle0ipede" , 
 	"https://mysite/mycallback", 
 	{type:"url", message:{updater:updaterKey}});
```

#### on options

Some options  passed to the on method are only applicable to certain types of subscription. Here's the full list


| Option property | what it is for | potential values |
| ------------- | ---------------| ---------------|
| type |	specify the type of event notification | push, pull or url |
| frequency |	tells a pull notification how often to poll | number of seconds between polls. Minimum  is 10 | 
| start	| timestamp from when to start noticing events. 0 will return all events| now. Will be automatically updated on each callback to avoid repetition |
| method |	for url push notification, the http method to use to callback on | default is POST |
| message |	an arbitrary message to send in addition to the usual event data | any object or serializable value |


### off (watchable [,params])

This removes any previous watch using the watchable key. off is automatically called when the watch subscription expires.
- watchable is the key created when the watch subscription was created with the .on method, and is retrieved using the watchable property

### Subscribers to url watches

If you set up a url type subscription, then you pass control to the server to manage state and activity. This means that you can cause a different app (or apps) to be informed in the case of a change to data. An example of that could be a JavaScript app that synchs data with some Google Apps document. To do that, you'd publish an Apps Script webapp that knew what to do with data changes, and instruct the effex server to call its url in the event of a data change

```
efx.on ("update" ,
	"anotheralias", 
	"uxk-yrmf1l-b19fle0ipede" , 
 	"https://myappsscritpwebapp", 
 	{type:"url", method:"post", message:{updater:"uxk-yrmf1l-b19fle0ipede"}});

```

Here's what an App Script webapp might look like. 

```
function doPost(e) {
  
  // get the params
  var params = e.parameter || {};
  var post = JSON.parse((e.postData || {}).contents);
  
  // expecting to find a key to access the thing, plus an id
  var data = useData (post.id , post.message && post.message.updater );
  
  // send back the body as a response
  var response = {
    ok:data && data.ok,
    code:data && data.code,
    error:data && data.error
  };
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
```
It gets woken by a post operation with the info it needs to access the data that's changed in its post body, including the access key it should use (another approach would have been for it to already have exchanged fixed keys with the collaborator).

It should return some kind of response meaningful to you, which will be logged in the watchlog (see later) for you to inspect. For standardization, I recommend that you include the 3 properties shown at least.

Here's how Apps Script could consume the data in the store.

```
/**
* @param {string} item the effex id
* @param {string} updater the updater id
* @return {object} the data
*/
function useData (item, updater) {
  
  var sheetName = "pushDemo";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // access the item
  if (updater && item) {

    // set up a connection
    var efx = cEffexApiClient.EffexApiClient.setDev();
    
    // read the data
    var data  = efx.read (item , updater);
    if (data.ok) {

      // write to the sheet
      writeToSheet (sheetName, data.value);

    }
    else {
      console.log('received a notification on item, but failed to read it', JSON.stringify (data));
    }
  }
  else {
    console.log('received a notification but dont have a key');
  }
  return data;
  
}

```
And whatever your favorite method of writing to the sheet- not really relevant for the example, but for completeness
```

/**
* @param {string} sheetName the sheet to write it to
* @param {[object]} data the data to write to it
* @return {object} a fiddler
*/
function writeToSheet (sheetName , data) {

  // get a fiddler and assign the data
  var fiddler = new cUseful.Fiddler()
  .setData (data);
  
  // where its goinf
  var outputRange = SpreadsheetApp
  .getActiveSpreadsheet()
  .getRange("A1");
  
  // clear the sheet
  outputRange
  .getSheet()
  .clearContents()
  
  // write the thing to the sheet
  fiddler
  .getRange(outputRange)
  .setValues(fiddler.createValues());
  
  // in case anyone needs it
  return fiddler;
}
```
To continue the conversation, Apps Script could use the keys provided to write something back, and if the initiating app (or some other) were listening they'd get the reply that Apps Script had updated the data too. 

### Events

You can choose which events to listen for from one or more of this list. Events are triggered strictly in the order they are detected, (which will be shortly after they actually occur). Note that the only event currently supported for now is update. Others are in development.
- update - if content is updated
- remove - not yet supported
- expire - not yet supported


#### Event object

The event object varies slightly depending on the type of watch subscribed to, but here is an example of what will be passed to the subscription callback.
```
{ created: 1495367395543,
  id: 'dx1f9-izm1f9-36g16b1mfela',
  event: 'update',
  options: 
   { type: 'push',
     frequency: 30,
     start: 1495367395543,
     method: 'POST',
     message: { updater: 'uxk-bndzf1j-b195lfjr66pg' },
     uq: 'uf1bgldf9iu',
     pushid: 'o51bgldf7mu' },
  value: [ 1495367396648 ] }
```
Here's a brief summary of what some of these things are
- id - The id of the item that has been updated, removed or expired.
- created - when the subscription was created
- alias - If an alias is being watched (rather than a specific id), it'll be here
- value - An array of timestamps when the event occurred, starting just after the last time an event was reported. Typically there will be just one, but you can request a longer history, or if you are doing a pull subscription, several events may have occured between pollings.
- type - of notification
- frequency - only relevant for pull notifications - how often to poll for changes
- uq - an internal tracking id to link to the specific .on event
- event - the type of event
- pushId - a unique id for the session that initiated the subscription
- message - an optional message of any custom data you set up with the .on method
 

Note that the contents of the item are not returned, just notification that there was an event, along with the id (and maybe also the alias) of the item. To be able to read the item (or update it), the watching process will need a key authorized to do so. There are multiple ways to do this. 

- If the process watching is the same one as the one that created the watch in the first place, then it will probably already have a suitable key available.
- If a different process is being poked (probably with a url type watch), it may not have a suitable access key. In this case you may want to use the message option to send one over.
- In a collaborative workflow, keys will already have been shared with partner processes so they will use those.

An example might be a JavaScript process which calls an Apps Script webapp's doPost method to update a spreadsheet in real time. It would also watch for changes that Apps Script made and do something with those changes too. 


#### session

You may receive event notifications of changes you make in your own session, which may or may not be a useful thing to you. Every call you make to the API includes a session id - which is a unique id which lasts as long as your app is running. When you retrieve a record from the store, it will contain a session property. To avoid dealing with changes you've made yourself you can simply check the session id against the current session. 

```
efx.get (id)
.then (function (result) {
  if (result.data.session !== efx.getSession()) {
     // It was a change made by some other session than this one ....
  }
});
```

You can also set a custom session id, if you want to check across multiple sessions, set them all like this
```
efx.setSession ("barney rubble");
```
All items you write will take your custom session id and all will be considered part of the same session

```
efx.get (id)
.then (function (result) {
  if (result.data.session !== efx.getSession()) {
     // It was a change made by some other session than this one ....
  }
});
```
### Debugging watch subscriptions

This can be quite hard as in the case of push, and especially url watches, there is no direct connection between your client, the server and the target process. However, the store keeps a log of any watch activity that provoked a push or url event for some time after it has happened, which can be inspected using the getWatchLog method of the SDK.

#### getEventLog ( id , accessKey, event  [,params]) 

Note that no item data is stored in the log - it's purely a record of what happened. The message information is also suppressed, unless the accessKey provided is the writer key that created it - in other words you can read an event log with any key that can read the item for which the event is being monitored, but the message will only be visible to the owner of the item (i.e the writer key that created it).

Here's an example of using this method

```
efx.getEventLog(id ,readerKey, "update"))
  .then ((result)=>console.log(result.data));

```
Which produces a response like this, which shows the timestamps for update events for a particular item. It also shows all the  subscriptions that exist for the item (or alias) id.  
```
{
	"ok": true,
	"key": "uxk-gsarf1e-b19424u6413h",
	"validtill": "2017-05-26T10:15:00.966Z",
	"type": "updater",
	"plan": "x",
	"accountId": "1f9",
	"code": 200,
	"reader": "uxk-gsarf1e-b19424u6413h",
	"id": "dx1f9-oxmo2s9-aqf1nb1bfwjy",
	"alias": "item-pd-demo",
	"modified": 1494239069002,
	"session": "r01bf9cklgr",
	"watchables": [{
		"created": 1494072711625,
		"watchable": "sx-tb224-11j9g896f6hb",
		"event": "update",
		"options": {
			"type": "push",
			"frequency": 30,
			"start": 1494072711625,
			"method": "POST",
			"uq": "14b1bfeqokb0",
			"pushid": "1261bfbs9f71"
		}
	}],
	"now": 1494239406066,
	"values": [1494239047481, 1494239069111]
}


```
### state

This kind of subscription, would seem to introduce some *state* into the API process, but in fact the API itself is stateless. The API simply registers details about interest in notifications. The data store watches for changes in data items and and handles all the connections with the push subscribers.


## Contributing and environment

efx runs as a shared environment on firebase, but you can also run your own if you prefer. I haven't written that up yet, but ping me if you are interested.

I'd love to hear from anyone who'd like to create (or improve) SDKs for any platforms. JavaScript, Node , Apps Script and VBA are currently available - but I'd like some more. 

I'll also feature any use cases or videos you'd like to share on my site.

### technology

V2 has gone completely serverless and uses Firebase hosting and cloud functions, Firebase authentication and push notification and FireStore as the datastore. 


v1 technology (now deprecated was)

Server - Node - App Engine

Push server - Node - App Engine , Firebase

Database - Redis - Compute engine

Console app - React, Redux , Firebase

Diagrams here
https://docs.google.com/presentation/d/1yGL2EHlwysdomtBzU_ha8C6_1SSeQo85nmHs23PUvtU/edit?usp=sharing


## More stuff
See http://ramblings.mcpher.com/Home/excelquirks/ephemeralexchange for more stuff



