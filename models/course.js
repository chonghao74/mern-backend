const mongoose = require('mongoose');
const { Schema } = mongoose;
// const Schema = mongoose.Schema;
const path = require('path');
const dotenv = require('dotenv');

//ENV

//設置 Schema object
const courseSchema = new Schema({
  id: {
    type: String
  },
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  students: {
    type: [String],
    default: []
  }
});


module.exports = mongoose.model("Course", courseSchema);