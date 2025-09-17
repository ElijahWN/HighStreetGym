import express from "express";
import ActivityModel from "../models/ActivityModel.mjs";
import UserModel, { UserRole } from "../models/UserModel.mjs";
import SessionWithBookingsModel from "../models/SessionWithBookingsModel.mjs";
import SessionModel from "../models/SessionModel.mjs";
import LocationModel from "../models/LocationModel.mjs";
import BookingModel from "../models/BookingModel.mjs";
import {
  toDateValue,
  toTimeValue,
  parseId,
  invalidId,
  notFound,
  validationFailed,
  serverError,
  forbidden,
  toTrimmed
} from "./ControllerUtils.mjs";

/**
 * Manages sessions.
 */
export default class ManageSessionsController {
  static routes = express.Router();

  static {
    this.routes.get("/new", this.viewCreate);
    this.routes.post("/new", this.createSession);

    this.routes.get("/:id", this.viewManage);
    this.routes.post("/:id", this.update);
    this.routes.post("/:id/delete", this.removeSession);
    this.routes.post("/:id/booking", this.addBooking);
    this.routes.post("/:id/booking/:bookingId/delete", this.removeBooking);
  }

  /**
   * Creates a Date from date and time input strings.
   * @param {string} dateString The date string.
   * @param {string} timeString The time string.
   * @returns {Date} A new Date object.
   * @private
   */
  static #fromInputDateTime(dateString, timeString) {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const dateParts = String(dateString || "").match(dateRegex);

    if (!dateParts) {
      return new Date(NaN);
    }

    const [, year, month, day] = dateParts;

    const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
    const timeParts = String(timeString || "").match(timeRegex);

    if (!timeParts) {
      return new Date(NaN);
    }

    const [, hoursRaw, minutesRaw, secondsRaw] = timeParts;

    const hours = Math.max(0, Math.min(23, Number(hoursRaw)));
    const minutes = Math.max(0, Math.min(59, Number(minutesRaw)));
    const seconds = secondsRaw ? Math.max(0, Math.min(59, Number(secondsRaw))) : 0;

    const monthIndex = Number(month) - 1;

