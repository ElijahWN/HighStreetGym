import express from "express";
import { UserRole } from "../models/UserModel.mjs";
import SessionDetailsModel from "../models/SessionDetailsModel.mjs";
import LocationModel from "../models/LocationModel.mjs";
import BookingModel from "../models/BookingModel.mjs";
import AuthenticationController from "./AuthenticationController.mjs";
import {
  parseSessionQuery,
  filterUpcomingSessions,
  filterByLocation,
  filterBySearchTerm,
  sortByStart,
  formatActivityName,
  formatDisplayDate,
  timeUntil,
  parseId,
  invalidId,
  renderStatus,
  serverError,
} from "./ControllerUtils.mjs";

/**
 * Manages the bookings page.
 * This controller handles viewing and canceling bookings.
 * It displays sessions relevant to the authenticated user.
 */
export default class BookingController {
  static routes = express.Router();

  static {
    this.routes.get(
      "/",
      AuthenticationController.restrict(UserRole.MEMBER, UserRole.TRAINER),
      this.viewBookings
    );
    this.routes.get(
      "/cancel/:id",
      AuthenticationController.restrict(UserRole.MEMBER),
      this.cancelBooking
    );
  }

  /**
   * Renders the bookings page.
   * It displays a list of sessions relevant to the user.
   * @type {express.RequestHandler}
   */
  static async viewBookings(req, res) {
    try {
      const user = res.locals.user;

      const { rawSearch, term, locationFilter } = parseSessionQuery(req);

      const [sessionDetailsList, locations] = await Promise.all([
        SessionDetailsModel.getAll(),
        LocationModel.getAll(),
      ]);

      let relevantSessionDetails = sessionDetailsList;
      if (user.role === UserRole.MEMBER)
        relevantSessionDetails = sessionDetailsList.filter((sessionDetails) => sessionDetails.bookings.some((bookingUser) => bookingUser.id === user.id));
      else if (user.role === UserRole.TRAINER)
        relevantSessionDetails = sessionDetailsList.filter((sessionDetails) => sessionDetails.trainer.id === user.id);

      const upcomingSessionDetails = filterUpcomingSessions(relevantSessionDetails);
      const filteredByLocationSessionDetails = filterByLocation(upcomingSessionDetails, locationFilter);
      const filteredBySearchSessionDetails = filterBySearchTerm(filteredByLocationSessionDetails, term, formatDisplayDate);
      const sortedSessionDetails = sortByStart(filteredBySearchSessionDetails);

      res.status(200).render(
        res.locals.ROUTES.BOOKINGS.getView(),
        {
          sessions: sortedSessionDetails,
          searchTerm: rawSearch,
          locationFilter,
          locations,
          formatActivityName,
          formatDate: formatDisplayDate,
          timeUntil,
        }
    );

    } catch (error) {
      return serverError(
        res,
        "Failed to load bookings",
        error,
        `${res.locals.ROUTES.BOOKINGS.getPath()} error`,
        res.locals.ROUTES.DASHBOARD.name,
        res.locals.ROUTES.DASHBOARD.getPath()
      );
    }
  }

  /**
   * Cancels a booking for a session.
   * The user must be a member to cancel a booking.
   * @type {express.RequestHandler}
   */
  static async cancelBooking(req, res) {
    try {
      const user = res.locals.user;
      const sessionId = parseId(req.params?.id);
      if (!sessionId)
        return invalidId(
          res,
          "Session",
          res.locals.ROUTES.BOOKINGS.name,
          res.locals.ROUTES.BOOKINGS.getPath()
        );

      await BookingModel.deleteByMemberAndSession(user.id, sessionId);
      return res.redirect(res.locals.ROUTES.BOOKINGS.getPath());
    } catch (error) {
      if (error === "not found")
        return renderStatus(
          res,
          400,
          "Cancel failed",
          "No booking found for this session.",
          res.locals.ROUTES.BOOKINGS.name,
          res.locals.ROUTES.BOOKINGS.getPath()
        );
      
      return serverError(
        res,
        "Failed to cancel booking. Please try again.",
        error,
        `${res.locals.ROUTES.BOOKINGS_CANCEL.getPath()} error`,
        res.locals.ROUTES.BOOKINGS.name,
        res.locals.ROUTES.BOOKINGS.getPath()
      );
    }
  }
}
