"use strict";

const UPPER_BOUNDARY = 4;
const LOWER_BOUNDARY = 0;
const DIRECTION = ["EAST", "SOUTH", "WEST", "NORTH"];
const ACTION = {
  MOVE: "MOVE",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  REPORT: "REPORT",
  PLACE: "PLACE"
};

const INITIAL_STATE = {
  x: 0,
  y: 0,
  direction: "EAST"
};

const OFF_TABLE_WARNING = require("./contants").OFF_TABLE_WARNING;
const INVALID_DIRECTION = require("./contants").INVALID_DIRECTION;

function Bot(x, y, direction) {
  this.x = x || INITIAL_STATE.x;
  this.y = y || INITIAL_STATE.y;
  this.direction = direction || INITIAL_STATE.direction;
}

Bot.prototype = (function() {
  function place(state) {
    const prevState = this.getState();
    try {
      this.setX(state.x);
      this.setY(state.y);
      this.setDirection(state.direction);
    } catch (err) {
      console.error(err);
      place.call(this, prevState);
    }
  }

  function move() {
    switch (this.getDirection()) {
      case "EAST":
        this.setX(this.getX() + 1);
        break;
      case "WEST":
        this.setX(this.getX() - 1);
        break;
      case "NORTH":
        this.setY(this.getY() + 1);
        break;
      case "SOUTH":
        this.setY(this.getY() - 1);
    }
  }

  function turnRight() {
    const newDirection = DIRECTION[(DIRECTION.indexOf(this.direction) + 1) % 4];
    this.setDirection(newDirection);
  }

  function turnLeft() {
    const newDirection =
      DIRECTION[(((DIRECTION.indexOf(this.direction) - 1) % 4) + 4) % 4]; //mod negative number ((x%n)+n)%n
    this.setDirection(newDirection);
  }

  function report() {
    console.log(`${this.getX()},${this.getY()},${this.getDirection()}`);
  }

  return {
    constructor: Bot,
    getX() {
      return this.x;
    },
    getY() {
      return this.y;
    },
    getDirection() {
      return this.direction;
    },
    setX: setPosition("x"),
    setY: setPosition("y"),
    getState() {
      return {
        x: this.x,
        y: this.y,
        direction: this.direction
      };
    },
    setDirection(direction) {
      if (DIRECTION.indexOf(direction) === -1) throw INVALID_DIRECTION;
      this.direction = direction;
    },
    executeCommand(action, payload) {
      const curState = this.getState();
      try {
        switch (action) {
          case ACTION.MOVE:
            move.call(this);
            break;
          case ACTION.LEFT:
            turnLeft.call(this);
            break;
          case ACTION.RIGHT:
            turnRight.call(this);
            break;
          case ACTION.PLACE:
            const args = payload.split(",");
            const state = {
              x: Number.parseFloat(args[0]),
              y: Number.parseFloat(args[1]),
              direction: args[2]
            };
            place.call(this, state);
            break;
          case ACTION.REPORT:
            report.call(this);
            break;
          default:
            throw "Invalid command";
        }
      } catch (err) {
        console.warn(err);
        place.call(this, curState);
      }
    }
  };
})();

function setPosition(key) {
  return function(val) {
    if (val === null || val === undefined) {
      throw `position ${key} is null/undefined`;
    } else if (typeof val !== "number") {
      throw `type of ${key} is invalid`;
    } else if (!Number.isInteger(val)) {
      throw `position ${key} is not integer`;
    } else if (val < LOWER_BOUNDARY || val > UPPER_BOUNDARY) {
      throw OFF_TABLE_WARNING;
    } else {
      this[key] = val;
    }
  };
}

module.exports = Bot;
