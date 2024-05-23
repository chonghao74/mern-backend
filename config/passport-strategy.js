const passport = require('passport');
const bcrypt = require('bcrypt');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const jwtStrattegy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/user");




//env
require('dotenv').config({ path: `${path.resolve(__dirname, '../')}/env/.env.local` });
const JWT_SECRET = process.env.JWT_SECRET;

//strategy
const opts = {
  // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Jwt'),
  // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  secretOrKey: `${JWT_SECRET}`
};

passport.use('jwt', new jwtStrattegy(opts, async function (jwt_payload, done) {
  try {
    const dbSearchResult = await User.findOne({ _id: jwt_payload._id }).exec();
    if (dbSearchResult) {
      // console.log(`jwtStrattegy -> ${dbSearchResult}`);
      done(null, dbSearchResult);//->req.user -> dbSearchResult
    }
    else {
      done(null, false);
    }
  }
  catch (e) {
    console.log(`jwtStrattegy e -> ${e}`);
    done(e, false);
  }

}))