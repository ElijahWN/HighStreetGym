import DatabaseModel from "./DatabaseModel.mjs";
import { parseId, toTrimmed } from "../controllers/ControllerUtils.mjs";

/**
 * Represents a microblog post.
 */
export default class MicroblogModel extends DatabaseModel {
    /**
     * @param {any} id
     * @param {any} user
     * @param {any} uploadTime
     * @param {any} title
     * @param {any} content
     */
    constructor(id, user, uploadTime, title, content) {
        super();
        this.id = parseId(id);
        this.user = Number(user);
        this.uploadTime = new Date(uploadTime);
        this.title = toTrimmed(title);
        this.content = toTrimmed(content);
    }

    /**
     * Creates a model instance from a database row.
     * @param {object} row
     * @returns {MicroblogModel}
     */
    static tableToModel(row) {
        return new MicroblogModel(
            row["id"],
            row["user"],
            row["upload_time"],
            row["title"],
            row["content"]
        );
    }

    /**
     * Retrieves all microblog posts.
     * @returns {Promise<MicroblogModel[]>}
     */
    static async getAll() {
        return (await this.query("SELECT * FROM microblogs ORDER BY upload_time DESC")).map((row) =>
            this.tableToModel(row.microblogs)
        );
    }

    /**
     * Retrieves all microblog posts with their authors.
     * @returns {Promise<object[]>}
     */
    static async getAllWithAuthors() {
        const rows = await this.query(
            `
            SELECT * FROM microblogs
            JOIN users ON users.id = microblogs.user
            ORDER BY microblogs.upload_time DESC
            `
        );
        return rows.map((row) => ({
            ...this.tableToModel(row.microblogs),
            author: row.users.username,
            authorId: row.users.id,
        }));
    }

    /**
     * Retrieves a single microblog post.
     * @param {number} id
     * @returns {Promise<MicroblogModel>}
     */
    static async getById(id) {
        const [result] = await this.query(
            "SELECT * FROM microblogs WHERE id = ?",
            id
        );

        if (!result) return Promise.reject("not found");

        return this.tableToModel(result.microblogs);
    }

    /**
     * Creates a new microblog post.
     * @param {MicroblogModel} microblog
     * @returns {Promise<object>}
     */
    static async create(microblog) {
        return await this.query(
            `
            INSERT INTO microblogs (user, upload_time, title, content)
            VALUES (?, ?, ?, ?)
            `,
            microblog.user,
            this.toMySqlDateTime(new Date()),
            microblog.title,
            microblog.content
        );
    }

    /**
     * Updates an existing microblog post.
     * @param {MicroblogModel} microblog
     * @returns {Promise<object>}
     */
    static async update(microblog) {
        const result = await this.query(
            `
            UPDATE microblogs
            SET user = ?, upload_time = ?, title = ?, content = ?
            where id = ?
            `,
            microblog.user,
            this.toMySqlDateTime(microblog.uploadTime),
            microblog.title,
            microblog.content,
            microblog.id
        );

        if (!result.affectedRows) return Promise.reject("not found");

        return result;
    }

    /**
     * Deletes a microblog post.
     * @param {number} id
     * @returns {Promise<object>}
     */
    static async delete(id) {
        const result = await this.query(
            "DELETE FROM microblogs WHERE id = ?",
            id
        );

        if (!result.affectedRows) return Promise.reject("not found");

        return result;
    }
}
