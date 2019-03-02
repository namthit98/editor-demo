var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var Post = require("./models/post");

mongoose.connect("mongodb://localhost:27017/editor-demo", {
  useNewUrlParser: true
});

var storage = multer.diskStorage({
  destination: "public/upload/",
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);
      cb(
        null,
        Math.floor(Math.random() * 9000000000) +
          1000000000 +
          path.extname(file.originalname)
      );
    });
  }
});
var upload = multer({ storage: storage });

var app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/posts", async function(req, res) {
  const posts = await Post.find();
  res.render("posts", { posts });
});

app.get("/posts/:id", async function(req, res) {
  const id = req.params.id;
  const post = await Post.findById(id);

  res.render("detail", { post });
});

app.post("/posts", async function(req, res) {
  const { title, description, editor1 } = req.body;

  const post = new Post({
    title,
    description,
    content: editor1
  });

  await post.save();
  res.redirect("/posts");
});

app.get("/files", function(req, res) {
  const images = fs.readdirSync("public/upload");
  var sorted = [];
  for (let item of images) {
    if (
      item.split(".").pop() === "png" ||
      item.split(".").pop() === "jpg" ||
      item.split(".").pop() === "jpeg" ||
      item.split(".").pop() === "svg"
    ) {
      var abc = {
        image: "/upload/" + item,
        folder: "/"
      };
      sorted.push(abc);
    }
  }
  res.send(sorted);
});

app.post("/upload", upload.array("flFileUpload", 12), function(req, res, next) {
  res.redirect("back");
});

app.post("/delete_file", function(req, res, next) {
  var url_del = "public" + req.body.url_del;
  console.log(url_del);
  if (fs.existsSync(url_del)) {
    fs.unlinkSync(url_del);
  }
  res.redirect("back");
});

app.listen(8080);
