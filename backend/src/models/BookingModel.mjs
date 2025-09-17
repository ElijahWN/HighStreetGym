import DatabaseModel from "./DatabaseModel.mjs";
import { parseId } from "../controllers/ControllerUtils.mjs";

/**
 * Represents a booking for a session.
 */
export default class BookingModel extends DatabaseModel {
  /**
   * @param {any} id
   * @param {any} member
   * @param {any} session
   */
  constructor(id, member, session) {
    super();
    this.id = parseId(id);
    this.member = Number(member);
    this.session = Number(session);
  }

  /**
   * Creates a model instance from a database row.
   * @param {object} row
   * @returns {BookingModel}
   */
  static tableToModel(row) {
    return new BookingModel(
      row["id"],
      row["member"],
      row["session"]
    );
  }

  /**
   * Retrieves all bookings.
   * @returns {Promise<BookingModel[]>}
   */
  static async getAll() {
    const rows = await this.query("SELECT * FROM bookings");
    return rows.map((row) => this.tableToModel(row.bookings));
  }

  /**
   * Retrieves a single booking.
   * @param {number} id
   * @returns {Promise<BookingModel>}
   */
  static async getById(id) {
    const [queryResult] = await this.query("SELECT * FROM bookings WHERE id = ?", id);
    if (!queryResult) return Promise.reject("not found");
    return this.tableToModel(queryResult.bookings);
  }

  /**
   * Creates a new booking.
   * @param {{member:number, session:number}} booking
   * @returns {Promise<object>}
   */
  static async create(booking) {
    try {
      const result = await this.query(
        `
        INSERT INTO bookings (member, session)
        SELECT ?, ?
        FROM sessions s
        JOIN activities a ON a.id = s.activity
        LEFT JOIN bookings b ON b.session = s.id
        WHERE s.id = ?
        GROUP BY s.id, a.capacity
        HAVING COUNT(b.id) < a.capacity
        `,
        booking.member,
        booking.session,
        booking.session
      );
      if (!result.affectedRows) return Promise.reject("session full");
      return result;
    } catch (error) {
      if (error && error.code === "ER_DUP_ENTRY") {
        return Promise.reject("already booked");
      }
      throw error;
    }
  }

  /**
   * Updates an existing booking.
   * @param {{id:number, member:number, session:number}} booking
   * @returns {Promise<object>}
   */
  static async update(booking) {
    const queryResult = await this.query(
      `
      UPDATE bookings
      SET member = ?, session = ?
      where id = ?
      `,
      booking.member,
      booking.session,
      booking.id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");
    return queryResult;
  }

  /**
   * Deletes a booking by member and session.
   * @param {number} memberId
   * @param {number} sessionId
   * @returns {Promise<object>}
   */
  static async deleteByMemberAndSession(memberId, sessionId) {
    const queryResult = await this.query(
      "DELETE FROM bookings WHERE member = ? AND session = ?",
      memberId,
      sessionId
    );
    if (!queryResult.affectedRows) return Promise.reject("not found");
    return queryResult;
  }

  /**
   * Deletes a booking.
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async delete(id) {
    const queryResult = await this.query("DELETE FROM bookings WHERE id = ?", id);
    if (!queryResult.affectedRows) return Promise.reject("not found");
    return queryResult;
  }
}
