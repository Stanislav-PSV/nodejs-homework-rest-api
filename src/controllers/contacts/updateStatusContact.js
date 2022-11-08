const { Contact, favoriteSchema } = require("../../models/contacts");

const { createError } = require("../../helpers");

const updateStatusContact = async (req, res) => {
  const body = req.body;

  const { error } = favoriteSchema.validate(body);

  if (error) {
    throw createError(400, "missing field favorite");
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

module.exports = updateStatusContact;
