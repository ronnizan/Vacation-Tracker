const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const authMiddleware = require("../middleware/auth-middleware");
const vacationLogic = require("../business-logic/vacations-logic");
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
      const imageFile = req.files.image;
      const receivedVacation = JSON.parse(req.body.vacation);
      const randomName = uuid.v4();
      const extension = imageFile.name.substr(imageFile.name.lastIndexOf('.'));
      if (extension != ".jpg" && extension != ".png" && extension != ".gif" && extension != ".jpeg") {
        return res.status(400).json({
          errors: 'Cant accept this type of file...,can only accept png,gif,jpg and jpeg!'
       });
      }
      // imageFile.mv('../client/src/assets/images/' + randomName + extension);
      imageFile.mv('../client/public/assets/images/' + randomName + extension);
      receivedVacation.imageFileName = randomName + extension;

      const vacation = new Vacation(
      undefined,
      receivedVacation.description,
      receivedVacation.destination,
      receivedVacation.imageFileName,
      receivedVacation.startVacationDate,
      receivedVacation.endVacationDate,
      receivedVacation.price
    );
     const errors = vacation.validatePost();
     if (errors) {
      return res.status(400).json({ errors: errors });
     }

    const addedVacation = await vacationLogic.addVacation(vacation);

    if (!addedVacation) {
      return res.status(400).json({ msg: "failed to add vacation!" });
    }
    res.status(201).json({ msg: "succuss to add vacation!" });
  } catch (error) {
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
    if (!req.params.vacationId) {
      return res.status(400).send("vacationId needed");
    }

    const vacationId = +req.params.vacationId;
    const vacationImageName = await vacationLogic.getVacationImageName(vacationId);
    if (!vacationImageName) {
      return res.json({msg:"failed to delete image"})
    }
    const isVacationDeleted =  await vacationLogic.deleteVacation(vacationId);

    if (!isVacationDeleted) {
      return res.json({msg:"failed to delete vacation"})
    }

    
    fs.unlink("../client/public/assets/images/"+ vacationImageName, (err)=>{
      if (err) {
        return res.json({msg:"failed to delete image"})
      }else{
        res.sendStatus(204);
      } 
    })    
   
  } catch (err) {
    console.log (err)
    res.status(500).send(err.message);
  }
});

// get Followers Amount For All Vacations

router.get("/all-vacations-followers", authMiddleware, async (req, res) => {
  try {
    const followedVacationsIdAndNumOfFollowers = await vacationLogic.getFollowersAmountForAllVacations();
    if (!followedVacationsIdAndNumOfFollowers) {
      return res.json({msg:"failed to get vacations"})
    }
    res.json(followedVacationsIdAndNumOfFollowers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get Followers Amount For Specific Vacation
router.get("/specific-vacation-followers/:vacationId", authMiddleware, async (req, res) => {
  try {
    if (!req.params.vacationId) {
      return res.status(400).send("vacationId needed");
    }
    const vacationId = +req.params.vacationId;
    const followedVacationIdAndNumOfFollowers = await vacationLogic.getFollowersAmountForSpecificVacation(
      vacationId
    );
    if (!followedVacationIdAndNumOfFollowers) {
      return res.json({msg:"failed to get vacation"})
    }
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
router.delete("/remove-vacation-follower/:vacationId", authMiddleware, async (req, res) => {
  try {
    if (!req.params.vacationId) {
      return res.status(400).send("vacationId needed");
    }
    const vacationId = +req.params.vacationId;
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

module.exports = router;
