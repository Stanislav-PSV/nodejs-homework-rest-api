const getAll = require("./getAll");
const getById = require("./getById");
const add = require("./add");
const removeById = require("./removeById");
const updateById = require("./updateById");
const updateStatusContact = require("./updateStatusContact");

module.exports = {
  updateStatusContact,
  updateById,
  removeById,
  add,
  getAll,
  getById,
};
