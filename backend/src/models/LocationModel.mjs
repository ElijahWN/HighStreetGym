import DatabaseModel from "./DatabaseModel.mjs";
import { parseId, toTrimmed } from "../controllers/ControllerUtils.mjs";

/**
 * Represents a gym location.
 */
export default class LocationModel extends DatabaseModel {
  /**
   * @param {any} id
   * @param {any} name
   * @param {any} description
   * @param {any} address
   * @param {any} availability
   */
  constructor(id, name, description, address, availability) {
    super();
    this.id = parseId(id);
    this.name = toTrimmed(name);
    this.description = toTrimmed(description);
    this.address = toTrimmed(address);
    this.availability = toTrimmed(availability);
  }

  /**
   * Creates a model instance from a database row.
   * @param {object} row
   * @returns {LocationModel}
   */
  static tableToModel(row) {
    return new LocationModel(
      row["id"],
      row["name"],
      row["description"],
      row["address"],
      row["availability"]
    );
  }

  /**
   * Retrieves all locations.
   * @returns {Promise<LocationModel[]>}
   */
  static async getAll() {
    const rows = await this.query("SELECT * FROM locations");
    return rows.map((row) => this.tableToModel(row.locations));
  }

  /**
   * Retrieves a single location.
   * @param {number} id
   * @returns {Promise<LocationModel>}
   */
  static async getById(id) {
    const [queryResult] = await this.query(
      "SELECT * FROM locations WHERE id = ?",
      id
    );

    if (!queryResult) return Promise.reject("not found");

    return this.tableToModel(queryResult.locations);
  }

  /**
   * Creates a new location.
   * @param {object} location
   * @returns {Promise<object>}
   */
  static async create(location) {
    return await this.query(
      `
      INSERT INTO locations (name, description, address, availability)
      VALUES (?, ?, ?, ?)
      `,
      location.name,
      location.description,
      location.address,
      location.availability
    );
  }

  /**
   * Updates an existing location.
   * @param {object} location
   * @returns {Promise<object>}
   */
  static async update(location) {
    const queryResult = await this.query(
      `
      UPDATE locations
      SET name = ?, description = ?, address = ?, availability = ?
      where id = ?
      `,
      location.name,
      location.description,
      location.address,
      location.availability,
      location.id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }

  /**
   * Deletes a location.
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async delete(id) {
    const queryResult = await this.query(
      "DELETE FROM locations WHERE id = ?",
      id
    );

    if (!queryResult.affectedRows) return Promise.reject("not found");

    return queryResult;
  }
}