    return new Date(Number(year), monthIndex, Number(day), hours, minutes, seconds);
  }

  /**
   * Renders the session management page.
   * @type {express.RequestHandler}
   */
  static async viewManage(req, res) {
    try {
      const sessionId = parseId(req.params.id);
      if (sessionId === null)
        return invalidId(
          res,
          "Session",
          res.locals.ROUTES.SESSIONS.name,
          res.locals.ROUTES.SESSIONS.getPath()
        );

      const [sessionWithBookings, activities, locations, users] = await Promise.all([
        SessionWithBookingsModel.getById(sessionId),
        ActivityModel.getAll(),
        LocationModel.getAll(),
        UserModel.getAll(),
      ]);

      const user = res.locals.user ?? null;
      if (user?.role.toLowerCase() === UserRole.TRAINER) {
        if (sessionWithBookings.session.trainer !== user.id)
          return forbidden(
            res,
            "You may only manage sessions assigned to you.",
            res.locals.ROUTES.BOOKINGS.name,
            res.locals.ROUTES.BOOKINGS.getPath()
          );
      }

      const isTrainer = user?.role?.toLowerCase() === UserRole.TRAINER;
      const trainers = users.filter((user) => user.role === UserRole.TRAINER);
      const capacity =
        activities.find((activity) => activity.id === sessionWithBookings.session.activity)?.capacity ?? 0;
      const members = sessionWithBookings.bookings
        .map((booking) => {
          const user = users.find((user) => user.id === booking.member);
          const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
          const name = fullName || (user?.username ?? "Member");
          return { id: booking.id, name };
        })
        .sort((leftMember, rightMember) => leftMember.name.localeCompare(rightMember.name));

      const bookedUserIds = new Set(sessionWithBookings.bookings.map((booking) => booking.member));
      const availableMembers = users
        .filter((user) => user.role === UserRole.MEMBER && !bookedUserIds.has(user.id))
        .map((user) => {
          const fullName = `${user.firstName} ${user.lastName}`.trim();
          const name = fullName || user.username;
          return { id: user.id, name };
        })
        .sort((leftMember, rightMember) => leftMember.name.localeCompare(rightMember.name));
      const isFull = sessionWithBookings.bookings.length >= capacity;

      return res.status(200).render(
        res.locals.ROUTES.MANAGE_SESSION.getView(),
        {
          sessionWithBookings,
          activities,
          locations,
          trainers,
          isTrainer,
          capacity,
          members,
          availableMembers,
          isFull,
          toDateValue,
          toTimeValue
        }
      );
    } catch (error) {
      console.error(`${res.locals.ROUTES.MANAGE_SESSION.getPath()} error`, error);
      return notFound(
        res,
        "The requested session could not be found.",
        res.locals.ROUTES.CREATE_SESSION.name,
        res.locals.ROUTES.CREATE_SESSION.getPath()
      );
    }
  }

  /**
   * Renders the session creation page.
   * @type {express.RequestHandler}
   */
  static async viewCreate(req, res) {
    try {
      const [activities, locations, users] = await Promise.all([
        ActivityModel.getAll(),
        LocationModel.getAll(),
        UserModel.getAll(),
      ]);

      return res.status(200).render(
        res.locals.ROUTES.CREATE_SESSION.getView(),
        {
          activities,
          locations,
          trainers: users.filter(user => user.role === UserRole.TRAINER),
          toDateValue,
          toTimeValue,
          now: new Date(),
        }
      );
    } catch (error) {
      return serverError(
        res,
        "Failed to load session creation page",
        error,
        `${res.locals.ROUTES.CREATE_SESSION.getPath()} new`,
        res.locals.ROUTES.DASHBOARD.name,
        res.locals.ROUTES.DASHBOARD.getPath()
      );
    }
  }

  /**
   * Updates an existing session.
   * @type {express.RequestHandler}
   */
  static async update(req, res) {
    const id = parseId(req.params.id);
    if (id === null)
      return invalidId(
        res,
        "Session",
        res.locals.ROUTES.MANAGE_SESSION.name,
        res.locals.ROUTES.MANAGE_SESSION.getPath()
      );

    try {
      const existing = await SessionModel.getById(id);
      if (!existing)
        return notFound(
          res,
          "Session not found",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath()
        );

      const authUser = res.locals.user;
      if (authUser?.role.toLowerCase() === UserRole.TRAINER)
        if (existing.trainer !== authUser.id)
          return forbidden(
            res,
            "You may only update sessions assigned to you.",
            res.locals.ROUTES.SESSIONS.name,
            res.locals.ROUTES.SESSIONS.getPath()
          );

      const activity = parseId(req.body.activity);
      let trainer = parseId(req.body.trainer);
      const location = parseId(req.body.location);
      const date = toTrimmed(req.body.date);
      const time = toTrimmed(req.body.time);

      if (!activity)
        return validationFailed(
          res,
          "Activity is required.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );
      
      if (authUser?.role.toLowerCase() === UserRole.TRAINER)
        trainer = existing.trainer;
      else if (!trainer)
        return validationFailed(
          res,
          "Trainer is required.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );
      
      if (!location)
        return validationFailed(
          res,
          "Location is required.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );
      if (!date || !time)
        return validationFailed(
          res,
          "Date and time are required.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );

      const start = ManageSessionsController.#fromInputDateTime(date, time);
      if (isNaN(start))
        return validationFailed(
          res,
          "Invalid date/time provided.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );

      await SessionModel.update({ id, activity, trainer, location, start });
      return res.redirect(res.locals.ROUTES.SESSIONS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to update session",
        error,
        `${res.locals.ROUTES.MANAGE_SESSION.getPath(id)} update`,
        res.locals.ROUTES.MANAGE_SESSION.name,
        res.locals.ROUTES.MANAGE_SESSION.getPath(id)
      );
    }
  }

  /**
   * Removes a booking from a session.
   * @type {express.RequestHandler}
   */
  static async removeBooking(req, res) {
    const id = parseId(req.params.id);
    const bookingId = parseId(req.params.bookingId);
    if (!id)
      return invalidId(
        res,
        "Session",
        res.locals.ROUTES.MANAGE_SESSION.name,
        res.locals.ROUTES.MANAGE_SESSION.getPath(id)
      );

    if (!bookingId)
      return invalidId(
        res,
        "Booking",
        res.locals.ROUTES.MANAGE_SESSION.name,
        res.locals.ROUTES.MANAGE_SESSION.getPath(id)
      );
    
    try {
      const existing = await SessionModel.getById(id);
      if (!existing)
        return notFound(
          res,
          "Session not found",
          res.locals.ROUTES.SESSIONS.name,
          res.locals.ROUTES.SESSIONS.getPath()
        );
      
      const authUser = res.locals.user;
      if (authUser?.role.toLowerCase() === UserRole.TRAINER) {
        if (existing.trainer !== authUser.id)
          return forbidden(
            res,
            "You may only modify bookings for your own sessions.",
            res.locals.ROUTES.SESSIONS.name,
            res.locals.ROUTES.SESSIONS.getPath()
          );
      }

      await BookingModel.delete(bookingId);
      return res.redirect(res.locals.ROUTES.MANAGE_SESSION.getPath(id));
    } catch (error) {
      if (error === "not found")
        return validationFailed(
          res,
          "Booking not found or already removed.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );
      
      return serverError(
        res,
        "Failed to remove booking",
        error,
        `${res.locals.ROUTES.MANAGE_SESSION.getPath(id)} remove booking`,
        res.locals.ROUTES.MANAGE_SESSION.name,
        res.locals.ROUTES.MANAGE_SESSION.getPath(id)
      );
    }
  }

  /**
   * Adds a booking to a session for a selected member.
   * @type {express.RequestHandler}
   */
  static async addBooking(req, res) {
    const id = parseId(req.params.id);
    if (id === null)
      return invalidId(
        res,
        "Session",
        res.locals.ROUTES.SESSIONS.name,
        res.locals.ROUTES.SESSIONS.getPath()
      );
    
    try {
      const existing = await SessionModel.getById(id);
      if (!existing)
        return notFound(
          res,
          "Session not found",
          res.locals.ROUTES.SESSIONS.name,
          res.locals.ROUTES.SESSIONS.getPath()
        );

      const authUser = res.locals.user;
      if (authUser?.role.toLowerCase() === UserRole.TRAINER) {
        if (existing.trainer !== authUser.id) {
          return forbidden(
            res,
            "You may only modify bookings for your own sessions.",
            res.locals.ROUTES.SESSIONS.name,
            res.locals.ROUTES.SESSIONS.getPath()
          );
        }
      }

      const memberId = parseId(req.body.member);
      if (memberId === null)
        return validationFailed(
          res,
          "Member is required.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );

      try {
        const memberUser = await UserModel.getById(memberId);
        if (memberUser.role !== UserRole.MEMBER)
          return validationFailed(
            res,
            "Selected user is not a member.",
            res.locals.ROUTES.MANAGE_SESSION.name,
            res.locals.ROUTES.MANAGE_SESSION.getPath(id)
          );
      } catch (error) {
        return validationFailed(
          res,
          "Selected member was not found.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );
      }

      await BookingModel.create({ member: memberId, session: id });
      return res.redirect(res.locals.ROUTES.MANAGE_SESSION.getPath(id));
    } catch (error) {
      if (error === "session full")
        return validationFailed(
          res,
          "This session is full.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );

      if (error === "already booked")
        return validationFailed(
          res,
          "Member is already booked for this session.",
          res.locals.ROUTES.MANAGE_SESSION.name,
          res.locals.ROUTES.MANAGE_SESSION.getPath(id)
        );

      return serverError(
        res,
        "Failed to add booking",
        error,
        `${res.locals.ROUTES.MANAGE_SESSION.getPath(id)} add booking`,
        res.locals.ROUTES.MANAGE_SESSION.name,
        res.locals.ROUTES.MANAGE_SESSION.getPath(id)
      );
    }
  }

  /**
   * Removes a session.
   * @type {express.RequestHandler}
   */
  static async removeSession(req, res) {
    const id = parseId(req.params.id);
    if (id === null)
      return invalidId(
        res,
        "Session",
        res.locals.ROUTES.SESSIONS.name,
        res.locals.ROUTES.SESSIONS.getPath()
      );

    try {
      const existing = await SessionModel.getById(id);
      if (!existing)
        return notFound(
          res,
          "Session not found",
          res.locals.ROUTES.SESSIONS.name,
          res.locals.ROUTES.SESSIONS.getPath()
        );
      const authUser = res.locals.user;
      if (authUser?.role.toLowerCase() === UserRole.TRAINER)
        if (existing.trainer !== authUser.id)
          return forbidden(
            res,
            "You may only delete sessions assigned to you.",
            res.locals.ROUTES.SESSIONS.name,
            res.locals.ROUTES.SESSIONS.getPath()
          );

      await SessionModel.delete(id);
      return res.redirect(res.locals.ROUTES.SESSIONS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to delete session",
        error,
        `${res.locals.ROUTES.MANAGE_SESSION.getPath(id)} delete`,
        res.locals.ROUTES.MANAGE_SESSION.name,
        res.locals.ROUTES.MANAGE_SESSION.getPath(id)
      );
    }
  }

  /**
   * Creates a new session.
   * @type {express.RequestHandler}
   */
  static async createSession(req, res) {
    try {
      const authUser = res.locals.user;
      const isTrainer = authUser?.role.toLowerCase() === UserRole.TRAINER;

      const activity = parseId(req.body.activity);
      let trainer = parseId(req.body.trainer);
      const location = parseId(req.body.location);
      const date = toTrimmed(req.body.date);
      const time = toTrimmed(req.body.time);

      if (!activity)
        return validationFailed(
          res,
          "Activity is required.",
          res.locals.ROUTES.CREATE_SESSION.name,
          res.locals.ROUTES.CREATE_SESSION.getPath()
        );
      
      if (!location)
        return validationFailed(
          res,
          "Location is required.",
          res.locals.ROUTES.CREATE_SESSION.name,
          res.locals.ROUTES.CREATE_SESSION.getPath()
        );

      if (!date || !time)
        return validationFailed(
          res,
          "Date and time are required.",
          res.locals.ROUTES.CREATE_SESSION.name,
          res.locals.ROUTES.CREATE_SESSION.getPath()
        );

      if (isTrainer)
        trainer = authUser.id;
      else
        if (!trainer)
          return validationFailed(
            res,
            "Trainer is required.",
            res.locals.ROUTES.CREATE_SESSION.name,
            res.locals.ROUTES.CREATE_SESSION.getPath()
          );

      const start = ManageSessionsController.#fromInputDateTime(date, time);
      if (isNaN(start))
        return validationFailed(
          res,
          "Invalid date/time provided.",
          res.locals.ROUTES.CREATE_SESSION.name,
          res.locals.ROUTES.CREATE_SESSION.getPath()
        );

      await SessionModel.create({ activity, trainer, location, start });

      return res.redirect(
        isTrainer ?
          res.locals.ROUTES.BOOKINGS.getPath() :
          res.locals.ROUTES.SESSIONS.getPath()
      );
    } catch (error) {
      return serverError(
        res,
        "Failed to create session",
        error,
        `${res.locals.ROUTES.CREATE_SESSION.getPath()} create`,
        res.locals.ROUTES.CREATE_SESSION.name,
        res.locals.ROUTES.CREATE_SESSION.getPath()
      );
    }
  }
}
