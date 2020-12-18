// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/gamma.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gamma = void 0;
var gamma1 = {
  ship: '#E15A97',
  meteor1: '#EEABC4',
  meteor2: '#F9E900',
  space: '#1a1122',
  bullet: 'hsl(40, 100%, 57%)',
  //'#2f2',
  spaceshipSrc: './ships/spaceship_teal.gif',
  enemy: './ships/spaceship_red.gif'
};
var gamma2 = {
  ship: '#E15A97',
  meteor1: '#4B2840',
  meteor2: '#F9E900',
  space: '#EEABC4',
  bullet: '#000',
  spaceshipSrc: './ships/spaceship.gif'
};
var gamma = gamma1;
exports.gamma = gamma;
},{}],"js/classes/movingBall.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovingBall = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MovingBall = /*#__PURE__*/function () {
  function MovingBall(_ref) {
    var x = _ref.x,
        y = _ref.y,
        angle = _ref.angle,
        r = _ref.r,
        speed = _ref.speed,
        coordBox = _ref.coordBox,
        mode = _ref.mode,
        dx = _ref.dx,
        dy = _ref.dy;

    _classCallCheck(this, MovingBall);

    this.x = x;
    this.y = y;
    this.r = r || 5; //angle and speed have priority over dx and dy

    if (typeof angle === 'undefined' || typeof speed === 'undefined') {
      this.dx = dx || 1;
      this.dy = dy || 1;
      this.speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
      this.angle = undefined;
    } else {
      this.speed = speed; //should we calculate the angle change in case of bounce?

      this.angle = angle;
      this.dx = this.speed * Math.sin(angle);
      this.dy = -this.speed * Math.cos(angle);
    }

    this.gone = false;
    this.minX = coordBox.min.x || 0;
    this.minY = coordBox.min.y || 0;
    this.maxX = coordBox.max.x || 0;
    this.maxY = coordBox.max.y || 0;
    this.checkModeConditions = (mode ? MovingBallModes[mode] : MovingBallModes['flyAway']).bind(this);
  }

  _createClass(MovingBall, [{
    key: "draw",
    value: function draw(context) {
      context.fillStyle = '#888';
      context.beginPath();
      context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      context.fill();
    }
  }, {
    key: "move",
    value: function move() {
      this.x += this.dx;
      this.y += this.dy;
      this.checkModeConditions();

      if (this.x < this.minX || this.x > this.maxX || this.y < this.minY || this.y > this.maxY) {
        this.dispose();
      }
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.gone = true;
    }
  }, {
    key: "setMode",
    value: function setMode(mode) {
      this.checkModeConditions = MovingBallModes[mode].bind(this);
    }
  }]);

  return MovingBall;
}();

exports.MovingBall = MovingBall;
var MovingBallModes = {
  'flyAway': function flyAway() {
    if (this.x < this.minX || this.x > this.maxX || this.y < this.minY || this.y > this.maxY) {
      this.dispose();
    }
  },
  'bounce': function bounce() {
    if (this.x - this.r < this.minX || this.x + this.r > this.maxX) {
      this.dx *= -1;
      this.x += this.dx;
    }

    if (this.y - this.r < this.minY || this.y + this.r > this.maxY) {
      this.dy *= -1;
      this.y += this.dy;
    }
  },
  'stall': function stall() {
    if (this.x < this.minX) {
      this.x = this.minX;
    }

    if (this.x > this.maxX) {
      this.x = this.maxX;
    }

    if (this.y < this.minY) {
      this.y = this.minY;
    }

    if (this.y > this.maxY) {
      this.y = this.maxY;
    }
  }
};
},{}],"js/classes/bullet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bullet = void 0;

var _gamma = require("../gamma.js");

