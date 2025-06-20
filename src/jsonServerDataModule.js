const fs = require("fs");

const data = {
  select: () => {
    const getData = JSON.parse(fs.readFileSync(`./data.json`));
    return getData;
  },
  insert: (bodyData) => {
    const select = data.select();
    const newData = [...select, bodyData];
    fs.writeFileSync(`./data.json`, JSON.stringify(newData));
    return newData;
  },
  update: (bodyData) => {
    const select = data.select();
    const newData = select.map((item) => {
      if (item.key == bodyData.key) {
        item.txt = bodyData.txt;
      }
      return item;
    });
    fs.writeFileSync(`./data.json`, JSON.stringify(newData));
    return newData;
  },
  delete: (key) => {
    const select = data.select();
    const newData = select.filter((item) => {
      return item.key != key;
    });
    fs.writeFileSync(`./data.json`, JSON.stringify(newData));
    return newData;
  },
};

module.exports = data;
