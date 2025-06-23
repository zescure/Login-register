const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const { email, descriptor } = JSON.parse(event.body);
  const filePath = path.resolve(__dirname, "../../users.json");

  let users = [];
  if (fs.existsSync(filePath)) {
    users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  if (users.find(u => u.email === email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email sudah terdaftar" })
    };
  }

  users.push({ email, descriptor });
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Berhasil daftar" })
  };
};
