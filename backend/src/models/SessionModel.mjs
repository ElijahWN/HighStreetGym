import DatabaseModel from "./DatabaseModel.mjs";
import { parseId } from "../controllers/ControllerUtils.mjs";

/**
 * Represents a training session.
 */
export default class SessionModel extends DatabaseModel {
  /**
   * @param {any} id
   * @param {any} activity
   * @param {any} trainer
   * @param {any} location
   * @param {any} start
   */
  constructor(id, activity, trainer, location, start) {
    super();
    this.id = parseId(id);
    this.activity = Number(activity);
    this.trainer = Number(trainer);
    this.location = Number(location);
    this.start = new Date(start);
  }

  /**
   * Creates a model instance from a database row.
   * @param {object} row
   * @returns {SessionModel}
   */
  static tableToModel(row) {
    return new SessionModel(
      row["id"],
      row["activity"],
      row["trainer"],
      row["location"],
      row["start"]
    );
  }

  /**
   * Retrieves all sessions.
   * @returns {Promise<SessionModel[]>}
   */
  static async getAll() {
    const rows = await this.query("SELECT * FROM sessions");
    return rows.map((row) => this.tableToModel(row.sessions));
  }

  /**
   * Retrieves a single session.
   * @param {number} id
   * @returns {Promise<SessionModel>}
   */
  static async getById(id) {
    const [queryResult] = await this.query(
      "SELECT * FROM sessions WHERE id = ?",
      id
    );

    if (!queryResult) return Promise.reject("not found");

    return this.tableToModel(queryResult.sessions);
  }

  /**
   * Creates a new session.
   * @param {SessionModel} session
   * @returns {Promise<object>}
   */
  static async create(session) {
    return await this.query(
      `
      INSERT INTO sessions (activity, trainer, location, start)
      VALUES (?, ?, ?, ?)
      `,
      session.activity,
      session.trainer,
      session.location,
      this.toMySqlDateTime(session.start)
    );
  }

  /**
   * Updates an existing session.
   * @param {SessionModel} session
   * @returns {Promise<object>}
   */
  static async update(session) {
    const queryResult = await this.query(
      `
      UPDATE sessions
      SET activity = ?, trainer = ?, location = ?, start = ?
      where id = ?
      `,
      session.activity,
      session.trainer,
      session.location,
      this.toMySqlDateTime(session.start),
      session.id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }

  /**
   * Deletes a session.
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async delete(id) {
    const queryResult = await this.query(
      "DELETE FROM sessions WHERE id = ?",
      id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }

  /**
   * Retrieves sessions for a given week with full details.
   * @param {string} start
   * @param {string} end
   * @returns {Promise<object[]>}
   */
  static async getForWeekWithDetails(start, end) {
    const rows = await this.query(
      `
      SELECT s.*, a.*, l.*, u.*
      FROM sessions s
      JOIN activities a ON a.id = s.activity
      JOIN locations l ON l.id = s.location
      JOIN users u ON u.id = s.trainer
      WHERE s.start >= ? AND s.start < ?
      ORDER BY a.name, s.start
      `,
      start,
      end
    );

    return rows.map((row) => ({
      id: Number(row.s.id),
      start: new Date(row.s.start),
      activityId: Number(row.s.activity),
      activityName: row.a.name,
      locationName: row.l.name,
      trainerName: `${row.u.first_name} ${row.u.last_name}`.trim(),
    }));
  }
}