var _movingBall = require("./movingBall.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Bullet = /*#__PURE__*/function (_MovingBall) {
  _inherits(Bullet, _MovingBall);

  var _super = _createSuper(Bullet);

  function Bullet(_ref) {
    var x = _ref.x,
        y = _ref.y,
        angle = _ref.angle,
        r = _ref.r,
        speed = _ref.speed,
        coordBox = _ref.coordBox,
        mode = _ref.mode,
        dx = _ref.dx,
        dy = _ref.dy;

    _classCallCheck(this, Bullet);

    return _super.call(this, {
      x: x,
      y: y,
      angle: angle,
      r: r,
      speed: speed,
      coordBox: coordBox,
      mode: mode,
      dx: dx,
      dy: dy
    });
  }

  _createClass(Bullet, [{
    key: "draw",
    value: function draw(context) {
      context.fillStyle = _gamma.gamma.bullet;
      context.beginPath();
      context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      context.fill();
    }
  }]);

  return Bullet;
}(_movingBall.MovingBall);

exports.Bullet = Bullet;
},{"../gamma.js":"js/gamma.js","./movingBall.js":"js/classes/movingBall.js"}],"js/classes/spaceship.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spaceship = void 0;

var _bullet = require("./bullet.js");

var _gamma = require("../gamma.js");

var _movingBall = require("./movingBall.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Spaceship = /*#__PURE__*/function (_MovingBall) {
  _inherits(Spaceship, _MovingBall);

  var _super = _createSuper(Spaceship);

  function Spaceship(_ref) {
    var _this;

    var x = _ref.x,
        y = _ref.y,
        angle = _ref.angle,
        r = _ref.r,
        speed = _ref.speed,
        coordBox = _ref.coordBox,
        mode = _ref.mode,
        dx = _ref.dx,
        dy = _ref.dy,
        skin = _ref.skin;

    _classCallCheck(this, Spaceship);

    _this = _super.call(this, {
      x: x,
      y: y,
      angle: angle,
      r: r,
      speed: speed,
      coordBox: coordBox,
      mode: mode,
      dx: dx,
      dy: dy
    });
    _this.r = r || 20;
    _this.speed = speed || 10;
    _this.dx = dx || 0;
    _this.dy = dx || 0;

    _this.setMode(mode || 'stall');

    _this.destination = {
      x: _this.x,
      y: _this.y
    };
    _this.bulletCoordBox = coordBox;
    _this.skin = new Image();
    _this.skin.src = skin || _gamma.gamma.spaceshipSrc;
    return _this;
  }

  _createClass(Spaceship, [{
    key: "draw",
    value: function draw(c) {
      c.setTransform(1, 0, 0, 1, this.x, this.y); // sets scales and origin

      c.rotate(this.angle);
      c.drawImage(this.skin, -this.r, -this.r, 2 * this.r, 2 * this.r);
      c.setTransform(1, 0, 0, 1, 0, 0);
    }
  }, {
    key: "setDestination",
    value: function setDestination(x, y) {
      this.destination = {
        x: x,
        y: y
      };
      var distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
      this.dx = this.speed * (x - this.x) / distance;
      this.dy = this.speed * (y - this.y) / distance;
      this.angle = this.dx > 0 ? Math.acos(-this.dy / this.speed) : -Math.acos(-this.dy / this.speed);
    }
  }, {
    key: "halt",
    value: function halt() {
      this.stopped = true;
    }
  }, {
    key: "continueMovement",
    value: function continueMovement() {
      this.stopped = false;
    }
  }, {
    key: "move",
    value: function move() {
      if (this.stopped) {
        return;
      }

      if (Math.sqrt(Math.pow(this.destination.x - this.x, 2) + Math.pow(this.destination.y - this.y, 2)) < this.r / 2 + this.speed) {
        this.x = this.destination.x - this.r * this.dx / (2 * this.speed);
        this.y = this.destination.y - this.r * this.dy / (2 * this.speed);
      } else {
        this.x += this.dx;
        this.y += this.dy;
      }
    }
  }, {
    key: "shoot",
    value: function shoot() {
      return new _bullet.Bullet({
        x: this.x + this.dx * this.r / this.speed,
        y: this.y + this.dy * this.r / this.speed,
        angle: this.angle,
        speed: 25,
        coordBox: this.bulletCoordBox
      });
    }
  }]);

  return Spaceship;
}(_movingBall.MovingBall);

