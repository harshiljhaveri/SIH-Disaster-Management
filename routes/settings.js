var express = require("express");
var router = express.Router();
var path = require("path");
var guid = require("guid");
var mv = require("mv");
const mime = require("mime-types");
var db = require("../utils/handlers/user");
var formParser = require("../utils/form-parser.js");
var Event = require("../utils/models/event");
var User = require("../utils/models/user");
const fs = require("file-system");
var fileExtension = require("file-extension");
var Room = require("../utils/models/room");
const publicVapidKey =
  "BNiHEzAK5WrlrZaEK6MALkP-BHbssFiWYgCDhCn1VLa-yMMjcYoXartpvee-6DHicCPD_52dVm0F4yFD-J5u-8c";
const privateVapidKey = "_RiGVTDKk1wTbMMOLYrc-Rvdl3g8vLsPpFKld0xpXeo";

var image_types = ["png", "jpeg", "gif"];

/* GET users listing. */
router.get("/", function(req, res, next) {
  db.findOne({ _id: req.session._id }, (err, user) => {
    res.render("me/index", {
      title: req.app.conf.name,
      user: user
    });
  });
});

router.get("/settings", function(req, res, next) {
  db.findOne({ _id: req.session._id }, (err, user) => {
    res.render("me/settings", {
      title: req.app.conf.name,
      user: user
    });
  });
});

router.get("/notifications", function(req, res, next) {
  db.findOne({ _id: req.session._id }, (err, user) => {
    res.render("me/notifications", {
      title: req.app.conf.name,
      activity: user.notifications
    });
  });
});

router.get("/post/:action/:query", function(req, res, next) {
  switch (req.params.action) {
    case "edit":
      res.render("index");
      break;
    case "delete":
      {
        db.findOne({ username: req.session.user }, (err, u) => {
          let id = req.params.query;
          // if (
          //   u.posts[u.posts.indexOf(u.posts.find(x => x._id == id))].static_url
          // )
          //   fs.unlinkSync(
          //     "./public" +
          //       u.posts[u.posts.indexOf(u.posts.find(x => x._id == id))]
          //         .static_url
          //   );
          // u.posts.splice(u.posts.indexOf(u.posts.find(x => x._id == id)), 1);
          // u.save(err => {
          //   if (err) throw err;
          //   console.log("Post deleted");
          //   res.redirect("/");
          // });
          Event.find({ id }).exec(function(err, deleted_event) {
            if(deleted_event.media)
              fs.unlinkSync("./public" + deleted_event.media.dest);
            Event.deleteOne({ id }).exec(function(error, result) {
              u.posts.splice(u.posts.indexOf(id));
              if(event.room) {
                User.update({ chat_rooms: {$elemMatch : id}}, { $pull: { chat_rooms: {$elemMatch : id}} }, { multi: true });
                Room.deleteOne({ id }).exec(function(error, result) {
                  u.save(err => {
                      if (err) throw err;
                      console.log("Post deleted");
                      res.redirect("/");
                    });
                })
              } else {
                u.save(err => {
                  if (err) throw err;
                  console.log("Post deleted");
                  res.redirect("/");
                });
              }
            })
          })
        });
      }
      break;
    default:
      res.send("hi");
  }
});

router.get("/upload", function(req, res, next) {
  res.render("upload/file-upload", {
    title: req.app.conf.name,
    user: req.session.user
  });
});

router.post("/upload", formParser, function(req, res, next) {
  var random_id = guid.raw();
  var final_location = null;
  var media = null;

  if (req.files.filetoupload.name) {
    var oldpath = req.files.filetoupload.path;
    var newpath = path.join(
      __dirname,
      `../public/feeds/${req.session.user}_${random_id}${req.files.filetoupload.name}`
    );
    final_location = `/feeds/${req.session.user}_${random_id}${req.files.filetoupload.name}`;

    var type = mime.lookup(req.files.filetoupload.name).split("/")[1];
    var ext = fileExtension(req.files.filetoupload.name);
    mv(oldpath, newpath, function(err) {
      console.log("moving files");
    });

    media = {
      dest: final_location,
      type: type,
      ext: ext
    };
  }

  var newEvent = new Event();
  db.findOne({ username: req.session.user }, (err, u) => {
    newEvent.id = random_id;
    newEvent.user.id = u._id;
    newEvent.user.username = u.username;
    newEvent.latitude = req.body.latitude;
    newEvent.longitude = req.body.longitude;
    newEvent.location = req.body.location;
    newEvent.radius = req.body.radius;
    newEvent.description = req.body.caption;
    newEvent.time = req.body.time || new Date().toISOString();
    newEvent.media = media;
    newEvent.comments = [];
    newEvent.likes = "0";
    newEvent.createdAt = Date.now();
    newEvent.type = req.body.type;

    if (req.body.chatroom === "true") {
      var newRoom = new Room();
      newRoom.id = random_id;
      newRoom.users = [u._id];
      newRoom.chats = [];
      newRoom.type = "event";
      newRoom.save().then(function(room) {
        newEvent.room = room.id;
        newEvent.save().then(function(event) {
          console.log(event);
          u.posts.push(event);
          u.chat_rooms.push(room.id);
          u.save().then(function(doc) {
            console.log("Post saved");
            res.redirect("/");
          });
        });
      });
    } else {
      newEvent.room = "";
      newEvent.save().then(function(event) {
        u.posts.push(event.id);
        u.save().then(function(doc) {
          console.log("Post saved");
          res.redirect("/");
        });
      });
    }
  });
});

module.exports = router;
