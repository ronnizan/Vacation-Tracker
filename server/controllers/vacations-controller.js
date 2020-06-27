const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const vacationLogic = require("../business-logic/vacations-logic");
const userLogic = require("../business-logic/auth-logic");
const Vacation = require("../model/vacation-model");

const router = express.Router();

// get All Vacations

router.get("/", authMiddleware, async (req, res) => {
  try {
    const vacations = await vacationLogic.getAllVacations();

    if (!vacations) {
      return res.status(400).json({ msg: "there is no vacations!" });
    }

    res.json(vacations);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

// get All Followed Vacations For LoggedUser,
router.get("/my-vacations", authMiddleware, async (req, res) => {
  try {
    const vacations = await vacationLogic.getAllFollowedVacationsForLoggedUser(
      req.user.userId
    );

    if (!vacations) {
      return res.status(400).json({ msg: "there is no vacations!" });
    }

    res.json(vacations);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});
// add Vacation
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.isAdmin === 0) {
      return res.status(403).send("Authorization error");
    }

    const vacation = new Vacation(
      undefined,
      req.body.description,
      req.body.destination,
      req.body.imageFileName,
      req.body.startVacationDate,
      req.body.endVacationDate,
      req.body.price
    );
    const errors = vacation.validatePost();
    if (errors) {
      return res.status(400).json({ errors: errors });
    }

    const addedVacation = await vacationLogic.addVacation(vacation);

    if (!addedVacation) {
      return res.status(400).json({ msg: "failed to add vacation!" });
    }
    res.json(addedVacation);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

// updateVacation,
router.patch("/update", authMiddleware, async (req, res) => {
  try {
    if (req.user.isAdmin === 0) {
      return res.status(403).send("Authorization error");
    }

    const vacation = new Vacation(
      req.body.vacationId,
      req.body.description,
      req.body.destination,
      req.body.imageFileName,
      req.body.startVacationDate,
      req.body.endVacationDate,
      req.body.price
    );
    const errors = vacation.validatePatch();
    if (errors) {
      return res.status(400).json({ errors: errors });
    }

    const updatedVacation = await vacationLogic.updateVacation(vacation);
    if (!updatedVacation) {
      return res.status(400).json({ msg: "failed to update vacation!" });
    }
    res.json(updatedVacation);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

// delete Vacation

router.delete("/delete/:vacationId", authMiddleware, async (req, res) => {
  try {
    if (req.user.isAdmin === 0) {
      return res.status(403).send("Authorization error");
    }
    const vacationId = +req.params.vacationId;
    await vacationLogic.deleteVacation(vacationId);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get Followers Amount For All Vacations

router.get("/all-vacations-followers", authMiddleware, async (req, res) => {
  try {
    const followedVacationsIdAndNumOfFollowers = await vacationLogic.getFollowersAmountForAllVacations();
    res.json(followedVacationsIdAndNumOfFollowers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get Followers Amount For Specific Vacation
router.get("/specific-vacation-followers", authMiddleware, async (req, res) => {
  try {
    if (!req.body.vacationId) {
      return res.status(400).send("vacationId needed");
    }
    const vacationId = +req.body.vacationId;
    const followedVacationIdAndNumOfFollowers = await vacationLogic.getFollowersAmountForSpecificVacation(
      vacationId
    );
    res.json(followedVacationIdAndNumOfFollowers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// add Follower To a Vacation,
router.post("/add-vacation-follower", authMiddleware, async (req, res) => {
  try {
    if (!req.body.vacationId) {
      return res.status(400).send("vacationId needed");
    }
    const vacationId = +req.body.vacationId;
    const userId = req.user.userId;
    const responseFromDB = await vacationLogic.addFollowerToVacation(
      vacationId,
      userId
    );
    if (!responseFromDB) {
      return res.status(400).json({ msg: "following vacation failed" });
    }
    if (responseFromDB.msg) {
      return res.status(400).json({ msg: responseFromDB.msg });
    }

    res.status(201).json({ msg: "added to the followed vacations!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// remove Follower To a Vacation,
router.delete("/remove-vacation-follower", authMiddleware, async (req, res) => {
  try {
    if (!req.body.vacationId) {
      return res.status(400).send("vacationId needed");
    }
    const vacationId = +req.body.vacationId;
    const userId = req.user.userId;
    const responseFromDB = await vacationLogic.removeFollowerToVacation(
      vacationId,
      userId
    );
    if (!responseFromDB) {
      return res
        .status(400)
        .json({ msg: "removing following vacation failed" });
    }
    if (responseFromDB.msg) {
      return res.status(400).json({ msg: responseFromDB.msg });
    }

    res.status(201).json({ msg: "removed from the followed vacations!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// const fs = require("fs");
// const fileUpload = require("express-fileupload");
// const uuid = require("uuid");
// // server.use(express.static(__dirname)); // "/" ==> "index.html"

// router.post("/upload-image", (req, response) => {
//   if (!fs.existsSync("./uploads")) {
//     fs.mkdirSync("./uploads");
//   }

//   if (!req.files) {
//     response.status(400).send("No file sent");
//     return;
//   }

//   const image = req.files.userImage;
//   const extension = image.name.substr(image.name.lastIndexOf(".")); // e.g: ".jpg"

//   if (extension != ".jpg" && extension != ".png") {
//     response.status(400).send("Illegal file sent");
//     return;
//   }

//   const newFileName = uuid.v4() + extension;
//   image.mv("./uploads/" + newFileName);

//   response.end();

  //   <form action="/upload-image" method="post" enctype="multipart/form-data">

  //   <input type="file" name="userImage"> <!-- Any File-->
  //   <input type="file" name="userImage" accept="image/*"> <!-- Image Files -->
  //   <input type="file" name="userImage" accept=".jpg,.png,.gif"> <!-- Specific Image Files-->
  //   <input type="file" name="userImage" accept=".jpg"> <!-- One specific file -->

  //   <button>Upload</button>

  // </form>
// });

module.exports = router;
