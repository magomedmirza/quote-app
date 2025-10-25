const bcrypt = require("bcrypt"); // ✅ GUNAKAN bcrypt

const hashPW = async (password) => {
  const saltRounds = 12; // ✅ Ganti 'salt' menjadi 'saltRounds'
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const verifyPw = async (password, hash) => {
  const verify = await bcrypt.compare(password, hash);
  return verify;
};

module.exports = { hashPW, verifyPw };