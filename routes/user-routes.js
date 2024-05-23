const express = require('express');
const router = express.Router();
const validation = require('../utility/validation');
const User = require('../models/user');
const dayjs = require('dayjs');
dayjs().format();
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  console.log("middleware for users api routes");
  next();
});

router.get("/test-query", (req, res) => {
  let { id, data, testAutoID } = req.query;
  const returnData = {
    id: id,
    data: data,
    testAutoID: testAutoID
  }

  return res.json(returnData);
})

router.get("/test-params/:id", (req, res) => {
  let { id } = req.params;
  const returnData = {
    id: id
  }

  return res.json(returnData);
})

router.route("/testSameRotes")
  .get((req, res) => {
    const { name, password } = req.query
    return res.json({ name: name, password: password });
  })
  .post((req, res) => {
    const { name, password } = req.body
    return res.json({ name: name, password: password });
  })

router.post("/signup", async (req, res) => {
  // console.log(validation.registerValidation(req.body));
  //驗證數據是否正確
  const valiResult = validation.registerValidation(req.body).error;
  if (valiResult) {
    // const dataError = valiResult.details[0].message.includes('\"email\"');
    const dataError = valiResult.details[0].path;

    return res.json({
      code: 401,
      data: {
        result: "輸入參數錯誤",
        Message: `${dataError} 資料不符規範`
      }
    });
  }

  //驗證 email 是否存在
  const dbSearchResult = await User.findOne({ email: req.body.email });
  console.log(`signup - dbSearchResult ${dbSearchResult}`);
  if (dbSearchResult) {
    return res.json({
      code: 402,
      data: {
        result: "輸入參數錯誤",
        Message: `email 資料重複`
      }
    });
  }

  //create new member
  const { email, password, name, role } = req.body;
  const newUser = new User({ email, password, name, role });

  try {
    const dbCreateResult = await newUser.save();
    // console.log(`signup - dbCreateResult ${dbCreateResult}`);
    if (dbCreateResult) {
      return res.json({
        code: 200,
        data: {
          result: "註冊成功",
          message: dbCreateResult,
        }
      });
    }
  }
  catch (e) {
    return res.json({
      code: 501,
      data: {
        result: "DB Signup 新增失敗",
        Message: e
      }
    });
  }
})

router.post("/login", async (req, res) => {
  const valiResult = validation.loginValidation(req.body).error;
  if (valiResult) {
    // const dataError = valiResult.details[0].message.includes('\"email\"');
    const dataError = valiResult.details[0].path;

    return res.json({
      code: 411,
      data: {
        result: "輸入參數錯誤",
        Message: `${dataError} 資料不符規範`
      }
    });
  }

  //驗證 email 是否存在
  const dbSearchResult = await User.findOne({ email: req.body.email });
  // console.log(`login - dbSearchResult ${dbSearchResult}`);
  if (!dbSearchResult) {
    return res.json({
      code: 412,
      data: {
        result: "輸入參數錯誤",
        Message: `email 尚未註冊`
      }
    });
  }

  dbSearchResult.comparePassword(req.body.password, (error, isMatch) => {
    if (error) {
      return res.json({
        code: 413,
        data: {
          result: "bycript 錯誤",
          Message: `${error}`
        }
      });
    }

    if (!isMatch) {
      return res.json({
        code: 414,
        data: {
          result: "輸入參數錯誤",
          Message: `password 錯誤`
        }
      });
    }

    //製作 JWT
    //(HMAC+SHA256)
    try {
      const tokenObject = { _id: dbSearchResult._id, email: dbSearchResult.email };
      const tokenSecreatKey = process.env.JWT_SECRET;
      const token = jwt.sign(tokenObject, tokenSecreatKey);
      //RSA+SHA256
      // const privateKey = fs.readFileSync('private.key');
      // const token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
      return res.json({
        code: 200,
        data: {
          result: "登入成功",
          token: token,
          user: dbSearchResult
        }
      });
    }
    catch (e) {
      return res.json({
        code: 415,
        data: {
          result: "Token 產生失敗",
          Message: `${e}`
        }
      });
    }
  })
});

// router.post("/logout", (req, res) => {
//   req.logOut((err) => {
//     if (err) {
//       console.log(err);
//       return res.json({
//         code: 999,
//         result: `Logout Fail`,
//         errorMessage: err
//       });
//     }

//     return res.json({
//       code: 200,
//       result: `Logout Success`
//     });
//   });
// })



module.exports = router;