const fs = require("fs");
const width = 1000;
const height = 1000;
const dir = __dirname;
const rarity = [
  { key: "", val: "original" },
  { key: "_r", val: "rare" },
  { key: "_sr", val: "super rare" },
];

const addRarity = (_str) => {
  let itemRarity;
  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });
  return itemRarity;
};

const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });
};

const layers = [
  {
    id: 1,
    name: "Background",
    location: `${dir}/Background/`,
    elements: getElements(`${dir}/Background/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 2,
    name: "Tail",
    location: `${dir}/Tail/`,
    elements: getElements(`${dir}/Tail/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 3,
    name: "Body_Types",
    location: `${dir}/Body_Types/`,
    elements: getElements(`${dir}/Body_Types/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 4,
    name: "Torso",
    location: `${dir}/Torso/`,
    elements: getElements(`${dir}/Torso/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 5,
    name: "Hand_items",
    location: `${dir}/Hand_items/`,
    elements: getElements(`${dir}/Hand_items/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 6,
    name: "Hand",
    location: `${dir}/Hand/`,
    elements: getElements(`${dir}/Hand/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 7,
    name: "Head",
    location: `${dir}/Head/`,
    elements: getElements(`${dir}/Head/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 8,
    name: "Ears",
    location: `${dir}/Ears/`,
    elements: getElements(`${dir}/Ears/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 9,
    name: "Mouth",
    location: `${dir}/Mouth/`,
    elements: getElements(`${dir}/Mouth/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 10,
    name: "Eyes",
    location: `${dir}/Eyes/`,
    elements: getElements(`${dir}/Eyes/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 11,
    name: "Nose",
    location: `${dir}/Nose/`,
    elements: getElements(`${dir}/Nose/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
  {
    id: 12,
    name: "Hats_Hair",
    location: `${dir}/Hats_Hair/`,
    elements: getElements(`${dir}/Hats_Hair/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  },
];

module.exports = { layers, width, height };
