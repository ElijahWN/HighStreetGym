import DatabaseModel from "./DatabaseModel.mjs";
import SessionModel from "./SessionModel.mjs";
import ActivityModel from "./ActivityModel.mjs";
import LocationModel from "./LocationModel.mjs";
import UserModel from "./UserModel.mjs";

/**
 * Represents a session with its related activity, location, trainer, and bookings.
 */
export default class SessionDetailsModel extends DatabaseModel {
  /**
   * @param {object} session
   * @param {object} activity
   * @param {object} trainer
   * @param {object} location
   * @param {object[]} bookings
   */
  constructor(session, activity, trainer, location, bookings) {
    super();
    this.session = session;
    this.activity = activity;
    this.trainer = trainer;
    this.location = location;
    this.bookings = bookings;
  }

  /**
   * Creates a model instance from a database row.
   * @param {object} row
   * @returns {SessionDetailsModel}
   */
  static tableToModel(row) {
    return new SessionDetailsModel(
      SessionModel.tableToModel(row.s),
      ActivityModel.tableToModel(row.a),
      UserModel.tableToModel(row.t),
      LocationModel.tableToModel(row.l),
      [row.mu].map(userRow => UserModel.tableToModel(userRow))
    );
  }

  /**
   * Retrieves all sessions with their full details.
   * @returns {Promise<SessionDetailsModel[]>}
   */
  static async getAll() {
    const rows = await this.query(
      `
      SELECT s.*, a.*, l.*, t.*, b.*, mu.*
      FROM sessions s
      JOIN activities a ON a.id = s.activity
      JOIN locations l ON l.id = s.location
      JOIN users t ON t.id = s.trainer
      LEFT JOIN bookings b ON b.session = s.id
      LEFT JOIN users mu ON mu.id = b.member
      ORDER BY s.start ASC
      `
    );
    if (!rows.length) return [];
    if (Array.isArray(rows[0]?.mu)) {
      // Rows already contain aggregated users array under alias `mu`
      return rows.map((row) => this.tableToModel(row));
    }
    // Fallback: group duplicate session rows by id and merge unique booking users
    /** @type {Map<number, SessionDetailsModel>} */
    const byId = new Map();
    for (const row of rows) {
      const sessionDetails = this.tableToModel(row);
      let existingSessionDetails = byId.get(sessionDetails.session.id);
      if (!existingSessionDetails) {
        existingSessionDetails = new SessionDetailsModel(
          sessionDetails.session,
          sessionDetails.activity,
          sessionDetails.trainer,
          sessionDetails.location,
          []
        );
        byId.set(sessionDetails.session.id, existingSessionDetails);
      }
      for (const user of sessionDetails.bookings) {
        if (!existingSessionDetails.bookings.find((existingUser) => existingUser.id === user.id))
          existingSessionDetails.bookings.push(user);
      }
    }
    return Array.from(byId.values());
  }

  /**
   * Retrieves a single session with its full details.
   * @param {number} sessionId
   * @returns {Promise<SessionDetailsModel>}
   */
  static async getById(sessionId) {
    const rows = await this.query(
      `
      SELECT s.*, a.*, l.*, t.*, b.*, mu.*
      FROM sessions s
      JOIN activities a ON a.id = s.activity
      JOIN locations l ON l.id = s.location
      JOIN users t ON t.id = s.trainer
      LEFT JOIN bookings b ON b.session = s.id
      LEFT JOIN users mu ON mu.id = b.member
      WHERE s.id = ?
      ORDER BY s.start ASC
      `,
      sessionId
    );
    if (!rows.length) return Promise.reject("not found");
    if (Array.isArray(rows[0]?.mu)) {
      return this.tableToModel(rows[0]);
    }
    // Fallback: merge bookings across duplicate rows for the same session
    const firstRowDetails = this.tableToModel(rows[0]);
    const mergedDetails = new SessionDetailsModel(
      firstRowDetails.session,
      firstRowDetails.activity,
      firstRowDetails.trainer,
      firstRowDetails.location,
      []
    );
    for (const row of rows) {
      const rowDetails = this.tableToModel(row);
      for (const user of rowDetails.bookings) {
        if (!mergedDetails.bookings.find((existingUser) => existingUser.id === user.id))
          mergedDetails.bookings.push(user);
      }
    }
    return mergedDetails;
  }
}
