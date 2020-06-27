const dal = require("../dal/dal");
const router = require("../controllers/vacations-controller");

async function getAllVacations() {
  const sql = "SELECT * from Vacations";
  const vacations = await dal.executeAsync(sql);
  return vacations;
}
async function getAllFollowedVacationsForLoggedUser(userId) {
  const sql = ` SELECT vacations.* FROM vacations JOIN followers ON vacations.vacationId = followers.vacationId WHERE followers.userId = ${userId}`;
  const vacations = await dal.executeAsync(sql);
  return vacations;
}

//add vacation
async function addVacation(vacation) {
  const sql = `INSERT INTO vacations(description, destination, imageFileName, startVacationDate, endVacationDate, price)
    VALUES('${vacation.description}', '${vacation.destination}',
    '${vacation.imageFileName}', '${vacation.startVacationDate}', '${vacation.endVacationDate}', ${vacation.price})`;
  const info = await dal.executeAsync(sql);
  vacation.vacationId = info.insertId;
  return vacation;
}

//update

async function updateVacation(vacation) {
  let sql = "UPDATE vacations SET ";

  if (vacation.description !== undefined) {
    sql += `description = '${vacation.description}',`;
  }

  if (vacation.destination !== undefined) {
    sql += `destination = '${vacation.destination}',`;
  }

  if (vacation.imageFileName !== undefined) {
    sql += `imageFileName = '${vacation.imageFileName}',`;
  }
  if (vacation.startVacationDate !== undefined) {
    sql += `startVacationDate = '${vacation.startVacationDate}',`;
  }
  if (vacation.endVacationDate !== undefined) {
    sql += `endVacationDate = '${vacation.endVacationDate}',`;
  }
  if (vacation.price !== undefined) {
    sql += `price = ${vacation.price},`;
  }

  sql = sql.substr(0, sql.length - 1); //Remove last comma

  sql += ` WHERE vacationId= ${vacation.vacationId}`;

  const info = await dal.executeAsync(sql);

  if (info.affectedRows) {
    const updatedVacation = await dal.executeAsync(
      `SELECT * from Vacations where vacationId = ${vacation.vacationId}`
    );
    return updatedVacation;
  }
  return null; // no affected rows. no such vacation.
}

//delete
async function deleteVacation(vacationId) {
  const sqlToDeleteFromVacationsTable = `DELETE FROM vacations WHERE vacationId = ${vacationId}`;
  const sqlToDeleteFromFollowersTable = `DELETE FROM followers WHERE vacationId = ${vacationId}`;
  await dal.executeAsync(sqlToDeleteFromVacationsTable);
  await dal.executeAsync(sqlToDeleteFromFollowersTable);
}

//get followers amount for specific vacation

async function getFollowersAmountForSpecificVacation(vacationId) {
  const sql = `SELECT followers.vacationId, count(followers.vacationId) as followers FROM followers JOIN vacations ON vacations.vacationId = followers.vacationId JOIN users ON followers.userId =users.userId where vacations.vacationId = ${vacationId} GROUP BY followers.vacationId`;
  const followedVacationIdAndNumOfFollowers = await dal.executeAsync(sql);
  return followedVacationIdAndNumOfFollowers;
}

//get followers amount for all vacations

async function getFollowersAmountForAllVacations() {
  const sql = `SELECT followers.vacationId, count(followers.vacationId) as followers
  FROM  followers 
  JOIN  vacations  ON vacations.vacationId = followers.vacationId 
  JOIN  users  ON followers.userId =users.userId 
  GROUP BY followers.vacationId`;
  const followedVacationsIdAndNumOfFollowers = await dal.executeAsync(sql);
  return followedVacationsIdAndNumOfFollowers;
}

//add a follow to a vacation

async function addFollowerToVacation(vacationId, userId) {
  const sql = `SELECT vacations.vacationId FROM vacations JOIN followers ON vacations.vacationId = followers.vacationId WHERE followers.userId = ${userId} GROUP BY followers.vacationId`;
  //getting vacation ids that the specific user followed already
  const followedVacationsIds = await dal.executeAsync(sql);
  if (
    followedVacationsIds.filter(
      (vacation) => vacation.vacationId === vacationId
    ).length > 0
  ) {
    return { msg: "vacation already followed" };
  }
  const sqlAddFollow = `insert into followers values(
    default,
  ${userId},
  ${vacationId})`;
  // followedVacationsIds.unshift({ user: req.user.id });
  const response = await dal.executeAsync(sqlAddFollow);
  if (response.affectedRows > 0) {
    return true;
  }
  return false;
}
async function removeFollowerToVacation(vacationId, userId) {
  const sql = `SELECT vacations.vacationId FROM vacations JOIN followers ON vacations.vacationId = followers.vacationId WHERE followers.userId = ${userId} GROUP BY followers.vacationId`;
  //getting vacation ids that the specific user followed already
  const followedVacationsIds = await dal.executeAsync(sql);
  if (
    followedVacationsIds.filter(
      (vacation) => vacation.vacationId === vacationId
    ).length === 0
  ) {
    return { msg: "vacation not followed yet" };
  } else {
    const sqlRemoveFollow = `DELETE FROM followers
    WHERE userId = ${userId}
    AND vacationId = ${vacationId}`;
    // followedVacationsIds.unshift({ user: req.user.id });
    const response = await dal.executeAsync(sqlRemoveFollow);
    if (response.affectedRows > 0) {
      return true;
    }
  }

  return false;
}




module.exports = {
  getAllVacations,
  getAllFollowedVacationsForLoggedUser,
  addVacation,
  updateVacation,
  deleteVacation,
  getFollowersAmountForAllVacations,
  getFollowersAmountForSpecificVacation,
  addFollowerToVacation,
  removeFollowerToVacation,
};
