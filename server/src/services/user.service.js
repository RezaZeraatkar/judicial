const pool = require("./database/db");
const hashPassword = require("../utils/hashPassword");
const comparePasswords = require("../utils/comparePasswords");
require("dotenv").config();

// Create User
const createUser = async (user) => {
  // save user to DB
  const { name, username, password } = user;
  const hashedPassword = await hashPassword(password);
  const query =
    "INSERT INTO judicial_users (name, username, password, is_admin) VALUES (?, ?, ?, 0)";
  const values = [name, username, hashedPassword];
  return await pool.query(query, values);
};

// update User
const updateUserByUsername = async (
  username,
  { name, new_username, new_password },
) => {
  // Execute the update query
  const query =
    "UPDATE judicial_users SET name = ?, username = ?, password = ? WHERE username = ?";
  const hashedNewPassword = await hashPassword(new_password);
  const values = [name, new_username, hashedNewPassword, username];
  return await pool.query(query, values);
};

// Find User by Id
const findUserById = async (id) => {
  const user = await pool.execute(
    `SELECT id, name, username, is_admin FROM judicial_users WHERE id = "${id}"`,
  );
  return user;
};

// Find User by username
const findUserByUsername = async (username) => {
  const user = await pool.execute(
    `SELECT id, name, username, password, is_admin FROM judicial_users WHERE username = "${username}"`,
  );
  return user;
};

// Find All users
const findAllUsers = async () => {
  return await pool.execute(
    `SELECT id, name, username, is_admin FROM judicial_users`,
  );
};

module.exports = {
  createUser,
  findUserById,
  findAllUsers,
  findUserByUsername,
  updateUserByUsername,
};
