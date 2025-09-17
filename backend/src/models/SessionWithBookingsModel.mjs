import DatabaseModel from "./DatabaseModel.mjs";
import BookingModel from "./BookingModel.mjs";
import SessionModel from "./SessionModel.mjs";

/**
 * Represents a session with its associated bookings.
 */
export default class SessionWithBookingsModel extends DatabaseModel {
  /**
   * @param {object} sessionModel
   * @param {object[]} bookingModels
   */
  constructor(sessionModel, bookingModels) {
    super();
    this.session = sessionModel;
    this.bookings = bookingModels;
  }

  /**
   * Creates a model instance from a database row.
   * @param {object} row
   * @returns {SessionWithBookingsModel}
   */
  static tableToModel(row) {
    return new SessionWithBookingsModel(
      SessionModel.tableToModel(row.sessions),
      row.bookings.map(bookingRow => BookingModel.tableToModel(bookingRow))
    );
  }

  /**
   * Retrieves all sessions with their bookings.
   * @returns {Promise<SessionWithBookingsModel[]>}
   */
  static async getAll() {
    const rows = await this.query(
      `
      SELECT *
      FROM sessions
      LEFT JOIN bookings ON bookings.session = sessions.id
      ORDER BY sessions.start ASC
      `
    );

    const bySession = new Map();
    for (const row of rows) {
      const sessionId = row.sessions.id;
      if (!bySession.has(sessionId)) {
        bySession.set(sessionId, new SessionWithBookingsModel(
          SessionModel.tableToModel(row.sessions),
          []
        ));
      }
      if (row.bookings && row.bookings.id != null) {
        bySession.get(sessionId).bookings.push(BookingModel.tableToModel(row.bookings));
      }
    }
    return Array.from(bySession.values());
  }

  /**
   * Retrieves a single session with its bookings.
   * @param {number} sessionId
   * @returns {Promise<SessionWithBookingsModel>}
   */
  static async getById(sessionId) {
    const rows = await this.query(
      `
      SELECT *
      FROM sessions
      LEFT JOIN bookings ON bookings.session = sessions.id
      WHERE sessions.id = ?
      ORDER BY sessions.start ASC
      `,
      sessionId
    );

    if (!rows.length) return Promise.reject("not found");

    const session = SessionModel.tableToModel(rows[0].sessions);
    const bookings = [];
    for (const row of rows) {
      if (row.bookings && row.bookings.id != null) {
        bookings.push(BookingModel.tableToModel(row.bookings));
      }
    }
    return new SessionWithBookingsModel(session, bookings);
  }
}
