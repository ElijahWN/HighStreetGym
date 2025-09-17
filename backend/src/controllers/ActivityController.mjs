import express from "express";
import SessionModel from "../models/SessionModel.mjs";
import ActivityModel from "../models/ActivityModel.mjs";
import DatabaseModel from "../models/DatabaseModel.mjs";
import { serverError } from "./ControllerUtils.mjs";

export default class ActivityController {
    static routes = express.Router();

    static {
        this.routes.get("/", this.viewActivities);
    }

    /**
     * Formats a date object into a time string.
     * @param {Date} date The date to format.
     * @returns {string} A formatted time string.
     */
    static #toTime(date) {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours; 
        return `${hours}:${minutes} ${ampm}`;
    };

    /**
     * Populates a map with session times for each activity.
     * @param {ActivityModel[]} allActivities A list of all activities.
     * @param {SessionDetailsModel[]} sessions A list of all sessions.
     * @param {string[]} days An array of day names.
     * @returns {Map<string, any>} A map of activities.
     */
    static #populateActivityMap(allActivities, sessions, days) {
        const activityMap = new Map();
        
        allActivities.forEach((activity) => {
            activityMap.set(activity.name, { name: activity.name, cells: {} });
        });

        sessions.forEach((session) => {
            const sessionStart = session.start;
            const dayOfWeek = days[(sessionStart.getDay() + 6) % 7];
            const timeText = this.#toTime(sessionStart);
            
            if (activityMap.has(session.activityName)) {
                const row = activityMap.get(session.activityName);
                if (row.cells[dayOfWeek]) {
                    row.cells[dayOfWeek] += `, ${timeText}`;
                } else {
                    row.cells[dayOfWeek] = timeText;
                }
            }
        });
        return activityMap;
    }

    /**
     * Renders the activities page.
     * This page displays a weekly timetable of sessions.
     * @type {express.RequestHandler}
     */
    static async viewActivities(req, res) {
        try {
            const today = new Date();

            const monday = new Date(today);
            monday.setDate(today.getDate() - today.getDay() + 1);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            const start = DatabaseModel.toMySqlDateTime(monday);
            const end = DatabaseModel.toMySqlDateTime(sunday);
    
            const sessions = await SessionModel.getForWeekWithDetails(start, end);
            const allActivities = await ActivityModel.getAll();
            const activitiesForCards = allActivities.sort((leftActivity, rightActivity) => leftActivity.id - rightActivity.id);
    
            const days = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ];
    
            const activityMap = ActivityController.#populateActivityMap(allActivities, sessions, days);
    
            const rows = Array.from(activityMap.values()).sort((leftRow, rightRow) =>
                leftRow.name.localeCompare(rightRow.name)
            );
    
            const weekLabel = `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
    
            return res.status(200).render(
                res.locals.ROUTES.ACTIVITIES.getView(),
                {
                    days,
                    rows,
                    weekLabel,
                    activities: activitiesForCards
                }
            );
        } catch (error) {
            return serverError(
                res,
                "Failed to load activities page",
                error,
                `${res.locals.ROUTES.ACTIVITIES.getPath()} error`
            );
        }
    }
}
