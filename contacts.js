const fs = require("fs").promises;
const path = require("node:path");

const contactsPath = path.format({
  root: "/ignored",
  dir: "db",
  base: "contacts.json",
});

function listContacts() {
  fs.readFile(contactsPath).then((contacts) =>
    console.table(JSON.parse(contacts))
  );
}

function getContactById(contactId) {
  fs.readFile(contactsPath)
    .then((contacts) =>
      JSON.parse(contacts).find((contact) => contact.id === contactId)
    )
    .then((contact) => console.table(contact));
}

async function removeContact(contactId) {
  let data = "";
  await fs
    .readFile(contactsPath)
    .then((contacts) => JSON.parse(contacts))
    .then((contacts) => contacts.filter((contact) => contact.id !== contactId))
    .then((contacts) => (data = JSON.stringify(contacts)));
  await fs.writeFile(contactsPath, data);
  listContacts();
}

async function addContact(name, email, phone) {
  let data = "";
  let id;
  await fs
    .readFile(contactsPath)
    .then((contacts) => JSON.parse(contacts))
    .then((contacts) => {
      id = contacts.reduce((max, contact) => {
        if (Number(contact.id) >= max) {
          return Number(contact.id) + 1;
        }
        return max;
      }, 1);
      newContacts = [...contacts, { id: id.toString(), name, email, phone }];
      return newContacts;
    })
    .then((contacts) => (data = JSON.stringify(contacts)));
  await fs.writeFile(contactsPath, data);
  listContacts();
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
