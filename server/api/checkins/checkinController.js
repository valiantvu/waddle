var Q = require('q');
var _ = require('lodash');

var Checkin = require('./checkinModel.js');
var User = require('../users/userModel.js');

var foursquareUtils = require('../../utils/foursquareUtils.js');
var instagramUtils = require('../../utils/instagramUtils.js');
var facebookUtils = require('../../utils/facebookUtils.js');

var checkinController = {};

checkinController.instagramHubChallenge = function (req, res) {
  res.status(200).send(req.query['hub.challenge']);
};

checkinController.handleIGPost = function (req, res) {
  var updateArr = req.body;

  var posts = _.map(updateArr, function (update) {
    return instagramUtils.handleUpdateObject(update);
  })

  Q.all(posts)
  .then(function (postArr) {
    // write to db using batch query?
    console.log(JSON.stringify(postArr));

    var flatPostArr = _.flatten(postArr);

    var queries = _.map(flatPostArr, function (post) {
      return post.user.addCheckins([post.checkin]);
    });

    return Q.all(queries);
  })
  .then(function (data) {
    console.log(JSON.stringify(data));
  })
  .catch(function (e) {
    console.log(e);
  });

  res.status(200).end();
};

checkinController.facebookHubChallenge = function (req, res) {
  res.status(200).send(req.query['hub.challenge']);
};

checkinController.handleFBPost = function (req, res) {
  var updateArr = req.body.entry;
  console.log("dis be ma bodayy: " + JSON.stringify(req.body));
  console.log("dis be ma boday's entray: " + JSON.stringify(updateArr));

  var posts = _.map(updateArr, function(update) {
    return facebookUtils.handleUpdateObject(update);
  });

  Q.all(posts)
    .then(function (postArr) {
      // write to db using batch query?
      console.log("ARR, dis be da postarr: " + JSON.stringify(postArr));

      var flatPostArr = _.flatten(postArr);

      var queries = [];

      _.each(flatPostArr, function (userObj) {
        console.log('user obj', JSON.stringify(userObj));
        var myUser = userObj.user;
        var myCheckins = userObj.checkins;

        _.each(myCheckins, function (checkin) {
          queries.push(myUser.addCheckins([checkin]));
        });

      });

      return Q.all(queries);
    })
    .then(function (data) {
      console.log(JSON.stringify(data));
    })
    .catch(function (e) {
      console.log(e);
    });
  res.status(200).end();
}


checkinController.realtimeFoursquareData = function (req, res) {
  var checkin = JSON.parse(req.body.checkin);
  var userFoursquareID = checkin.user.id;
  var user;

  User.findByFoursquareID(userFoursquareID)
  .then(function (userNode) {
    user = userNode;
    console.log(checkin);
    return foursquareUtils.parseCheckin(checkin);
  })
  .then(function (parsedCheckin) {
    return user.addCheckins([parsedCheckin]);
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.log(err);
  });

  res.status(200).end();
};

checkinController.addToBucketList = function (req, res){
  var checkinID = req.body.checkinID;
  var facebookID = req.body.facebookID;

  Checkin.addToBucketList(facebookID, checkinID)
    .then(function (data){
      res.json(data);
      res.status(201).end();
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).end();
    });
};

checkinController.addComment = function (req, res){
  var clickerID = req.body.clickerID;
  var checkinID = req.body.checkinID;
  if (req.body.text) {
    var text = req.body.text;
  } else {
    res.status(404).end()
  }

  Checkin.addComment(clickerID, checkinID, text)
    .then(function (data){
      console.log(data);
      res.json(data);
      res.status(201).end();
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).end();
    });
};

checkinController.giveProps = function (req, res){
  var clickerID = req.body.clickerID;
  var checkinID = req.body.checkinID;

  Checkin.giveProps(clickerID, checkinID)
    .then(function (data){
      console.log(data)
      res.json(data);
      res.status(201).end();
    })
    .catch(function (err){
      console.log(err);
      res.status(500).end();
    });
};

checkinController.getPropsAndComments = function (req, res){
  var checkinID = req.params.checkinid;
  var data = {}

  Checkin.getProps(checkinID)
    .then(function (props){
      data['props'] = props;
      return Checkin.getComments(checkinID);
    })
    .then(function (comments){
      if (typeof comments === "object")
      data['comments'] = comments;
      var parsedData = {
        props: data.props.length,
        propGivers: [],
        comments: []
      };
     
      parsedData.propGivers = _.map(data.props, function (prop) {
        return prop.user._data.data
      });

      parsedData.comments = _.map(data.comments, function (comment) {
        return {
          commenter: comment.user._data.data, 
          comment: comment.comment._data.data
        }
      });

      res.json(parsedData);
      res.status(200).end();
    })
    .catch(function (err){
      console.log(err);
      res.status(500).end();
    });
};

module.exports = checkinController;
