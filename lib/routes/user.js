// # User API
var restify        = require('restify'),
    utils          = require('../server/utils'),
    mongoPersister = require('../mongodb-persister/mongoPersister');


exports.register = function (req, res, next) {
  
  var err = utils.validEmptyParams(req, ['app', 'userId','deviceId']);
  
  if(err){
    next(err);
    return;
  }
  
  var _param = req.params;
  mongoPersister.registerUser(
    _param.app, 
    _param.userId, 
    utils.encrypto(_param.password), 
    _param.deviceId,
    _param.notiId, 
    _param.datas,
    function (err, msg) {
      
      if(err){
        res.send({status: 'error', message: err});
      }else{
        res.send({status: 'ok'});
      }
    });
  
};

exports.update = function(req, res, next){
  var err = utils.validEmptyParams(req, ['app', 'userId','deviceId','password']);
  
  if(err){
    next(err);
    return;
  }
  var _param = req.params;

  mongoPersister.updateUser(
    _param.app,
    _param.userId,
    _param.deviceId,
    utils.encrypto(_param.password),
    _param.notiId,
    _param.datas,
    function(err, msg){
      if(err){
        res.send({status: 'error', message: err});
      }else{
        res.send({status: 'ok', user : msg});
      }
    });
}


exports.find = function(req, res, next){
  var err1 = utils.validEmptyParams(req, ['app', 'userId','deviceId']);
  var err2 = utils.validEmptyParams(req, ['name']);
  var err3 = utils.validEmptyParams(req, ['email']);

  if( ( err1 && err2 && err3) ){
    next(err1);
    return;
  }
  var _param = req.params;
  var _keys = [];
  var _values = [];
  if(!err1){
    _keys.push('userId');
    _keys.push('deviceId');
    _values.push(_param.userId);
    _values.push(_param.deviceId);
  }else if (!err2){
    _keys.push('datas.name');
    _values.push(_param.name);
  }else {
    _keys.push('datas.email');
    _values.push(_param.email);
  } 

  mongoPersister.searchUser(
    _param.app,
    _keys,
    _values,
    function(err, user, msg){
      if(err){
        return res.send(err);
      }
      if(!user){
        return res.send(msg);
      }
      return res.send( {status: 'ok', user : user});
    });
}


/*
// ### <code>GET</code> /user/info/:userId
//
// - *<code>PARAM</code> app* : application name
// - *<code>URI</code> userId* : user id
exports.retrieve = function (req, res) { 
  
  mongoPersister.retrieveUser(
    req.params.app, 
    req.params.userId, 
    function (err, user, msg) {
      
      if(err){
        console.log(err);
        res.send({status: 'error', message: err});
      }else{
        res.send({status: 'ok', result: user});
      }
      
    });
  
};

// ### <code>POST</code> /user/register
//
// - *<code>PARAM</code> app* : application name
// - *<code>PARAM</code> userId* : user id
// - *<code>PARAM</code> deviceType* : web / android / iphone 
// - *<code>PARAM</code> deviceId* : device id (unique key) (optional)
// - *<code>PARAM</code> notiId* : notification token key (optional)
// - *<code>PARAM</code> datas* : additional data (JSON Object) (optional)



// ### <code>POST</code> /user/login
//
// - *<code>PARAM</code> app* : application name
// - *<code>PARAM</code> userId* : user id
exports.login = function (req, res, next) {
  
  var err = utils.validEmptyParams(req, ['app', 'userId']);
  
  if(err){
    next(err);
    return;
  }
  
  var _param = req.params;
  
  mongoPersister.createUserSessionId(_param.app, _param.userId, function (err, sessionId) {
    
    if(err){
      console.log(err);
      res.send({status: 'error', message: err});
    }else{
      res.send({status: 'ok', result: {'sessionId': sessionId}});
    }
    
  });
  
};


// ### <code>POST</code> /user/logout
//
// - *<code>PARAM</code> app* : application name
// - *<code>PARAM</code> userId* : user id
exports.logout = function (req, res, next) {
  
  var err = utils.validEmptyParams(req, ['app', 'userId']);
  
  if(err){
    next(err);
    return;
  }
  
  var _param = req.params;
  
  mongoPersister.removeUserSessionId(_param.app, _param.userId, function (err) {
    if(err){
      console.log(err);
      res.send({status: 'error', message: err});
    }else{
      res.send({status: 'ok'});
    }
  });
  
};

exports.search = function (req, res, next) {
  
  var err = utils.validEmptyParams(req, ['app']);
  
  if(err){
    next(err);
    return;
  }
  
  _keys = [];
  _values = [];
  if(req.params.keys) {
    _keys = req.params.keys.split('^');
    _values = req.params.values.split('^');
  }
  
  mongoPersister.searchUser(req.params.app, _keys, _values, function (err, users) {
    
    if(err){
      console.log(err);
      res.send({status: 'error', message: err});
    }else{
      res.send({status: 'ok', result: users});
    }
    
  });
};
*/

