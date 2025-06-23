const fs = require("fs");
const path = require("path");

function cosineDistance(v1, v2) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < v1.length; i++) {
    dot += v1[i] * v2[i];
    normA += v1[i] * v1[i];
    normB += v2[i] * v2[i];
  }
  return 1 - (dot / (Math.sqrt(normA) * Math.sqrt(normB)));
}

exports.handler = async (event) => {
  const { email, descriptor } = JSON.parse(event.body);
  const filePath = path.resolve(__dirname, "../../users.json");

  if (!fs.existsSync(filePath)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Data tidak ditemukan" })
    };
  }

  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const user = users.find(u => u.email === email);

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Email tidak ditemukan" })
    };
  }

  const distance = cosineDistance(descriptor, user.descriptor);
  const match = distance < 0.5;

  return {
    statusCode: match ? 200 : 403,
    body: JSON.stringify({
      message: match ? "Login berhasil!" : "Wajah tidak cocok!"
    })
  };
};
