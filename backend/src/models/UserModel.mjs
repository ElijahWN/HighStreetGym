import DatabaseModel from "./DatabaseModel.mjs";
import { parseId, toTrimmed } from "../controllers/ControllerUtils.mjs";

/**
 * Enum for user roles.
 * @readonly
 * @enum {string}
 */
export const UserRole = Object.freeze({
  MEMBER: "member",
  TRAINER: "trainer",
  ADMIN: "admin",
});

/**
 * Represents a user account.
 */
export default class UserModel extends DatabaseModel {
  /**
   * @param {number} id
   * @param {string} role
   * @param {string} username
   * @param {string} firstName
   * @param {string} lastName
   * @param {Date} birthday
   * @param {string} email
   * @param {string} password
   */
  constructor(
    id,
    role,
    username,
    firstName,
    lastName,
    birthday,
    email,
    password
  ) {
    super();
    this.id = parseId(id);
    this.role = toTrimmed(role).toLowerCase();
    this.username = toTrimmed(username);
    this.firstName = toTrimmed(firstName);
    this.lastName = toTrimmed(lastName);
    this.birthday = new Date(birthday);
    this.email = toTrimmed(email).toLowerCase();
    this.password = toTrimmed(password);
  }

  /**
   * Creates a model instance from a database row.
   * @param {object} row
   * @returns {UserModel}
   */
  static tableToModel(row) {
    return new UserModel(
      row["id"],
      row["role"],
      row["username"],
      row["first_name"],
      row["last_name"],
      row["birthday"],
      row["email"],
      row["password"]
    );
  }

  /**
   * Retrieves all users.
   * @returns {Promise<UserModel[]>}
   */
  static async getAll() {
    const rows = await this.query("SELECT * FROM users");
    return rows.map((row) => this.tableToModel(row.users));
  }

  /**
   * Retrieves a single user by ID.
   * @param {number} id
   * @returns {Promise<UserModel>}
   */
  static async getById(id) {
    const [queryResult] = await this.query(
      "SELECT * FROM users WHERE id = ?",
      id
    );

    if (!queryResult) return Promise.reject("not found");

    return this.tableToModel(queryResult.users);
  }

  /**
   * Retrieves a single user by email.
   * @param {string} email
   * @returns {Promise<UserModel>}
   */
  static async getByEmail(email) {
    const [queryResult] = await this.query(
      "SELECT * FROM users WHERE email = ?",
      email
    );

    if (!queryResult) return Promise.reject("not found");

    return this.tableToModel(queryResult.users);
  }

  /**
   * Creates a new user.
   * @param {UserModel} user
   * @returns {Promise<object>}
   */
  static async create(user) {
    return await this.query(
      `
      INSERT INTO users (
        role, username, first_name, last_name, birthday, email, password
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      user.role,
      user.username,
      user.firstName,
      user.lastName,
      this.toMySqlDate(user.birthday),
      user.email,
      user.password
    );
  }

  /**
   * Updates an existing user.
   * @param {UserModel} user
   * @returns {Promise<object>}
   */
  static async update(user) {
    const queryResult = await this.query(
      `
      UPDATE users
      SET
        role = ?,
        username = ?,
        first_name = ?,
        last_name = ?,
        birthday = ?,
        email = ?,
        password = ?
      where id = ?
      `,
      user.role,
      user.username,
      user.firstName,
      user.lastName,
      this.toMySqlDate(user.birthday),
      user.email,
      user.password,
      user.id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }

  /**
   * Deletes a user.
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async delete(id) {
    const queryResult = await this.query(
      "DELETE FROM users WHERE id = ?",
      id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }

  /**
   * Checks if a username is already in use.
   * @param {string} username
   * @param {number|null} [excludeId]
   * @returns {Promise<boolean>}
   */
  static async existsWithUsername(username, excludeId = null) {
    if (!username) return false;
    const rows = excludeId
      ? await this.query(
          "SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id <> ?",
          username,
          excludeId
        )
      : await this.query(
          "SELECT id FROM users WHERE LOWER(username) = LOWER(?)",
          username
        );
    return Array.isArray(rows) && rows.length > 0;
  }

  /**
   * Checks if an email is already in use.
   * @param {string} email
   * @param {number|null} [excludeId]
   * @returns {Promise<boolean>}
   */
  static async existsWithEmail(email, excludeId = null) {
    if (!email) return false;
    const rows = excludeId
      ? await this.query(
          "SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id <> ?",
          email,
          excludeId
        )
      : await this.query(
          "SELECT id FROM users WHERE LOWER(email) = LOWER(?)",
          email
        );
    return Array.isArray(rows) && rows.length > 0;
  }

  /**
   * Checks for username and email conflicts.
   * @param {string} username
   * @param {string} email
   * @param {number|null} [excludeId]
   * @returns {Promise<void>}
   */
  static async ensureUniqueUsernameEmail(username, email, excludeId = null) {
    if (await this.existsWithUsername(username, excludeId)) {
      throw new Error("Username is already in use.");
    }
    if (await this.existsWithEmail(email, excludeId)) {
      throw new Error("Email is already in use.");
    }
  }
}
