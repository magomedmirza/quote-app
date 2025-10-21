import bcrypt from "bcryptjs";

export const hashPW = (password) => {
  const salt = 12;
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const verifyPw = (password, hash) => {
  const verify = bcrypt.compareSync(password, hash);
  return verify;
};
