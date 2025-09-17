import express from "express";
import MicroblogModel from "../models/MicroblogModel.mjs";
import UserModel, { UserRole } from "../models/UserModel.mjs";
import {
  formatDisplayDate,
  validationFailed,
  toTrimmed,
  parseId,
  invalidId,
  serverError,
  forbidden
} from "./ControllerUtils.mjs";
import AuthenticationController from "./AuthenticationController.mjs";

/**
 * Manages microblog posts.
 */
export default class MicroblogController {
    static routes = express.Router();

    static {
        this.routes.get("/", this.viewList);
        this.routes.get("/new", AuthenticationController.restrict(UserRole.ADMIN, UserRole.TRAINER, UserRole.MEMBER), this.viewList);
        this.routes.post("/", AuthenticationController.restrict(UserRole.ADMIN, UserRole.TRAINER, UserRole.MEMBER), this.handleCreate);
        this.routes.post("/:id/delete", AuthenticationController.restrict(UserRole.ADMIN, UserRole.TRAINER, UserRole.MEMBER), this.handleDelete);
    }

    /**
     * Renders the microblogs page.
     * @type {express.RequestHandler}
     */
    static async viewList(req, res) {
        try {
            const [blogs, users] = await Promise.all([
                MicroblogModel.getAll(),
                UserModel.getAll(),
            ]);

            const rawSearch = toTrimmed(req.query.search);
            const parsedSearch = rawSearch.toLowerCase();
            const usernameById = new Map(users.map((user) => [user.id, user.username.toLowerCase()]));
            const filteredBlogs = parsedSearch
                ? blogs.filter((blog) => {
                    const blob = `
                        ${blog.title}
                        ${blog.content}
                        ${usernameById.get(blog.user)}
                        ${formatDisplayDate(blog.uploadTime)}
                    `.toLowerCase();
                    return blob.includes(parsedSearch);
                })
                : blogs;

            const showCreate = req.query.create === "1" || req.path.endsWith("/new");

            res.render(
                res.locals.ROUTES.MICROBLOGS.getView(),
                {
                    blogs: filteredBlogs,
                    users,
                    formatDisplayDate,
                    showCreate,
                    rawSearch,
                }
            );
        } catch (err) {
            return serverError(
                res,
                "Failed to load microblogs",
                err,
                `${res.locals.ROUTES.MICROBLOGS.getPath()} error`
            );
        }
    }

    /**
     * Creates a new microblog post.
     * @type {express.RequestHandler}
     */
    static async handleCreate(req, res) {
        try {
            const post = new MicroblogModel(
                null,
                res.locals.user.id,
                new Date(),
                req.body.title,
                req.body.content
            );
            if (!post.title)
                return validationFailed(
                    res,
                    "Title is required.",
                    res.locals.ROUTES.MICROBLOGS.name,
                    res.locals.ROUTES.MICROBLOGS.getPath()
                );

            await MicroblogModel.create(post);
            return res.redirect(res.locals.ROUTES.MICROBLOGS.getPath());
        } catch (err) {
            return serverError(
                res,
                "Failed to create post",
                err,
                `${res.locals.ROUTES.MICROBLOGS.getPath()} create`,
                res.locals.ROUTES.MICROBLOGS.name,
                res.locals.ROUTES.MICROBLOGS.getPath()
            );
        }
    }

    /**
     * Removes a microblog post.
     * @type {express.RequestHandler}
     */
    static async handleDelete(req, res) {
        try {
            const id = parseId(req.params.id);
            const user = res.locals.user;
            if (id === null)
                return invalidId(
                    res,
                    "Post",
                    res.locals.ROUTES.MICROBLOGS.name,
                    res.locals.ROUTES.MICROBLOGS.getPath()
                );
            
            const microblog = await MicroblogModel.getById(id);
            if (user.role !== UserRole.ADMIN && user.id !== microblog.user) {
                return forbidden(
                    res,
                    "You cannot delete this post.",
                    res.locals.ROUTES.MICROBLOGS.name,
                    res.locals.ROUTES.MICROBLOGS.getPath()
                );
            }

            await MicroblogModel.delete(id);
            return res.redirect(res.locals.ROUTES.MICROBLOGS.getPath());
        } catch (err) {
            return serverError(
                res,
                "Failed to delete post",
                err,
                `${res.locals.ROUTES.MICROBLOGS.getPath()} delete`,
                res.locals.ROUTES.MICROBLOGS.name,
                res.locals.ROUTES.MICROBLOGS.getPath()
            );
        }
    }
}
