const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const ioCreator = require("socket.io");
const http = require("http");

const fileExtensions = {
  "image/jpeg": ".jpg",
};

console.log(path.join(__dirname, "static"));

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "static"));
  },
  filename: (req, file, cb) => {
    console.log(file);
    const fileName =
      file.fieldname + "-" + Date.now() + fileExtensions[file.mimetype];
    req.saveFile = fileName;
    cb(null, fileName);
  },
});
const upload = multer({ storage: diskStorage });

mongoose.connect(
  "mongodb://localhost:27017/the_social",
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) {
      console.log("DB Connected!");
    }
  }
);

const router = require("./api");

const app = express();
const server = http.createServer(app);
const io = ioCreator(server, {
  cors: {
    origin: "http://localhost:3000/message",
    methods: ["GET", "POST" , "PUT"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});



let onLineUsers = {};

io.on("connection", (socket) => {
  console.log("new client connected!");

  socket.emit("onLineCount", Object.keys(onLineUsers).length);
  socket.on("setOnline", (data) => {
    onLineUsers[socket.id] = data;
  });
  socket.on("disconnect", () => {
    delete onLineUsers[socket.id];
  });
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(router);
app.post("/upload", upload.single("photo"), (req, res) => {
  res.json({ fileName: req.saveFile });
});

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/onlineUsers", (req, res) => {
  res.json(onLineUsers);
});

server.listen(5000, () => {
  console.log("Server is running");
});
