import express from "express";
import LocationModel from "../models/LocationModel.mjs";
import { serverError } from "./ControllerUtils.mjs";

/**
 * Manages the contact page.
 * This controller is responsible for displaying location information.
 */
export default class ContactController {
  static routes = express.Router();

  static {
    this.routes.get("/", this.viewContact);
  }

  /**
   * Renders the contact page.
   * It fetches and displays a list of all locations.
   * @type {express.RequestHandler}
   */
  static async viewContact(req, res) {
    try {
      const locations = await LocationModel.getAll();
      return res.status(200).render(
        res.locals.ROUTES.CONTACT.getView(),
        { locations }
      );
    } catch (err) {
      return serverError(
        res,
        "Failed to load contact page",
        err,
        `${res.locals.ROUTES.CONTACT.getPath()} error`
      );
    }
  }
}
