import express from "express";
import LocationModel from "../models/LocationModel.mjs";
import SessionDetailsModel from "../models/SessionDetailsModel.mjs";

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
  serverError,
  validationFailed,
} from "./ControllerUtils.mjs";
import BookingModel from "../models/BookingModel.mjs";
import AuthenticationController from "./AuthenticationController.mjs";
import { UserRole } from "../models/UserModel.mjs";

/**
 * Manages session viewing and booking.
 */
export default class SessionController {
    static routes = express.Router();

    static {
        this.routes.get("/", this.viewSessions);
        this.routes.get(
            "/book/:id",
            AuthenticationController.restrict(UserRole.MEMBER),
            this.handleBookSession
        );
    }

    /**
     * Renders the sessions page.
     * @type {express.RequestHandler}
     */
    static async viewSessions(req, res) {
        try {
            const { rawSearch, term, allSessions, locationFilter } = parseSessionQuery(req);

            const [details, locations] = await Promise.all([
                SessionDetailsModel.getAll(),
                LocationModel.getAll(),
            ]);

            const upcoming = allSessions ? details : filterUpcomingSessions(details);
            const byLocation = filterByLocation(upcoming, locationFilter);
            const bySearch = filterBySearchTerm(byLocation, term, formatDisplayDate);
            const sorted = sortByStart(bySearch);

            res.status(200).render(
                res.locals.ROUTES.SESSIONS.getView(),
                {
                    sessions: sorted,
                    searchTerm: rawSearch,
                    allSessions,
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
                "Failed to load sessions",
                error,
                `${res.locals.ROUTES.SESSIONS.getPath()} error`
            );
        }
    }

    /**
     * Creates a booking for a session.
     * @type {express.RequestHandler}
     */
    static async handleBookSession(req, res) {
        const user = res.locals.user;
        const sessionId = parseId(req.params?.id);
        if (!sessionId)
            return invalidId(
                res,
                "Session",
                res.locals.ROUTES.BOOKINGS.name,
                res.locals.ROUTES.BOOKINGS.getPath()
            );

        try {
            await BookingModel.create({ member: user.id, session: sessionId });
            return res.redirect(res.locals.ROUTES.BOOKINGS.getPath());
        } catch (error) {
            if (error === "session full")
                return validationFailed(
                    res,
                    "This session is already at full capacity.",
                    res.locals.ROUTES.BOOKINGS.name,
                    res.locals.ROUTES.BOOKINGS.getPath()
                );
            
            if (error === "already booked")
                return validationFailed(
                    res,
                    "You have already booked this session.",
                    res.locals.ROUTES.BOOKINGS.name,
                    res.locals.ROUTES.BOOKINGS.getPath()
                );
            
            return serverError(
                res,
                "Failed to complete booking. Please try again.",
                error,
                `${res.locals.ROUTES.BOOKINGS.getPath()} book`,
                res.locals.ROUTES.SESSIONS.name,
                res.locals.ROUTES.SESSIONS.getPath()
            );
        }
    }
}