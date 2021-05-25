const joi = require("joi");
module.exports = {
  validRegister: (data) => {
    const schema = joi.object({
      username: joi.string().min(3).max(25).required("username is required"),
      email: joi.string().min(3).max(25).required().email(),
      password: joi.string().min(8).required(),
    });
    // return object have error if not valid schema
    return schema.validate(data);
  },
  validLogin: (data) => {
    const schema = joi.object({
      email: joi.string().min(3).max(25).required(),
      password: joi.string().min(8).required(),
    });
    // return object have error if not valid schema
    return schema.validate(data);
  },
};