exports.Spaceship = Spaceship;
},{"./bullet.js":"js/classes/bullet.js","../gamma.js":"js/gamma.js","./movingBall.js":"js/classes/movingBall.js"}],"js/classes/comet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comet = void 0;

var _gamma = require("../gamma.js");

var _movingBall = require("./movingBall.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Comet = /*#__PURE__*/function (_MovingBall) {
  _inherits(Comet, _MovingBall);

  var _super = _createSuper(Comet);

  function Comet(_ref) {
    var _this;

    var x = _ref.x,
        y = _ref.y,
        angle = _ref.angle,
        r = _ref.r,
        speed = _ref.speed,
        coordBox = _ref.coordBox,
        mode = _ref.mode,
        dx = _ref.dx,
        dy = _ref.dy;

    _classCallCheck(this, Comet);

    _this = _super.call(this, {
      x: x,
      y: y,
      angle: angle,
      r: r,
      speed: speed,
      coordBox: coordBox,
      mode: mode,
      dx: dx,
      dy: dy
    });
    _this.shouldDisappear = false; //Create craters

    _this.craters = [];

    var _loop = function _loop(i) {
      var radius = _this.r / 10 + Math.random() * _this.r / 3;
      var offset = radius / 2 + Math.random() * (_this.r - 3 * radius / 2);
      var angle = Math.random() * Math.PI * 2;
      var newCrater = {
        x: offset * Math.cos(angle),
        y: offset * Math.sin(angle),
        r: radius
      };

      var findRes = _this.craters.find(function (oldCrater) {
        return Math.sqrt(Math.pow(oldCrater.x - newCrater.x, 2) + Math.pow(oldCrater.y - newCrater.y, 2)) < oldCrater.r + newCrater.r;
      });

      if (typeof findRes === 'undefined') {
        _this.craters.push(newCrater);
      }
    };

    for (var i = 0; i < 3; i++) {
      _loop(i);
    }

    return _this;
  }

  _createClass(Comet, [{
    key: "draw",
    value: function draw(c) {
      var _this2 = this;

      c.fillStyle = _gamma.gamma.meteor1;
      if (this.shouldDisappear) c.fillStyle = _gamma.gamma.meteor2;
      c.beginPath();
      c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      c.fill();
      this.craters.forEach(function (crater) {
        c.beginPath();
        c.arc(_this2.x + crater.x, _this2.y + crater.y, crater.r, 0, 2 * Math.PI);
        c.stroke();
      });
    }
  }, {
    key: "setMode",
    value: function setMode(mode) {
      _get(_getPrototypeOf(Comet.prototype), "setMode", this).call(this, mode);

      if (mode == 'flyAway') {
        this.shouldDisappear = true;
      }
    }
  }]);

  return Comet;
}(_movingBall.MovingBall);

exports.Comet = Comet;
},{"../gamma.js":"js/gamma.js","./movingBall.js":"js/classes/movingBall.js"}],"js/classes/Star.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Star = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Star = /*#__PURE__*/function () {
  function Star(x, y) {
    _classCallCheck(this, Star);

    this.x = x;
    this.y = y;
    this.r = Math.random() * 4;
    this.backCount = 0;
  }

  _createClass(Star, [{
    key: "draw",
    value: function draw(context) {
      var radius = this.r;

      if (this.backCount > 0) {
        radius *= this.backCount / 100;
        this.backCount--;
      }

      context.fillStyle = '#fff';
      context.beginPath();
      context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
      context.fill();
    }
  }, {
    key: "flicker",
    value: function flicker() {
      if (Math.random() < 0.001) {
        this.backCount = 200;
      }
    }
  }]);

  return Star;
}();

exports.Star = Star;
},{}],"js/classes/spaceshipAI.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpaceshipAI = void 0;

