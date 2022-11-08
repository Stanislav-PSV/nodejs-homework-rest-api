const { Contact } = require("../../models/contacts");

const { createError } = require("../../helpers");

const removeById = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw createError(404, "Not found");
  }

  res.json({ result, message: "contact deleted" });
};

module.exports = removeById;
