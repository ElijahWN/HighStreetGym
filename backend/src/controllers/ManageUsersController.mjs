import express from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.mjs";
import {
  toInputDate,
  toTrimmed,
  parseId,
  invalidId,
  serverError,
  validationFailed,
  notFound
} from "./ControllerUtils.mjs";

/**
 * Manages users.
 */
export default class ManageUsersController {
  static routes = express.Router();

  static {
    this.routes.get("/", this.viewManageUsers);
    this.routes.get("/:id", this.viewManageUsers);
    this.routes.post("/", this.createUser);
    this.routes.post("/:id", this.updateUser);
    this.routes.post("/:id/delete", this.deleteUser);
  }

  /**
   * Renders the user management page.
   * @type {express.RequestHandler}
   */
  static async viewManageUsers(req, res) {
    try {
      const searchRaw = toTrimmed(req.query.search);
      const query = searchRaw.toLowerCase();

      const users = await UserModel.getAll();
      let filteredUsers = users;
      if (query)
        filteredUsers = users.filter((user) => {
          const searchBlob = `
            ${user.username}
            ${user.firstName}
            ${user.lastName}
            ${user.email}
            ${user.role}
          `.toLowerCase();
          return searchBlob.includes(query);
        });
      
      filteredUsers = filteredUsers
        .slice()
        .sort((leftUser, rightUser) => {
          const leftName = `${leftUser.firstName} ${leftUser.lastName}`;
          const rightName = `${rightUser.firstName} ${rightUser.lastName}`;
          return leftName.localeCompare(rightName);
        });

      const idParam = parseId(req.params.id);
      let userView = null;
      if (idParam)
        try {
          userView = await UserModel.getById(idParam);
        } catch (error) {
          return notFound(
            res,
            "User not found",
            res.locals.ROUTES.MANAGE_USERS.name,
            res.locals.ROUTES.MANAGE_USERS.getPath()
          );
        }

      return res.status(200).render(
        res.locals.ROUTES.MANAGE_USERS.getView(),
        {
          users: filteredUsers,
          managedUser: userView,
          toInputDate,
          search: searchRaw
        }
      );
    } catch (error) {
      return serverError(
        res,
        "Failed to load users",
        error,
        `${res.locals.ROUTES.MANAGE_USERS.getPath()} error`,
        res.locals.ROUTES.DASHBOARD.name,
        res.locals.ROUTES.DASHBOARD.getPath()
      );
    }
  }

  /**
   * Creates a new user.
   * @type {express.RequestHandler}
   */
  static async createUser(req, res) {
    try {
      const passwordRaw = toTrimmed(req.body.password);
      const userModel = new UserModel(
        null,
        req.body.role ?? "member",
        req.body.username,
        req.body.firstName,
        req.body.lastName,
        req.body.birthday,
        req.body.email,
        passwordRaw
      );

      if (
        !userModel.username ||
        !userModel.firstName ||
        !userModel.lastName ||
        !userModel.email ||
        !passwordRaw
      )
        return validationFailed(
          res,
          "The input fields for username, first name, last name, email and password are all required.",
          res.locals.ROUTES.MANAGE_USERS.name,
          res.locals.ROUTES.MANAGE_USERS.getPath()
        );

      try {
        await UserModel.ensureUniqueUsernameEmail(userModel.username, userModel.email, null);
      } catch (error) {
        return validationFailed(
          res,
          error?.message,
          res.locals.ROUTES.MANAGE_USERS.name,
          res.locals.ROUTES.MANAGE_USERS.getPath()
        );
      }

      const saltRounds = 10;
      userModel.password = await bcrypt.hash(passwordRaw, saltRounds);

      await UserModel.create(userModel);
      return res.redirect(res.locals.ROUTES.MANAGE_USERS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to create user",
        error,
        `${res.locals.ROUTES.MANAGE_USERS.getPath()} create`,
        res.locals.ROUTES.MANAGE_USERS.name,
        res.locals.ROUTES.MANAGE_USERS.getPath()
      );
    }
  }

  /**
   * Updates an existing user.
   * @type {express.RequestHandler}
   */
  static async updateUser(req, res) {
    const id = parseId(req.params.id);
    if (id === null)
      return invalidId(
        res,
        "User",
        res.locals.ROUTES.MANAGE_USERS.name,
        res.locals.ROUTES.MANAGE_USERS.getPath()
      );

    try {
      const passwordRaw = toTrimmed(req.body.password);
      const userModel = new UserModel(
        id,
        req.body.role ?? "member",
        req.body.username,
        req.body.firstName,
        req.body.lastName,
        req.body.birthday,
        req.body.email,
        passwordRaw
      );

      if (
        !userModel.username ||
        !userModel.firstName ||
        !userModel.lastName ||
        !userModel.email
      )
        return validationFailed(
          res,
          "The input fields for username, first name, last name and email are all required.",
          res.locals.ROUTES.MANAGE_USERS.name,
          res.locals.ROUTES.MANAGE_USERS.getPath(id)
        );

      try {
        await UserModel.ensureUniqueUsernameEmail(userModel.username, userModel.email, id);
      } catch (error) {
        return validationFailed(
          res,
          error?.message,
          res.locals.ROUTES.MANAGE_USERS.name,
          res.locals.ROUTES.MANAGE_USERS.getPath(id)
        );
      }

      if (passwordRaw) {
        const saltRounds = 10;
        userModel.password = await bcrypt.hash(passwordRaw, saltRounds);
      } else {
        const existing = await UserModel.getById(id);
        userModel.password = existing.password;
      }

      await UserModel.update(userModel);
      return res.redirect(res.locals.ROUTES.MANAGE_USERS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to update user",
        error,
        `${res.locals.ROUTES.MANAGE_USERS.getPath(id)} update`,
        res.locals.ROUTES.MANAGE_USERS.name,
        res.locals.ROUTES.MANAGE_USERS.getPath(id)
      );
    }
  }

  /**
   * Removes a user.
   * @type {express.RequestHandler}
   */
  static async deleteUser(req, res) {
    const id = parseId(req.params.id);
    if (id === null)
      return invalidId(
        res,
        "User",
        res.locals.ROUTES.MANAGE_USERS.name,
        res.locals.ROUTES.MANAGE_USERS.getPath()
      );

    try {
      await UserModel.delete(id);
      return res.redirect(res.locals.ROUTES.MANAGE_USERS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to delete user",
        error,
        `${res.locals.ROUTES.MANAGE_USERS.getPath(id)} delete`,
        res.locals.ROUTES.MANAGE_USERS.name,
        res.locals.ROUTES.MANAGE_USERS.getPath(id)
      );
    }
  }

}
