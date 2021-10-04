'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _foodtruck = require('../model/foodtruck');

var _foodtruck2 = _interopRequireDefault(_foodtruck);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // '/v1/foodtruck' - GET all food trucks
  api.get('/', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.find({}, function (err, foodtrucks) {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - GET a specific food truck
  api.get('/:id', function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/add' - POST - add a food truck
  api.post('/add', function (req, res) {
    var newFoodTruck = new _foodtruck2.default();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Food Truck saved successfully' });
    });
  });

  // '/v1/foodtruck/:id' - DELETE - remove a food truck
  api.delete('/:id', function (req, res) {
    _foodtruck2.default.remove({
      _id: req.params.id
    }, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      _review2.default.remove({
        foodtruck: req.params.id
      }, function (err, review) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Food Truck and Reviews Successfully Removed" });
      });
    });
  });

  // '/v1/foodtruck/:id' - PUT - update an existing record
  api.put('/:id', function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;
      foodtruck.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Food Truck info updated' });
      });
    });
  });

  // add a review by a specific foodtruck id
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      var newReview = new _review2.default();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save(function (err, review) {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Food truck review saved' });
        });
      });
    });
  });

  // get reviews for a specific foodtruck id
  // '/v1/foodtruck/reviews/:id'
  api.get('/reviews/:id', function (req, res) {
    _review2.default.find({ foodtruck: req.params.id }, function (err, reviews) {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  return api;
};
//# sourceMappingURL=foodtruck.js.map