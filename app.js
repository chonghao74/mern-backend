const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const User = require("./models/user");
const Course = require("./models/course");
const passport = require("passport");
const cors = require("cors");
//觸發 strategy
require("./config/passport-strategy");
const userRoutes = require("./routes/user-routes");
const courseRoutes = require("./routes/course-routes");

//ENV
dotenv.config({ path: `${__dirname}/env/.env.local` });
const PORT = process.env.PORT;
const MongoDBPath = process.env.MONGO_DB_Path;

//Link DB
//Mongo
mongoose
  .connect(MongoDBPath)
  .then(() => {
    console.log("MongoDB Linking ....");
  })
  .catch(() => {
    console.log("MongoDB Linked Error ....");
  });

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//如果此 Route 都需要驗證 token，故把 middleware 寫在此
app.use("/api/user", userRoutes);
const authenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // console.log(`err -> ${err}`);
    // console.log(`user-> ${user}`);
    // console.log(`info-> ${info}`);
    if (err) {
      return res.json({
        code: 411,
        result: "Token 錯誤或失效",
        errorMessage: `${err}`,
      });
    }

    if (user) {
      req.user = user;
      return next();
    }

    return res.json({
      code: 412,
      data: {
        result: "Token 錯誤或失效",
        errorMessage: `${info}`,
      },
    });
  })(req, res, next);
};
app.use("/api/course", authenticated, courseRoutes);

app.listen(PORT, () => {
  console.log(`mern api port ${PORT} is starting...`);
});
