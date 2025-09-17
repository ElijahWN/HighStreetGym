import express from "express";
import BookingModel from "../models/BookingModel.mjs";
import UserModel, { UserRole } from "../models/UserModel.mjs";
import BookingDetailsModel from "../models/BookingDetailsModel.mjs";
import SessionDetailsModel from "../models/SessionDetailsModel.mjs";
import {
  toTrimmed,
  parseId,
  invalidId,
  notFound,
  validationFailed,
  serverError,
  formatActivityName,
  formatDisplayDate
} from "./ControllerUtils.mjs";

/**
 * Manages bookings.
 */
export default class ManageBookingsController {
  static routes = express.Router();

  static {
    this.routes.get("/", this.view);
    this.routes.get("/:id", this.view);

    this.routes.post("/", this.create);
    this.routes.post("/:id", this.update);
    this.routes.post("/:id/delete", this.remove);
  }

  /**
   * Formats a booking details object for display in lists or options.
   * @param {BookingDetailsModel} bookingDetails
   * @returns {string}
   */
  static #formatBookingDetails(bookingDetails) {
    return `
      ${bookingDetails.member.firstName}
      ${bookingDetails.member.lastName}
      has booked the
      ${formatActivityName(bookingDetails.activity.name)}
      session with
      ${bookingDetails.trainer.firstName}
      ${bookingDetails.trainer.lastName}
      @
      ${formatDisplayDate(bookingDetails.session.start, true)}
      -
      ${bookingDetails.location.name}
    `.replace("\n", " ");
  }

  /**
   * Formats a session details object for display in dropdowns.
   * @param {SessionDetailsModel} sessionDetails
   * @returns {string}
   */
  static #formatSessionDetails(sessionDetails) {
    return `
      ${formatActivityName(sessionDetails.activity.name)}
      with
      ${sessionDetails.trainer.firstName}
      ${sessionDetails.trainer.lastName}
      @
      ${formatDisplayDate(sessionDetails.session.start, true)}
      -
      ${sessionDetails.location.name}
    `.replace("\n", " ");
  }

  /**
   * Renders the booking management page.
   * @type {express.RequestHandler}
   */
  static async view(req, res) {
    try {
      const searchRaw = toTrimmed(req.query.search);
      const term = searchRaw.toLowerCase();

      const [bookingDetailsSource, sessionDetails, users] = await Promise.all([
        BookingDetailsModel.getAll(),
        SessionDetailsModel.getAll(),
        UserModel.getAll()
      ]);

      // Start with all booking details
      let bookingDetails = bookingDetailsSource;

      // Search via blob string across many factors
      if (term) {
        bookingDetails = bookingDetails.filter(bookingDetail => {
          const when = formatDisplayDate(bookingDetail.session.start);

          const blob = `
            ${bookingDetail.booking.id}
            ${bookingDetail.member.username}
            ${bookingDetail.member.firstName}
            ${bookingDetail.member.lastName}
            ${bookingDetail.member.email}
            ${bookingDetail.activity.name}
            ${bookingDetail.trainer.firstName} ${bookingDetail.trainer.lastName}
            ${bookingDetail.location.name}
            ${when}
          `.toLowerCase();

          return blob.includes(term);
        });
      }

      // Sort by session start (fallback by booking id)
      bookingDetails = bookingDetails.slice().sort((leftBookingDetails, rightBookingDetails) => {
        const leftStart = leftBookingDetails.session.start.getTime();
        const rightStart = rightBookingDetails.session.start.getTime();
        return leftStart - rightStart || leftBookingDetails.booking.id - rightBookingDetails.booking.id;
      });

      // Optional single booking in focus
      const idParam = parseId(req.params.id);
      let bookingDetail = null;
      if (idParam) {
        try {
          bookingDetail = await BookingDetailsModel.getById(idParam);
        } catch (error) {
          return notFound(
            res,
            "Booking not found",
            res.locals.ROUTES.MANAGE_BOOKINGS.name,
            res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
          );
        }
      }

      // Build sessions for dropdown: all future, plus selected if past; sort by start
      const now = new Date();
      let sessionsSorted = sessionDetails.filter(sessionDetail => sessionDetail.session.start >= now);
      if (bookingDetail && bookingDetail.session.start < now && !sessionsSorted.find(sessionDetail => sessionDetail.session.id === bookingDetail.session.id)) {
        const selected = sessionDetails.find(sessionDetail => sessionDetail.session.id === bookingDetail.session.id);
        if (selected) sessionsSorted = [...sessionsSorted, selected];
      }
      sessionsSorted = sessionsSorted.sort((leftSessionDetails, rightSessionDetails) => leftSessionDetails.session.start - rightSessionDetails.session.start);

      // Sort users by name
      const usersSorted = users.slice().sort((leftUser, rightUser) => {
        const leftName = (`${leftUser.firstName} ${leftUser.lastName}`.trim() || leftUser.username);
        const rightName = (`${rightUser.firstName} ${rightUser.lastName}`.trim() || rightUser.username);
        return leftName.localeCompare(rightName);
      });

      return res.status(200).render(
        res.locals.ROUTES.MANAGE_BOOKINGS.getView(),
        {
          bookingDetails,
          bookingDetail,
          users: usersSorted,
          sessions: sessionsSorted,
          search: searchRaw,
          formatBookingDetails: ManageBookingsController.#formatBookingDetails,
          formatSessionDetails: ManageBookingsController.#formatSessionDetails
        }
      );
    } catch (error) {
      return serverError(
        res,
        "Failed to load bookings",
        error,
        `${res.locals.ROUTES.MANAGE_BOOKINGS.getPath()} error`,
        res.locals.ROUTES.DASHBOARD.name,
        res.locals.ROUTES.DASHBOARD.getPath()
      );
    }
  }

  /**
   * Creates a new booking.
   * @type {express.RequestHandler}
   */
  static async create(req, res) {
    try {
      const member = parseId(req.body.member);
      const sessionId = parseId(req.body.session);

      if (!member)
        return validationFailed(
          res,
          "Member is required.",
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
        );
      if (!sessionId)
        return validationFailed(
          res,
          "Session is required.",
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
        );

      // Validate member is a member
      try {
        const memberUser = await UserModel.getById(member);
        if (memberUser.role !== UserRole.MEMBER)
          return validationFailed(
            res,
            "Selected user is not a member.",
            res.locals.ROUTES.MANAGE_BOOKINGS.name,
            res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
          );
      } catch (error) {
        return validationFailed(
          res,
          "Selected member was not found.",
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
        );
      }

      try {
        await BookingModel.create({ member, session: sessionId });
        return res.redirect(res.locals.ROUTES.MANAGE_BOOKINGS.getPath());
      } catch (error) {
        if (error === "session full")
          return validationFailed(
            res,
            "This session is full.",
            res.locals.ROUTES.MANAGE_BOOKINGS.name,
            res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
          );
        if (error === "already booked")
          return validationFailed(
            res,
            "Member is already booked for this session.",
            res.locals.ROUTES.MANAGE_BOOKINGS.name,
            res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
          );
        return serverError(
          res,
          "Failed to create booking",
          error,
          `${res.locals.ROUTES.MANAGE_BOOKINGS.getPath()} create`,
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
        );
      }
    } catch (error) {
      return serverError(
        res,
        "Failed to create booking",
        error,
        `${res.locals.ROUTES.MANAGE_BOOKINGS.getPath()} create`,
        res.locals.ROUTES.MANAGE_BOOKINGS.name,
        res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
      );
    }
  }

  /**
   * Updates an existing booking by creating the new pair then deleting the old.
   * @type {express.RequestHandler}
   */
  static async update(req, res) {
    const id = parseId(req.params.id);
    if (id === null)
      return invalidId(
        res,
        "Booking",
        res.locals.ROUTES.MANAGE_BOOKINGS.name,
        res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
      );

    try {
      const existing = await BookingModel.getById(id);

      const newMember = parseId(req.body.member);
      const newSessionId = parseId(req.body.session);
      if (!newMember || !newSessionId)
        return validationFailed(
          res,
          "Member and session are required.",
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
        );

      // Early exit if no changes
      if (existing.member === newMember && existing.session === newSessionId)
        return res.redirect(res.locals.ROUTES.MANAGE_BOOKINGS.getPath());

      // Validate member is a member
      try {
        const memberUser = await UserModel.getById(newMember);
        if (memberUser.role !== UserRole.MEMBER)
          return validationFailed(
            res,
            "Selected user is not a member.",
            res.locals.ROUTES.MANAGE_BOOKINGS.name,
            res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
          );
      } catch (error) {
        return validationFailed(
          res,
          "Selected member was not found.",
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
        );
      }

      try {
        // Create new then delete old to respect capacity and unique constraints
        await BookingModel.create({ member: newMember, session: newSessionId });
        await BookingModel.delete(id);
        return res.redirect(res.locals.ROUTES.MANAGE_BOOKINGS.getPath());
      } catch (error) {
        if (error === "session full")
          return validationFailed(
            res,
            "This session is full.",
            res.locals.ROUTES.MANAGE_BOOKINGS.name,
            res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
          );
        if (error === "already booked")
          return validationFailed(
            res,
            "Member is already booked for this session.",
            res.locals.ROUTES.MANAGE_BOOKINGS.name,
            res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
          );
        return serverError(
          res,
          "Failed to update booking",
          error,
          `${res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)} update`,
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
        );
      }
    } catch (error) {
      return serverError(
        res,
        "Failed to update booking",
        error,
        `${res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)} update`,
        res.locals.ROUTES.MANAGE_BOOKINGS.name,
        res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
      );
    }
  }

  /**
   * Removes a booking.
   * @type {express.RequestHandler}
   */
  static async remove(req, res) {
    const id = parseId(req.params.id);
    if (id === null)
      return invalidId(
        res,
        "Booking",
        res.locals.ROUTES.MANAGE_BOOKINGS.name,
        res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
      );

    try {
      await BookingModel.delete(id);
      return res.redirect(res.locals.ROUTES.MANAGE_BOOKINGS.getPath());
    } catch (error) {
      if (error === "not found")
        return notFound(
          res,
          "Booking not found",
          res.locals.ROUTES.MANAGE_BOOKINGS.name,
          res.locals.ROUTES.MANAGE_BOOKINGS.getPath()
        );

      return serverError(
        res,
        "Failed to delete booking",
        error,
        `${res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)} delete`,
        res.locals.ROUTES.MANAGE_BOOKINGS.name,
        res.locals.ROUTES.MANAGE_BOOKINGS.getPath(id)
      );
    }
  }
}
