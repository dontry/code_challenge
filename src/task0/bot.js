"use strict";

const UPPER_BOUNDARY = 4;
const LOWER_BOUNDARY = 0;
const DIRECTION = {
  EAST: 0,
  NORTH: 90,
  WEST: 180,
  SOUTH: 270
};
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
    const curDegree = convertDirectionToDegree(this.getDirection());
    const tmp = curDegree - 90;
    const newDegree = tmp < 0 ? 360 + tmp : tmp % 360;
    const newDirection = convertDegreeToDirection(newDegree);
    this.setDirection(newDirection);
  }

  function turnLeft() {
    const curDegree = convertDirectionToDegree(this.getDirection());
    const tmp = curDegree + 90;
    const newDegree = tmp < 0 ? 360 + tmp : tmp % 360;
    const newDirection = convertDegreeToDirection(newDegree);
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

    setX(x) {
      if (x === null || x === undefined) {
        throw "position x is null/undefined";
      } else if (typeof x !== "number") {
        throw "type of x is invalid";
      } else if (!Number.isInteger(x)) {
        throw "position x is not integer";
      } else if (x < LOWER_BOUNDARY || x > UPPER_BOUNDARY) {
        throw OFF_TABLE_WARNING;
      } else {
        this.x = x;
      }
    },
    setY: function(y) {
      if (y === null || y === undefined) {
        throw "position y is null";
      } else if (typeof y !== "number") {
        throw "y type is invalid";
      } else if (!Number.isInteger(y)) {
        throw "position y is not integer";
      } else if (y < LOWER_BOUNDARY || y > UPPER_BOUNDARY) {
        throw OFF_TABLE_WARNING;
      } else {
        this.y = y;
      }
    },
    getState: function() {
      return {
        x: this.x,
        y: this.y,
        direction: this.direction
      };
    },
    setDirection: function(direction) {
      if (DIRECTION.hasOwnProperty(direction)) {
        this.direction = direction;
      } else {
        throw "Invalid direction";
      }
    },
    executeCommand: function(action, payload) {
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

function convertDirectionToDegree(direction) {
  return DIRECTION[direction];
}

function convertDegreeToDirection(degree) {
  for (const dir in DIRECTION) {
    if (DIRECTION[dir] === degree) return dir;
  }
}

module.exports = Bot;
