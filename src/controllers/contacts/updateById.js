const { Contact, editingContacts } = require("../../models/contacts");

const { createError } = require("../../helpers");

const updateById = async (req, res) => {
  const body = req.body;

  const { error } = editingContacts.validate(body);
  if (error || !Object.keys(body).length) {
    throw createError(400, "missing fields");
  }

  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!result) {
    throw createError(404, "Not found");
  }

  res.json(result);
};

module.exports = updateById;
