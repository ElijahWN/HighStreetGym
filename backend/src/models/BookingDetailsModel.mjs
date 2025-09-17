import DatabaseModel from "./DatabaseModel.mjs";
import BookingModel from "./BookingModel.mjs";
import SessionModel from "./SessionModel.mjs";
import ActivityModel from "./ActivityModel.mjs";
import LocationModel from "./LocationModel.mjs";
import UserModel from "./UserModel.mjs";

/**
 * Represents a booking with its related session, activity, trainer, location, and member.
 */
export default class BookingDetailsModel extends DatabaseModel {
  /**
   * @param {BookingModel} booking
   * @param {SessionModel} session
   * @param {ActivityModel} activity
   * @param {UserModel} trainer
   * @param {LocationModel} location
   * @param {UserModel} member
   */
  constructor(booking, session, activity, trainer, location, member) {
    super();
    this.booking = booking;
    this.session = session;
    this.activity = activity;
    this.trainer = trainer;
    this.location = location;
    this.member = member;
  }

  /**
   * Creates a model instance from a database row with nested table aliases.
   * @param {object} row
   * @returns {BookingDetailsModel}
   */
  static tableToModel(row) {
    return new BookingDetailsModel(
      BookingModel.tableToModel(row.b),
      SessionModel.tableToModel(row.s),
      ActivityModel.tableToModel(row.a),
      UserModel.tableToModel(row.t),
      LocationModel.tableToModel(row.l),
      UserModel.tableToModel(row.mu)
    );
  }

  /**
   * Retrieves all bookings with their full details.
   * @returns {Promise<BookingDetailsModel[]>}
   */
  static async getAll() {
    const rows = await this.query(
      `
      SELECT b.*, s.*, a.*, l.*, t.*, mu.*
      FROM bookings b
      JOIN sessions s ON s.id = b.session
      JOIN activities a ON a.id = s.activity
      JOIN locations l ON l.id = s.location
      JOIN users t ON t.id = s.trainer
      JOIN users mu ON mu.id = b.member
      ORDER BY s.start ASC, b.id ASC
      `
    );
    return rows.map(row => this.tableToModel(row));
  }

  /**
   * Retrieves a single booking with its full details.
   * @param {number} id
   * @returns {Promise<BookingDetailsModel>}
   */
  static async getById(id) {
    const rows = await this.query(
      `
      SELECT b.*, s.*, a.*, l.*, t.*, mu.*
      FROM bookings b
      JOIN sessions s ON s.id = b.session
      JOIN activities a ON a.id = s.activity
      JOIN locations l ON l.id = s.location
      JOIN users t ON t.id = s.trainer
      JOIN users mu ON mu.id = b.member
      WHERE b.id = ?
      ORDER BY s.start ASC, b.id ASC
      `,
      id
    );
    if (!rows.length) return Promise.reject("not found");
    return this.tableToModel(rows[0]);
  }
}
