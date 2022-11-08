const { Contact } = require("../../models/contacts");

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId, "-createdAt -updatedAt");
  res.json(result);
};

module.exports = getById;