var _spaceship = require("./spaceship.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SpaceshipAI = /*#__PURE__*/function (_Spaceship) {
  _inherits(SpaceshipAI, _Spaceship);

  var _super = _createSuper(SpaceshipAI);

  function SpaceshipAI(options) {
    var _this;

    _classCallCheck(this, SpaceshipAI);

    _this = _super.call(this, options);
    var mode = options.mode,
        dataAI = options.dataAI;
    _this.applyAICalculations = (mode ? optionsAI[mode] : optionsAI['follow']).bind(_assertThisInitialized(_this));
    _this.dataAI = dataAI;
    return _this;
  }

  _createClass(SpaceshipAI, [{
    key: "move",
    value: function move() {
      this.applyAICalculations();

      _spaceship.Spaceship.prototype.move.call(this);
    }
  }, {
    key: "setAIMode",
    value: function setAIMode(mode, dataAI) {
      this.applyAICalculations = optionsAI[mode].bind(this);
      this.dataAI = dataAI;
    }
  }]);

  return SpaceshipAI;
}(_spaceship.Spaceship);

exports.SpaceshipAI = SpaceshipAI;
var optionsAI = {
  'still': function still() {},
  'follow': function follow() {
    this.setDestination(this.dataAI.target.x, this.dataAI.target.y);
  },
  'dodge': function dodge() {
    var threat = this.dataAI.threat;
    var a = threat.dy / threat.dx;
    var b = threat.y - threat.x * a;
    var sinAlpha = threat.dx / Math.sqrt(Math.pow(threat.dx, 2) + Math.pow(threat.dy, 2));
    var db = (threat.r + this.r) / sinAlpha;

    if (this.y < a * this.x + b + db && this.y > a * this.x + b - db) {
      console.log('under threat');
      var c = this.y + this.x / a;
      b += this.y < a * this.x + b ? -db : db;
      var x = (c - b) * a / (Math.pow(a, 2) + 1);
      var y = a * x + b;
      this.setDestination(x, y);
    }
  }
};
},{"./spaceship.js":"js/classes/spaceship.js"}],"js/menu/menu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Menu = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Menu = /*#__PURE__*/function () {
  function Menu() {
    _classCallCheck(this, Menu);

    this.menu = document.querySelector('menu');
    this.buttons = this.menu.querySelectorAll('button');
    this.buttonListeners = Array.prototype.map.call(this.buttons, function (el) {
      return null;
    });
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  _createClass(Menu, [{
    key: "hide",
    value: function hide() {
      this.menu.classList.add('hidden');
    }
  }, {
    key: "show",
    value: function show() {
      this.menu.classList.remove('hidden');
    }
  }, {
    key: "bindAction",
    value: function bindAction(index, action) {
      var toHide = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      this.buttonListeners[index] = action;
      this.buttons[index].addEventListener('click', action);
      this.buttons[index].classList.remove('menu__button_inactive');

      if (toHide) {
        this.buttons[index].addEventListener('click', this.hide);
      }
    }
  }, {
    key: "unbindAction",
    value: function unbindAction(index) {
      this.buttons[index].removeEventListener('click', this.buttonListeners[index]);
      this.buttons[index].removeEventListener('click', this.hide);
      this.buttons[index].classList.add('menu__button_inactive');
      this.buttonListeners[index] = null;
    }
  }]);

  return Menu;
}();

exports.Menu = Menu;
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _spaceship = require("./js/classes/spaceship.js");

var _comet = require("./js/classes/comet.js");

var _gamma = require("./js/gamma.js");

var _Star = require("./js/classes/Star.js");

var _spaceshipAI = require("./js/classes/spaceshipAI.js");

var _menu = require("./js/menu/menu.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d"); //declare functions

