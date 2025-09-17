import express from "express";
import ActivityModel from "../models/ActivityModel.mjs";
import {
  parseId,
  invalidId,
  serverError,
  validationFailed,
  toTrimmed,
  notFound
} from "./ControllerUtils.mjs";

/**
 * Manages activities.
 */
export default class ManageActivitiesController {
  static routes = express.Router();

  static {
    this.routes.get("/", this.view);
    this.routes.get("/:id", this.view);
    
    this.routes.post("/", this.create);
    this.routes.post("/:id", this.update);
    this.routes.post("/:id/delete", this.remove);

    this.routes.delete("/:id", this.remove);
  }

  /**
   * Normalizes capacity to a positive integer.
   * @param {any} value The value to normalize.
   * @param {number} fallback= A fallback value.
   * @returns {number} A normalized capacity.
   * @private
   */
  static #normalizeCapacity(value, fallback = 6) {
    const number = Number(value);

    return Number.isFinite(number) && number > 0
      ? Math.floor(number)
      : fallback;
  }

  /**
   * Normalizes duration hours to a positive number, rounding to the nearest 0.25h.
   * @param {any} value The value to normalize.
   * @param {number} fallback A fallback value.
   * @returns {number}
   */
  static #normalizeHours(value, fallback = 1) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return fallback;
    
    // round to nearest quarter hour to keep minutes clean
    return Math.round(num * 4) / 4;
  }

  /**
   * Renders the activity management page.
   * @type {express.RequestHandler}
   */
  static async view(req, res) {
    try {
      const searchRaw = toTrimmed(req.query.search);
      const query = searchRaw.toLowerCase();
      const activities = await ActivityModel.getAll();

      let filteredActivities = activities;
      if (query)
        filteredActivities = filteredActivities.filter((activity) => activity?.name?.toLowerCase().includes(query));

      const idParam = parseId(req.params.id);
      let activity = null;
      if (idParam) {
        try {
          activity = await ActivityModel.getById(idParam);
        } catch (error) {
          return notFound(
            res,
            "Activity not found",
            res.locals.ROUTES.MANAGE_ACTIVITIES.name,
            res.locals.ROUTES.MANAGE_ACTIVITIES.getPath()
          );
        }
      }
      return res.status(200).render(
        res.locals.ROUTES.MANAGE_ACTIVITIES.getView(),
        {
          activities: filteredActivities,
          activity,
          search: searchRaw
        }
      );
    } catch (error) {
      return serverError(
        res,
        "Failed to load activities",
        error,
        `${res.locals.ROUTES.MANAGE_ACTIVITIES.getPath()} error`,
        res.locals.ROUTES.DASHBOARD.name,
        res.locals.ROUTES.DASHBOARD.getPath()
      );
    }
  }

  /**
   * Creates a new activity.
   * @type {express.RequestHandler}
   */
  static async create(req, res) {
    try {
      const name = toTrimmed(req.body.name);
      const description = toTrimmed(req.body.description);
      const capacity = ManageActivitiesController.#normalizeCapacity(req.body.capacity, 6);
      const duration = ManageActivitiesController.#normalizeHours(req.body.duration, 1);
      const activity = new ActivityModel(null, name, description, capacity, duration);

      if (!activity.name)
        return validationFailed(
          res,
          "Activity name is required.",
          res.locals.ROUTES.MANAGE_ACTIVITIES.name,
          res.locals.ROUTES.MANAGE_ACTIVITIES.getPath()
        );

      await ActivityModel.create(activity);
      return res.redirect(res.locals.ROUTES.MANAGE_ACTIVITIES.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to create activity",
        error,
        `${res.locals.ROUTES.MANAGE_ACTIVITIES.getPath()} create`,
        res.locals.ROUTES.MANAGE_ACTIVITIES.name,
        res.locals.ROUTES.MANAGE_ACTIVITIES.getPath()
      );
    }
  }

  /**
   * Updates an existing activity.
   * @type {express.RequestHandler}
   */
  static async update(req, res) {
    const id = parseId(req.params.id);
    if (!id)
      return invalidId(
        res,
        "Activity",
        res.locals.ROUTES.MANAGE_ACTIVITIES.name,
        res.locals.ROUTES.MANAGE_ACTIVITIES.getPath()
      );

    try {
      const name = toTrimmed(req.body.name);
      const description = toTrimmed(req.body.description);
      const capacity = ManageActivitiesController.#normalizeCapacity(req.body.capacity, 6);
      const duration = ManageActivitiesController.#normalizeHours(req.body.duration, 1);
      const activity = new ActivityModel(id, name, description, capacity, duration);

      if (!activity.name)
        return validationFailed(
          res,
          "Activity name is required.",
          res.locals.ROUTES.MANAGE_ACTIVITIES.name,
          res.locals.ROUTES.MANAGE_ACTIVITIES.getPath(id)
        );

      await ActivityModel.update(activity);
      
      return res.redirect(res.locals.ROUTES.MANAGE_ACTIVITIES.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to update activity",
        error,
        `${res.locals.ROUTES.MANAGE_ACTIVITIES.getPath(id)} update`,
        res.locals.ROUTES.MANAGE_ACTIVITIES.name,
        res.locals.ROUTES.MANAGE_ACTIVITIES.getPath(id)
      );
    }
  }

  /**
   * Removes an activity.
   * @type {express.RequestHandler}
   */
  static async remove(req, res) {
    const id = parseId(req.params.id);
    if (!id)
      return invalidId(
        res,
        "Activity",
        res.locals.ROUTES.MANAGE_ACTIVITIES.name,
        res.locals.ROUTES.MANAGE_ACTIVITIES.getPath()
      );

    try {
      await ActivityModel.delete(id);
      return res.redirect(res.locals.ROUTES.MANAGE_ACTIVITIES.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to delete activity",
        error,
        `${res.locals.ROUTES.MANAGE_ACTIVITIES.getPath(id)} delete`,
        res.locals.ROUTES.MANAGE_ACTIVITIES.name,
        res.locals.ROUTES.MANAGE_ACTIVITIES.getPath(id)
      );
    }
  }
}

