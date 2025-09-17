import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Provides a base for models needing database access.
 */
export default class DatabaseModel {
    static connection;

    static {
        this.connection = mysql.createPool({
            host: "localhost",
            port: "3307",
            user: "high-street-gym",
            password: process.env.DATABASE_PASSWORD,
            database: "high_street_gym",
            nestTables: true,
        });
    }

    /**
     * Executes a MySQL query.
     * @param {string} sql
     * @param {any[]} values
     * @returns {Promise<object>}
     */
    static query(sql, ...values) {
        return this.connection
            .query(sql, values)
            .then(([result]) => result);
    }

    /**
     * Formats a date for MySQL DATE columns.
     * @param {Date} date
     * @returns {string}
     */
    static toMySqlDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    /**
     * Formats a date for MySQL DATETIME columns.
     * @param {Date} datetime
     * @returns {string}
     */
    static toMySqlDateTime(datetime) {
        const y = datetime.getFullYear();
        const m = String(datetime.getMonth() + 1).padStart(2, "0");
        const d = String(datetime.getDate()).padStart(2, "0");
        const hh = String(datetime.getHours()).padStart(2, "0");
        const mm = String(datetime.getMinutes()).padStart(2, "0");
        const ss = String(datetime.getSeconds()).padStart(2, "0");
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }

    /**
     * Formats a date for MySQL TIME columns.
     * @param {Date} datetime
     * @returns {string}
     */
    static toMySqlTime(datetime) {
        const hh = String(datetime.getHours()).padStart(2, "0");
        const mm = String(datetime.getMinutes()).padStart(2, "0");
        const ss = String(datetime.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }
}
