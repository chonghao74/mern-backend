const express = require("express");
const router = express.Router();
const validation = require("../utility/validation");
const Course = require("../models/course");
const passport = require("passport");

router.use((req, res, next) => {
  // console.log(req.user);
  console.log("middleware for courses api routes");
  next();
});

//取得所有課程資本資訊
router.get("/search", async (req, res) => {
  try {
    const dbSearchResult = await Course.find({});
    return res.json({
      code: 200,
      data: {
        result: "課程搜尋結果成功",
        message: dbSearchResult,
      },
    });
  } catch (e) {
    return res.json({
      code: 503,
      data: {
        result: "DB Course 查詢失敗",
        Message: e,
      },
    });
  }
});

//新增課程 (only Insductor)
router.post("/create", async (req, res) => {
  try {
    const userData = req.user;
    if (userData) {
      if (!userData.isInstructor()) {
        return res.json({
          code: 422,
          result: `No Instructor ....，只有講師才能新增課程。`,
        });
      }

      const valiResult = validation.courseValidation(req.body).error;
      if (valiResult) {
        const dataError = valiResult.details[0].path;

        return res.json({
          code: 423,
          data: {
            result: "輸入參數錯誤",
            Message: `${dataError} 資料不符規範`,
          },
        });
      }

      try {
        const { title, description, price } = req.body;
        const newCourse = new Course({
          title,
          description,
          price,
          instructor: req.user._id,
        });
        const dbCreateResult = await newCourse.save();
        if (dbCreateResult) {
          return res.json({
            code: 200,
            data: {
              result: "課程新增成功",
              message: dbCreateResult,
            },
          });
        }
      } catch (e) {
        return res.json({
          code: 502,
          data: {
            result: "DB Course 新增失敗",
            Message: e,
          },
        });
      }
    } else {
      return res.json({
        code: 421,
        result: `無資料請重新登入`,
      });
    }
  } catch (e) {
    return res.json({
      code: 420,
      data: {
        result: "伺服器程式異常....",
        Message: `${e}`,
      },
    });
  }
});

//更新課程內容 (only Insductor)
router.patch("/update", async (req, res) => {
  try {
    const userData = req.user;
    if (userData) {
      if (!userData.isInstructor()) {
        return res.json({
          code: 432,
          result: `No Instructor ....，只有講師才能修改課程。`,
        });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
      };

      const valiResult = validation.courseValidation(updateData).error;
      if (valiResult) {
        const dataError = valiResult.details[0].path;

        return res.json({
          code: 433,
          data: {
            result: "輸入參數錯誤",
            Message: `${dataError} 資料不符規範`,
          },
        });
      }

      const dbSearchResult = await Course.findOne({ _id: req.body._id });
      if (!dbSearchResult) {
        return res.json({
          code: 434,
          data: {
            result: "無資料",
            Message: `此課程不存在`,
          },
        });
      }

      const { _id, title, description, price } = req.body;
      //const dbUpdateResult = await Course.updateOne({ _id: _id },
      const dbUpdateResult = await Course.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            title: title,
            description: description,
            price: price,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (dbUpdateResult) {
        return res.json({
          code: 200,
          data: {
            result: "課程更新成功",
            Message: `${dbUpdateResult}`,
          },
        });
      } else {
        return res.json({
          code: 435,
          data: {
            result: "無資料",
            Message: `此課程不存在`,
          },
        });
      }
    } else {
      return res.json({
        code: 431,
        result: `無資料請重新登入`,
      });
    }
  } catch (e) {
    return res.json({
      code: 430,
      data: {
        result: "伺服器程式異常....",
        Message: `${e}`,
      },
    });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const userData = req.user;
    if (userData) {
      if (!userData.isInstructor()) {
        return res.json({
          code: 442,
          result: `No Instructor ....，只有講師才能修改課程。`,
        });
      }

      const dbSearchResult = await Course.findOne({ _id: req.body._id });
      if (!dbSearchResult) {
        return res.json({
          code: 443,
          data: {
            result: "無資料",
            Message: `此課程不存在`,
          },
        });
      }

      const dbDeleteResult = await Course.deleteOne({
        _id: req.body._id,
      }).exec();
      if (dbDeleteResult) {
        return res.json({
          code: 200,
          data: {
            result: "課程刪除成功",
            Message: `${dbDeleteResult}`,
          },
        });
      } else {
        return res.json({
          code: 435,
          data: {
            result: "無資料",
            Message: `此課程不存在`,
          },
        });
      }
    } else {
      return res.json({
        code: 441,
        result: `無資料請重新登入`,
      });
    }
  } catch (e) {
    return res.json({
      code: 440,
      data: {
        result: "伺服器程式異常....",
        Message: `${e}`,
      },
    });
  }
});

module.exports = router;
