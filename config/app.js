var dbHost = process.env.dbHost || "localhost";
module.exports = {
  name: "auxilium",
  title: "auxilium",
  commands: {
    package:
      "electron-packager electron.js auxilium --electronVersion=2.0.12 --overwrite --icon=/public/images/logo/logo.png --prune=true --out=release",
    build: ""
  },
  http: {
    host: "localhost",
    port: 8080
  },
  author: "AlQaholic007",
  version: "1.0.0",
  db: {
    connectionUri: "mongodb://" + dbHost + ":27017/auxilium",
    params: {},
    collections: ["moment", "user", "feeling", "ask"]
  }
};
