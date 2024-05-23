const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');

//ENV
dotenv.config({ path: `${path.resolve(__dirname, '../')}/env/.env.local` });
const SALT = process.env.SALT;
//設置 Schema object
const userSchema = new Schema({
  email: {
    type: String,
    minlength: 10,
    maxlength: 50,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  name: {
    type: String,
    minLength: 3,
    maxLength: 100,
    require: true
  },
  role: {
    type: String,
    require: true,
    enum: ["student", "instructor"]
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

//設置 Schema 物件 內部 function 
userSchema.methods.isStutent = function () {
  return this.role === "student";
};

userSchema.methods.isInstructor = function () {
  // console.log(`this.role === "instructor" ->${this.role === "instructor"} `);
  return this.role === "instructor";
};

userSchema.methods.comparePassword = async function (password, callback) {
  let result
  try {
    result = await bcrypt.compare(password, this.password);
    return callback(null, result);
  }
  catch (e) {
    return callback(e, result);
  }




};

//設置 Schema 物件 Middleware
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    console.log(`SALT ${SALT}`);
    const hashValue = await bcrypt.hash(this.password, Number(SALT));
    console.log(`hashValue ${hashValue}`);
    this.password = hashValue;
  }

  next();

});

module.exports = mongoose.model("User", userSchema);
