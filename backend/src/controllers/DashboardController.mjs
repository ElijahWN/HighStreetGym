import express from "express";
import bcrypt from "bcryptjs";
import { UserRole } from "../models/UserModel.mjs";
import UserModel from "../models/UserModel.mjs";
import ActivityModel from "../models/ActivityModel.mjs";
import LocationModel from "../models/LocationModel.mjs";
import MicroblogModel from "../models/MicroblogModel.mjs";
import SessionWithBookingsModel from "../models/SessionWithBookingsModel.mjs";
import { serverError, toInputDate, validationFailed, toTrimmed } from "./ControllerUtils.mjs";
import AuthenticationController from "./AuthenticationController.mjs";

/**
 * Manages role based dashboards.
 */
export default class DashboardController {
  static routes = express.Router();

  static {
    this.routes.use(
      AuthenticationController.restrict(
        UserRole.ADMIN,
        UserRole.TRAINER,
        UserRole.MEMBER
      )
    );
    this.routes.get("/", this.viewDashboard);
    this.routes.post("/account", this.updateAccount);
  }

  /**
   * Renders a dashboard based on the user role.
   * @type {express.RequestHandler}
   */
  static async viewDashboard(req, res) {
    const user = res.locals.user;
    const userForView = {
      ...user,
      birthday: toInputDate(user?.birthday),
    };

    try {
      if (user.role === UserRole.ADMIN) {
        const [users, activities, locations, posts, sessionWithBookings] = await Promise.all([
          UserModel.getAll(),
          ActivityModel.getAll(),
          LocationModel.getAll(),
          MicroblogModel.getAll(),
          SessionWithBookingsModel.getAll(),
        ]);

        const now = new Date();
        const upcomingSessions = sessionWithBookings.filter((sessionWithBooking) =>
          sessionWithBooking.session.start >= now
        ).length;
        const bookingsCount = sessionWithBookings.reduce(
          (sum, x) => sum + x.bookings.length,
          0
        );

        return res.status(200).render(
          res.locals.ROUTES.DASHBOARD.getView(UserRole.ADMIN),
          {
            user: userForView,
            totalUsers: users.length,
            upcomingSessions,
            totalPosts: posts.length,
            locationsCount: locations.length,
            bookingsCount,
            activitiesCount: activities.length,
          }
        );
      }

      const sessionWithBookings = await SessionWithBookingsModel.getAll();
      const { startOfWeek, endOfWeek } = DashboardController.#getThisWeekRange();

      if (user.role === UserRole.TRAINER) {
        const count = sessionWithBookings.filter((sessionWithBooking) => {
          return (
            sessionWithBooking.session.trainer === user.id &&
            sessionWithBooking.session.start >= startOfWeek &&
            sessionWithBooking.session.start < endOfWeek
          );
        }).length;

        return res.status(200).render(
          res.locals.ROUTES.DASHBOARD.getView(UserRole.TRAINER),
          {
            user: userForView,
            sessionsThisWeek: count,
          }
        );
      }

      const count = sessionWithBookings.filter((sessionWithBooking) => {
        const hasBooking = sessionWithBooking.bookings.some((booking) => booking.member === user.id);
        return hasBooking && sessionWithBooking.session.start >= startOfWeek && sessionWithBooking.session.start < endOfWeek;
      }).length;

      return res.status(200).render(
        res.locals.ROUTES.DASHBOARD.getView(UserRole.MEMBER),
        {
          user: userForView,
          sessionsThisWeek: count,
        }
      );
    } catch (error) {
      return serverError(
        res,
        "Failed to load dashboard",
        error,
        `${res.locals.ROUTES.DASHBOARD.getPath()} error`
      );
    }
  }

  /**
   * Updates the current user account information.
   * @type {express.RequestHandler}
   */
  static async updateAccount(req, res) {
    try {
      const currentUser = res.locals.user;

      const { username, email, firstName, lastName, birthday, password } = {
        ...currentUser,
        ...req.body,
      };

      const birthdayString = toInputDate(birthday);
      const birthdayForUpdate = birthdayString ? new Date(birthdayString) : currentUser.birthday;

      const updated = new UserModel(
        currentUser.id,
        currentUser.role,
        username,
        firstName,
        lastName,
        birthdayForUpdate,
        email,
        currentUser.password,
      );

      try {
        await UserModel.ensureUniqueUsernameEmail(
          updated.username,
          updated.email,
          currentUser.id
        );
      } catch {
        return validationFailed(
          res,
          "Username or email already in use.",
          res.locals.ROUTES.DASHBOARD.name,
          res.locals.ROUTES.DASHBOARD.getPath()
        );
      }

      if (password && toTrimmed(password).length > 0) {
        const saltRounds = 10;
        updated.password = await bcrypt.hash(String(password), saltRounds);
      }

      await UserModel.update(updated);

      res.locals.user = await UserModel.getById(currentUser.id);

      return res.redirect(res.locals.ROUTES.DASHBOARD.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to update account",
        error,
        `${res.locals.ROUTES.DASHBOARD.getPath()} update`,
        res.locals.ROUTES.DASHBOARD.name,
        res.locals.ROUTES.DASHBOARD.getPath()
      );
    }
  }

  /**
   * Gets the start and end of the current week.
   * @returns {{startOfWeek: Date, endOfWeek: Date}} A date range for the current week.
   */
  static #getThisWeekRange() {
    const now = new Date();

    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - (now.getDay() - 1));

    const endOfWeek = new Date();
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return { startOfWeek, endOfWeek };
  }

}
