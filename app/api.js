var express = require('express');

var mongoose = require('mongoose');

var Party = require('./models/parties');
var Member = require('./models/members');
var Post = require('./models/post');
var StaticString = require('./models/string');

var router = express.Router();

router.route('/parties')
  .get(function(req, res, next) {
    Party.find({ cffc: { $exists: true }})
    .exec().then(function(parties){
      res.json(parties);
    }, next);
  })
  .post(function(req, res, next) {
    var name = req.body.name;
    var date = req.body.date;
    var ticketSaleDate = new Date(req.body.ticketSaleDate);
    var ticketSaleDate2 = new Date(ticketSaleDate.getTime() + 86400000);
    new Party({
      name, date,
      ticketSale: {
        sales: [{
          startTime: ticketSaleDate,
          endTime: new Date(ticketSaleDate.getTime() + 3600000),
          locations: [ 'Teknologgården (Johanneberg)', 'Jupiter (Lindholmen)' ],
          info: 'Chalmerist with valid student ID only\nMax 1+7 tickets/person'
        }, {
          startTime: ticketSaleDate2,
          endTime: new Date(ticketSaleDate2.getTime() + 3600000),
          locations: [ 'Teknologgården (Johanneberg)' ],
          info: 'Anyone can buy\nMax 8 tickets/person'
        }],
        note: 'Reserve for changes, >= 18 years'
      }
    })
    .save().then(function(party) {
      res.json(party);
    }, next);
  });
router.route('/parties/:party_id')
  .put(function(req, res, next) {
    var cffc = req.body.cffc;
    Party.findByIdAndUpdate(req.params.party_id, { cffc })
    .exec().then(function(party) {
      res.end();
    }, next);
  })
  .delete(function(req, res, next) {
    Party.findByIdAndRemove(req.params.party_id)
    .exec().then(function(party) {
      res.end();
    }, next);
  });

router.route('/parties/next')
  .get(function(req, res, next) {
    Party.findOne({ date: { $gt: new Date() }})
    .sort('-date')
    .exec().then(function(party) {
      res.json(party);
    }, next);
  });


// ?year=2015
router.route('/members')
  .get(function(req, res, next){
    Member.find()
    .select('-__v')
    .exec().then(function(members){
      res.json(members);
    }, next)
  })
  .put()
  .post()
  .delete();

router.get('/members/current', function(req, res, next){
  var now = new Date();
  var year = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
  Member.find({ year })
  .select('-__v -mail -address')
  .populate('post')
  .exec().then(function(members){
    res.json(members);
  }, next)

});

// /api/strings/contact_info
router.route('/strings/:key')
  .get(function(req, res, next) {
    StaticString.findOne({ key: req.params.key})
    .then(function(val) {
      if (!val) return res.status(404).end();
      res.json({ value: val.value });
    }, next);
  })
  .post(function(req, res, next) {
    var key = req.params.key;
    var value = req.body.value;
    if (!value) return res.status(400).end();
    StaticString.findOneAndUpdate({ key }, { key, value },
      { upsert: true, new: true })
    .exec().then(function(val) {
      res.json({ value: val.value });
    }, next);
  })
  .delete(function(req, res, next) {
    var key = req.params.key;
    StaticString.findOneAndRemove({ key })
    .exec(function(val) {
      res.end();
    }, next);
  });

module.exports = router;