var Game = /*#__PURE__*/function () {
  function Game(context) {
    var _this = this;

    _classCallCheck(this, Game);

    this.initialState = {
      spaceship: {
        x: 500,
        y: 300,
        coordBox: {
          min: {
            x: 0,
            y: 0
          },
          max: {
            x: canvas.width,
            y: canvas.height
          }
        }
      }
      /* new SpaceshipAI({x : 50, y : 50, coordBox : coordBox, speed : 5, skin : gamma.enemy, dataAI : {target : this.spaceship}}),
      new SpaceshipAI({x : 50, y : 500, coordBox : coordBox,speed : 5, skin : gamma.enemy, dataAI : {target : this.spaceship}}) */

    }; //init object state

    this.paused = true;
    this.over = false;
    this.score = 0;
    this.context = context; //init game objects

    this.spaceship = new _spaceship.Spaceship({
      x: this.initialState.spaceship.x,
      y: this.initialState.spaceship.y,
      coordBox: this.initialState.spaceship.coordBox
    });
    this.comets = [];
    this.disposableComets = [];
    this.bullets = [];
    this.enemySpaceships = []; //init player controls

    this.eventListeners = [{
      target: canvas,
      event: 'click',
      handler: function handler(event) {
        var bullet = _this.spaceship.shoot();

        _this.bullets.push(bullet);

        _this.enemySpaceships.forEach(function (ship) {
          ship.setAIMode('dodge', {
            threat: bullet
          });
        });
      }
    }, {
      target: canvas,
      event: 'mousemove',
      handler: function (e) {
        return this.setDestination(e.x, e.y);
      }.bind(this.spaceship)
    }, {
      target: document,
      event: 'keydown',
      handler: function handler(e) {
        if (e.code === "Space") {
          _this.spaceship.halt();
        }
      }
    }, {
      target: document,
      event: 'keyup',
      handler: function handler(e) {
        if (e.code === "Space") {
          _this.spaceship.continueMovement();
        }
      }
    }];
    this.eventListeners.forEach(function (listener) {
      listener.target.addEventListener(listener.event, listener.handler);
    }); //init stars

    this.starCount = 20;
    this.stars = [];

    for (var i = 0; i < this.starCount; i++) {
      this.stars.push(new _Star.Star(Math.random() * canvas.width, Math.random() * canvas.height));
    } //bind own functions


    this.run = this.run.bind(this);
    this.pause = this.pause.bind(this);
    this.continue = this.continue.bind(this);
    this.reset = this.reset.bind(this);
  }

  _createClass(Game, [{
    key: "draw",
    value: function draw() {
      var _this2 = this;

      this.drawBackground();
      this.comets.forEach(function (comet) {
        return comet.draw(_this2.context);
      });
      this.disposableComets.forEach(function (comet) {
        return comet.draw(_this2.context);
      });
      this.enemySpaceships.forEach(function (ship) {
        return ship.draw(_this2.context);
      });
      this.bullets.forEach(function (bullet) {
        return bullet.draw(_this2.context);
      });
      this.spaceship.draw(this.context); //display score

      c.setTransform(1, 0, 0, 1, 0, 0);
      c.fillStyle = '#fff';
      c.font = '30px Georgia';
      c.fillText(this.score, canvas.width - 80, 50);
    }
  }, {
    key: "update",
    value: function update() {
      //change background
      if (Math.random() < 0.01) {
        this.stars.shift();
        this.stars.push(new _Star.Star(Math.random() * canvas.width, Math.random() * canvas.height));
      }

      this.stars.forEach(function (star) {
        return star.flicker();
      }); //stop non-background updates after gameover

      if (this.over) {
        return;
      } //move objects


      this.comets.forEach(function (comet) {
        return comet.move();
      });
      this.disposableComets.forEach(function (comet, index, array) {
        comet.move();

        if (comet.gone) {
          array.splice(index, 1);
        }
      });
      this.enemySpaceships.forEach(function (ship) {
        return ship.move();
      });
      this.spaceship.move();
      this.bullets.forEach(function (bullet, index, array) {
        bullet.move();

        if (bullet.gone) {
          array.splice(index, 1);
        }
      }); //change Enemy destination

      this.enemySpaceships.forEach(function (ship) {
        if (Math.random() < 0.01) {
          ship.setDestination(Math.random() * canvas.width, Math.random() * canvas.height);
        }
      }); //add new comet

      if (Math.random() < 0.03) {
        this.comets.push(new _comet.Comet({
          x: 40,
          y: canvas.height / 2,
          dx: (Math.random() * 8 + 1) * (Math.random() < 0.5 ? 1 : -1),
          dy: (Math.random() * 8 + 1) * (Math.random() < 0.5 ? 1 : -1),
          r: Math.random() * 30 + 10,
          coordBox: {
            min: {
              x: 0,
              y: 0
            },
            max: {
              x: canvas.width,
              y: canvas.height
            }
          },
          mode: 'bounce'
        }));

        if (this.comets.length > 10) {
          var tempComet = this.comets.shift();
          tempComet.setMode('flyAway');
          this.disposableComets.push(tempComet);
        }
      } //check collisions between comets and bullets/spaceship


      this.checkCollisions(); //update score

      if (!this.over) {
        this.score += 1;
      }
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions() {
      var _this3 = this;

      //helper function
      var checkBallsIntercept = function checkBallsIntercept(ball1, ball2) {
        return Math.sqrt(Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2)) < ball1.r + ball2.r;
      };

      this.comets.forEach(function (comet, cometIndex, cometArray) {
        //check commet-bullet collision
        _this3.bullets.forEach(function (bullet, bulletIndex, bulletArray) {
          if (checkBallsIntercept(comet, bullet)) {
            cometArray.splice(cometIndex, 1);
            bulletArray.splice(bulletIndex, 1);
          }
        }); // check commet-spaceship collision


        if (checkBallsIntercept(comet, _this3.spaceship)) {
          /* this.over = true;
          this.spaceship.dispose(); */
          _this3.end();
        }
      });
    }
  }, {
    key: "drawBackground",
    value: function drawBackground() {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.fillStyle = _gamma.gamma.space;
      c.fillRect(0, 0, canvas.width, canvas.height);
      this.stars.forEach(function (star) {
        return star.draw(c);
      });
    }
  }, {
    key: "run",
    value: function run(timestamp) {
      //recalculate state
      this.update(); //draw objects

      this.draw(); //nextStep

      if (!this.paused) {
        requestAnimationFrame(this.run);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: "continue",
    value: function _continue(mousePosition) {
      if (this.over) return;
      this.paused = false;
      this.spaceship.setDestination(mousePosition.x, mousePosition.y);
      requestAnimationFrame(this.run);
    }
  }, {
    key: "end",
    value: function end() {
      this.over = true;
      this.paused = true;
      this.onGameOver();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.paused = true;
      this.over = false;
      this.score = 0;
      this.spaceship.x = this.initialState.spaceship.x;
      this.spaceship.y = this.initialState.spaceship.y;
      this.spaceship.setDestination(this.spaceship.x + 1, this.spaceship.y);
      this.comets = [];
      this.disposableComets = [];
      this.bullets = [];
      this.enemySpaceships = [];
    }
  }]);

  return Game;
}(); //set state


var game = new Game(c);
game.draw();

game.onGameOver = function () {
  menu.show();
  menu.unbindAction(1);
}; //animate


var menu = new _menu.Menu();
menu.bindAction(0, function (e) {
  game.reset();
  game.continue(e);
  menu.bindAction(1, function (e) {
    return game.continue(e);
  });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    menu.show();
    game.pause();
  }
}); //game.run();
},{"./js/classes/spaceship.js":"js/classes/spaceship.js","./js/classes/comet.js":"js/classes/comet.js","./js/gamma.js":"js/gamma.js","./js/classes/Star.js":"js/classes/Star.js","./js/classes/spaceshipAI.js":"js/classes/spaceshipAI.js","./js/menu/menu.js":"js/menu/menu.js"}],"C:/Users/Armas/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57146" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Armas/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map