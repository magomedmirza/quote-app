import { PrismaClient } from "@prisma/client";
import { hashPW } from "../config/bcrypt.js";
const prisma = new PrismaClient();

export const getAllUser = async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    if (user.length === 0) {
      return res.status(404).json({ message: "Data user kosong !" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return res.status(404).json({ message: "Data user kosong !" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};
export const createUser = async (req, res) => {
  try {
    const { nama, username, password, role } = req.body;
    const user = await prisma.user.create({
      data: { nama, username, password: hashPW(password), role },
    });
    return res
      .status(201)
      .json({ message: "Data user berhasil ditambah", user });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json({ message: "Username sudah terdaftar" });
    }
    res.status(500).json({ error: error.code, message: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama, username, password, role } = req.body;

    const updateData = { nama, username, role };

    if (password && password.trim() !== "") {
      updateData.password = hashPW(password);
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    return res
      .status(201)
      .json({ message: "Data user berhasil diupdate", user });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username sudah terdaftar" });
    }
    return res.status(500).json({ error: error.code, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.delete({
      where: { id: id },
    });
    return res
      .status(201)
      .json({ message: "Data user berhasil dihapus", user });
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};
