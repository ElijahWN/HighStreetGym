import express from "express";
import AuthenticationController from "./AuthenticationController.mjs";
import { UserRole } from "../models/UserModel.mjs";
import ManageActivitiesController from "./ManageActivitiesController.mjs";
import ManageLocationsController from "./ManageLocationsController.mjs";
import ManageUsersController from "./ManageUsersController.mjs";
import ManageSessionsController from "./ManageSessionsController.mjs";
import ManageBookingsController from "./ManageBookingsController.mjs";

/**
 * Routes management pages.
 */
export default class ManageController {
  static routes = express.Router();

  static {
    this.routes.use(
      "/activities",
      AuthenticationController.restrict(UserRole.ADMIN),
      ManageActivitiesController.routes
    );
    this.routes.use(
      "/locations",
      AuthenticationController.restrict(UserRole.ADMIN),
      ManageLocationsController.routes
    );
    this.routes.use(
      "/users",
      AuthenticationController.restrict(UserRole.ADMIN),
      ManageUsersController.routes
    );
    this.routes.use(
      "/bookings",
      AuthenticationController.restrict(UserRole.ADMIN),
      ManageBookingsController.routes
    );
    this.routes.use(
      "/session",
      AuthenticationController.restrict(UserRole.ADMIN, UserRole.TRAINER),
      ManageSessionsController.routes
    );
  }
}
