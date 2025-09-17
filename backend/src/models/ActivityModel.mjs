import DatabaseModel from "./DatabaseModel.mjs";
import { parseId, toTrimmed } from "../controllers/ControllerUtils.mjs";

/**
 * Represents a fitness activity.
 */
export default class ActivityModel extends DatabaseModel {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} description
   * @param {number} capacity
   * @param {number} duration Hours as a number (e.g. 1 for one hour, 1.5 for 90 minutes)
   */
  constructor(id, name, description, capacity, duration) {
    super();
    this.id = parseId(id);
    this.name = toTrimmed(name);
    this.description = toTrimmed(description);
    this.capacity = Number(capacity);
    const num = Number(duration);
    this.duration = Number.isFinite(num) && num > 0 ? num : 1;
  }

  /**
   * Creates a model instance from a database row.
   * @param {object} row
   * @returns {ActivityModel}
   */
  static tableToModel(row) {
    return new ActivityModel(
      row["id"],
      row["name"],
      row["description"],
      row["capacity"],
      this.timeToHours(row["duration"])
    );
  }

  /**
   * Converts a MySQL TIME value to hours as a number.
   * Accepts a string in HH:MM:SS (or HH:MM) format, or a Date instance.
   * @param {string|Date|any} value
   * @returns {number}
   */
  static timeToHours(value) {
    if (value instanceof Date && !isNaN(value)) {
      return value.getHours() + value.getMinutes() / 60 + value.getSeconds() / 3600;
    }
    const s = String(value ?? "").trim();
    const m = s.match(/^(\d{1,3}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return 1;
    const hours = Math.max(0, Number(m[1]));
    const minutes = Math.min(59, Math.max(0, Number(m[2])));
    const seconds = Math.min(59, Math.max(0, Number(m[3] ?? 0)));
    return hours + minutes / 60 + seconds / 3600;
  }

  /**
   * Converts hours as a number to an HH:MM:SS string for MySQL TIME.
   * @param {number} hours
   * @returns {string}
   */
  static hoursToHHMMSS(hours) {
    const safe = Number.isFinite(hours) && hours > 0 ? hours : 1;
    const totalMinutes = Math.round(safe * 60);
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const mm = String(totalMinutes % 60).padStart(2, "0");
    const ss = "00";
    return `${hh}:${mm}:${ss}`;
  }

  /**
   * Retrieves all activities.
   * @returns {Promise<ActivityModel[]>}
   */
  static async getAll() {
    const rows = await this.query(
      "SELECT * FROM activities ORDER BY name"
    );
    return rows.map((row) => this.tableToModel(row.activities));
  }

  /**
   * Retrieves a single activity.
   * @param {number} id
   * @returns {Promise<ActivityModel>}
   */
  static async getById(id) {
    const [queryResult] = await this.query(
      "SELECT * FROM activities WHERE id = ?",
      id
    );

    if (!queryResult) return Promise.reject("not found");

    return this.tableToModel(queryResult.activities);
  }

  /**
   * Creates a new activity.
   * @param {ActivityModel} activity
   * @returns {Promise<object>}
   */
  static async create(activity) {
    return await this.query(
      `
      INSERT INTO activities (name, description, capacity, duration)
      VALUES (?, ?, ?, ?)
      `,
      activity.name,
      activity.description,
      activity.capacity,
      this.hoursToHHMMSS(activity.duration)
    );
  }

  /**
   * Updates an existing activity.
   * @param {ActivityModel} activity
   * @returns {Promise<object>}
   */
  static async update(activity) {
    const queryResult = await this.query(
      `
      UPDATE activities
      SET name = ?, description = ?, capacity = ?, duration = ?
      where id = ?
      `,
      activity.name,
      activity.description,
      activity.capacity,
      this.hoursToHHMMSS(activity.duration),
      activity.id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }

  /**
   * Deletes an activity.
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async delete(id) {
    const queryResult = await this.query(
      "DELETE FROM activities WHERE id = ?",
      id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }
}

