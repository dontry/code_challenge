const Bot = require("./bot");
const OFF_TABLE_WARNING = require("./contants").OFF_TABLE_WARNING;
const INVALID_DIRECTION = require("./contants").INVALID_DIRECTION;

global.console = {
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};
describe("Test attributes", () => {
  let bot;
  beforeEach(function() {
    bot = new Bot();
  });
  it("should create a new bot", () => {
    expect(bot.getX()).toEqual(0);
    expect(bot.getY()).toEqual(0);
    expect(bot.getDirection()).toEqual("EAST");
  });

  it("should set x to 1", () => {
    bot.setX(1);
    expect(bot.getX()).toEqual(1);
  });

  it("should throw err when x is undefined or null", () => {
    expect(() => bot.setX()).toThrow("position x is null/undefined");
    expect(() => bot.setX(null)).toThrow("position x is null/undefined");
  });

  it("should throw err when type of x is not number", () => {
    expect(() => bot.setX("13")).toThrow("");
    expect(() => bot.setX({ x: 13 })).toThrow("type of x is invalid");
  });

  it("should throw err when  x is not integer", () => {
    expect(() => bot.setX(13.5)).toThrow("position x is not integer");
  });

  it("should throw error when x is out of bound", () => {
    expect(() => bot.setX(6)).toThrow(OFF_TABLE_WARNING);
    expect(() => bot.setX(-1)).toThrow(OFF_TABLE_WARNING);
  });
  it("should throw error when x is out of bound", () => {
    expect(() => bot.setX(6)).toThrow(OFF_TABLE_WARNING);
    expect(() => bot.setX(-1)).toThrow(OFF_TABLE_WARNING);
  });

  it("should throw error when y is out of bound", () => {
    expect(() => bot.setY(6)).toThrow(OFF_TABLE_WARNING);
    expect(() => bot.setY(-1)).toThrow(OFF_TABLE_WARNING);
  });

  it("should throw error when direction is invalid", () => {
    expect(() => bot.setDirection("")).toThrow(INVALID_DIRECTION);
    expect(() => bot.setDirection("direction")).toThrow(INVALID_DIRECTION);
  });
});

describe("Test command", () => {
  var bot;
  beforeEach(function() {
    bot = new Bot();
  });
  it("should move 1 unit to EAST", () => {
    bot.executeCommand("MOVE");
    expect(bot.getX()).toEqual(1);
  });
  it("should turn EAST to NORTH when execute LEFT", () => {
    expect(bot.getDirection()).toEqual("EAST");
    bot.executeCommand("LEFT");
    expect(bot.getDirection()).toEqual("NORTH");
  });
  it("should turn EAST to SOUTH when execute RIGHT", () => {
    expect(bot.getDirection()).toEqual("EAST");
    bot.executeCommand("RIGHT");
    expect(bot.getDirection()).toEqual("SOUTH");
  });
  it("should turn EAST to WEST when execute RIGHT RIGHT", () => {
    expect(bot.getDirection()).toEqual("EAST");
    bot.executeCommand("RIGHT");
    bot.executeCommand("RIGHT");
    expect(bot.getDirection()).toEqual("WEST");
  });

  it("should log current state", () => {
    bot.executeCommand("REPORT");
    expect(console.log).toBeCalledWith("0,0,EAST");
  });

  it("should prompt a warning when bot is about to fall off table, and remain current place", () => {
    bot.executeCommand("RIGHT");
    bot.executeCommand("MOVE");
    expect(console.warn).toBeCalledWith(OFF_TABLE_WARNING);
    expect(bot.getState()).toEqual({
      x: 0,
      y: 0,
      direction: "SOUTH"
    });
  });
});
