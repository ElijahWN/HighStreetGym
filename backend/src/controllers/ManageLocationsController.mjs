import express from "express";
import LocationModel from "../models/LocationModel.mjs";
import {
  parseId,
  invalidId,
  serverError,
  validationFailed,
  toTrimmed,
  notFound
} from "./ControllerUtils.mjs";

/**
 * Manages locations.
 */
export default class ManageLocationsController {
  static routes = express.Router();

  static {
    this.routes.get("/", this.view);
    this.routes.get("/:id", this.view);
    this.routes.post("/", this.create);
    this.routes.post("/:id", this.update);
    this.routes.post("/:id/delete", this.remove);
  }

  /**
   * Renders the location management page.
   * @type {express.RequestHandler}
   */
  static async view(req, res) {
    try {
      const searchRaw = toTrimmed(req.query.search);
      const query = searchRaw.toLowerCase();

      const locations = await LocationModel.getAll();
      let filteredLocations = locations;
      if (query)
        filteredLocations = filteredLocations.filter((location) => location?.name?.toLowerCase().includes(query));

      const idParam = parseId(req.params.id);
      let location = null;
      if (idParam !== null) {
        try {
          location = await LocationModel.getById(idParam);
        } catch (error) {
          return notFound(
            res,
            "Location not found",
            res.locals.ROUTES.MANAGE_LOCATIONS.name,
            res.locals.ROUTES.MANAGE_LOCATIONS.getPath()
          );
        }
      }

      return res.status(200).render(
        res.locals.ROUTES.MANAGE_LOCATIONS.getView(),
        {
          locations: filteredLocations,
          location,
          search: searchRaw,
        }
      );
    } catch (error) {
      return serverError(
        res,
        "Failed to load locations.",
        error,
        `${res.locals.ROUTES.MANAGE_LOCATIONS.getPath()} error`,
        res.locals.ROUTES.DASHBOARD.name,
        res.locals.ROUTES.DASHBOARD.getPath()
      );
    }
  }

  /**
   * Creates a new location.
   * @type {express.RequestHandler}
   */
  static async create(req, res) {
    try {
      const location = new LocationModel(
        null,
        req.body.name,
        req.body.description,
        req.body.address,
        req.body.availability
      );
      if (!location.name)
        return validationFailed(
          res,
          "Location name is required.",
          res.locals.ROUTES.MANAGE_LOCATIONS.name,
          res.locals.ROUTES.MANAGE_LOCATIONS.getPath()
        );
        
      await LocationModel.create(location);
      return res.redirect(res.locals.ROUTES.MANAGE_LOCATIONS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to create location",
        error,
        `${res.locals.ROUTES.MANAGE_LOCATIONS.getPath()} create`,
        res.locals.ROUTES.MANAGE_LOCATIONS.name,
        res.locals.ROUTES.MANAGE_LOCATIONS.getPath()
      );
    }
  }

  /**
   * Updates an existing location.
   * @type {express.RequestHandler}
   */
  static async update(req, res) {
    const id = parseId(req.params.id);
    if (!id)
      return invalidId(
        res,
        "Location",
        res.locals.ROUTES.MANAGE_LOCATIONS.name,
        res.locals.ROUTES.MANAGE_LOCATIONS.getPath()
      );

    try {
      const location = new LocationModel(
        id,
        req.body.name,
        req.body.description,
        req.body.address,
        req.body.availability
      );
      if (!location.name)
        return validationFailed(
          res,
          "Location name is required.",
          res.locals.ROUTES.MANAGE_LOCATIONS.name,
          res.locals.ROUTES.MANAGE_LOCATIONS.getPath(id)
        );

      await LocationModel.update(location);
      return res.redirect(res.locals.ROUTES.MANAGE_LOCATIONS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to update location",
        error,
        `${res.locals.ROUTES.MANAGE_LOCATIONS.getPath(id)} update`,
        res.locals.ROUTES.MANAGE_LOCATIONS.name,
        res.locals.ROUTES.MANAGE_LOCATIONS.getPath(id)
      );
    }
  }

  /**
   * Removes a location.
   * @type {express.RequestHandler}
   */
  static async remove(req, res) {
    const id = parseId(req.params.id);
    if (!id)
      return invalidId(
        res,
        "Location",
        res.locals.ROUTES.MANAGE_LOCATIONS.name,
        res.locals.ROUTES.MANAGE_LOCATIONS.getPath()
      );

    try {
      await LocationModel.delete(id);
      return res.redirect(res.locals.ROUTES.MANAGE_LOCATIONS.getPath());
    } catch (error) {
      return serverError(
        res,
        "Failed to remove location",
        error,
        `${res.locals.ROUTES.MANAGE_LOCATIONS.getPath(id)} remove`,
        res.locals.ROUTES.MANAGE_LOCATIONS.name,
        res.locals.ROUTES.MANAGE_LOCATIONS.getPath(id)
      );
    }
  }
}
