const {
  getUsers,
  handleLogin,
  handleRegister,
  renderHomePage,
  renderLoginPage,
  renderRegisterPage,
} = require("./controllers/authController");
const cookieParser = require("cookie-parser");
const express = require("express");
const { users, sequelize } = require("./model/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

require("./model/index");

const authRoute = require("./routes/authRoute");
const questionRoute = require("./routes/questionRoute");

const session = require("express-session");
const flash = require("connect-flash");
const catchError = require("./utils/catchError");
const { promisify } = require("util");

app.set("view engine", "ejs"); //create ejs as view engine (ui engine/ templating engine)
app.use(express.urlencoded({ extended: true })); // this code tells node js to server side rendering
app.use(express.json()); // if data come from outside like react, vue js
app.use(express.static("public/css/")); // this code give access to any other folders
app.use(express.static("./storage/"));
app.use(cookieParser()); //cookie was initially undefined so we used cookie parser
app.use(
  session({
    secret: "thisissecretforsession",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.get("/", catchError(renderHomePage));

app.use("/", authRoute);
app.use("/", questionRoute);

//get all users
app.get("/users", getUsers);

//post method is used to send data to server to create or update a resource

//login route
// app.get("/login", renderLoginPage);

// app.post("/login", handleLogin);

// console.log(app.listen(port, hostname, backlog))
app.listen(3000, () => {
  console.log("Project has started at port 3000");
});

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("like", async ({ answerId, cookie }) => {
    const answer = await answer.findByPk(answerId);
    if (answer && cookie) {
      const decryptedResult = await promisify(jwt.verify)(cookie, "password");
      if (decryptedResult) {
        await sequelize.query(
          `INSERT INTO likes_${id} (userId) VALUES (${decryptedResult.id})`,
          {
            type: QueryTypes.INSERT,
          }
        );
      }
      sequelize.query(`SELECT * FROM likes_${answerId}`, {
        type: QueryTypes.SELECT,
      });
      const likesCount = likes.length;
      if(likesCount){
      socket.emit("likeUpdate", likesCount);
      }
    }
  });
});
