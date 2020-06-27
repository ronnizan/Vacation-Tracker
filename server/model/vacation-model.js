const Joi = require("joi");

class Vacation {
  constructor(
    vacationId,
    description,
    destination,
    imageFileName,
    startVacationDate,
    endVacationDate,
    price
  ) {
    if (vacationId !== undefined) this.vacationId = vacationId;
    if (description !== undefined) this.description = description;
    if (destination !== undefined) this.destination = destination;
    if (imageFileName !== undefined) this.imageFileName = imageFileName;
    if (startVacationDate !== undefined)
      this.startVacationDate = startVacationDate;
    if (endVacationDate !== undefined) this.endVacationDate = endVacationDate;
    if (price !== undefined) this.price = price;
  }

  validatePost() {
    const schema = {
      vacationId: Joi.optional(),
      description: Joi.string().required().min(0).max(1000),
      destination: Joi.string().required().min(0).max(500),
      imageFileName: Joi.string().required().min(0).max(200),
      startVacationDate: Joi.date().required(),
      endVacationDate: Joi.date().required(),
      price: Joi.number().required(),
    };
    const result = Joi.validate(this, schema, { abortEarly: false }); // { abortEarly: false } = Return all errors
    return result.error ? result.error.details.map((err) => err.message) : null; // null = no errors
    // return res.status(400).json({ errors: errors.array() });
  }

  validatePatch() {
    const schema = {
      vacationId: Joi.number().required().min(0),
      description: Joi.string().min(0).max(1000),
      destination: Joi.string().min(0).max(500),
      imageFileName: Joi.string().min(0).max(200),
      startVacationDate: Joi.date(),
      endVacationDate: Joi.date(),
      price: Joi.number()
    };
    const result = Joi.validate(this, schema, { abortEarly: false });
    return result.error ? result.error.details.map((err) => err.message) : null;
  }
}

module.exports = Vacation;