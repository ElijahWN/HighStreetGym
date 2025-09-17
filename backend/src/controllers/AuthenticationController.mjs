import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import UserModel, { UserRole } from "../models/UserModel.mjs";
import { toTrimmed, validationFailed, serverError, forbidden, renderStatus } from "./ControllerUtils.mjs";

export default class AuthenticationController {
    static middleware = express.Router();
    static routes = express.Router();
    static saltRounds = 10;

    static {
        this.middleware.use(
            session({
                secret: "f847241e-7eb0-4ca0-b97a-b48e37483737",
                resave: false,
                saveUninitialized: false,
                cookie: { secure: "auto" },
            })
        );
        this.middleware.use(this.#session_authentication);

        this.routes.get("/login", this.viewLogin);
        this.routes.post("/login", this.handleLogin);

        this.routes.get("/register", this.viewRegister);
        this.routes.post("/register", this.handleRegister);

        this.routes.delete("/", this.handleLogout);
        this.routes.get(
            "/logout",
            this.restrict(UserRole.ADMIN, UserRole.TRAINER, UserRole.MEMBER),
            this.handleLogout
        );
    }

    /**
     * Authenticates a user from their session.
     * @type {express.RequestHandler}
     */
    static async #session_authentication(req, res, next) {
        if (req.session.userId && !res.locals.user) {
            try {
                res.locals.user = await UserModel.getById(req.session.userId);
            } catch (error) {
                console.error(error);
            }
        } else res.locals.user = undefined;
        
        next();
    }

    /**
     * Validates and normalizes registration input.
     * @param {any} body The request body.
     * @returns {{valid: boolean, message?: string, data?: any}} The validation result.
     */
    static #validateRegisterInput(body) {
        const username = toTrimmed(body.username);
        const firstName = toTrimmed(body.firstName);
        const lastName = toTrimmed(body.lastName);
        const birthday = new Date(body.birthday);
        const email = toTrimmed(body.email).toLowerCase();
        const password = toTrimmed(body.password);
    
        if (
            !username ||
            !firstName ||
            !lastName ||
            !email ||
            !password
        ) {
            return {
                valid: false,
                message: "All fields except birthday are required"
            };
        }
    
        const usernameRegex = /^[A-Za-z][A-Za-z0-9_\.]{2,19}$/;
        const nameRegex = /^[A-Za-z][A-Za-z'\- ]{1,49}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/;
    
        if (!usernameRegex.test(username)) {
            return {
                valid: false,
                message: "Username must be 3-20 characters, start with a letter, and contain only letters, numbers, or underscores"
            };
        }
        if (!nameRegex.test(firstName)) {
            return {
                valid: false,
                message: "First name must be 2-50 letters and may include spaces, hyphens, or apostrophes"
            };
        }
        if (!nameRegex.test(lastName)) {
            return {
                valid: false,
                message: "Last name must be 2-50 letters and may include spaces, hyphens, or apostrophes"
            };
        }
        if (!emailRegex.test(email)) {
            return {
                valid: false,
                message: "Please enter a valid email address"
            };
        }
        if (!passwordRegex.test(password)) {
            return {
                valid: false,
                message: "Password must be 8+ characters and include at least one letter and one number"
            };
        }
        if (!(birthday instanceof Date)) {
            return {
                valid: false,
                message: "Birthday is required"
            };
        }
    
        return {
            valid: true,
            data: {
                username,
                firstName,
                lastName,
                birthday,
                email,
                password,
            },
        };
    }

    /**
     * Authenticates a user from an API key.
     * @type {express.RequestHandler}
     */
    static async #api_key_authentication(req, res, next) {}

    /**
     * Renders the login page.
     * @type {express.RequestHandler}
     */
    static viewLogin(req, res) {
        if (res.locals.user)
            return res.redirect(res.locals.ROUTES.DASHBOARD.getPath());

        res.render(res.locals.ROUTES.LOGIN.getView());
    }

    /**
     * Handles the login process.
     * It validates credentials and creates a session.
     * @type {express.RequestHandler}
     */
    static async handleLogin(req, res) {
        const contentType = req.get("Content-Type");

        const { email, password } = req.body;

        if (contentType == "application/x-www-form-urlencoded") {
            try {
                const user = await UserModel.getByEmail(email);

                if (!user.password.startsWith("$2b")) {
                    user.password = await bcrypt.hash(user.password, AuthenticationController.saltRounds);
                    await UserModel.update(user);
                }

                const isCorrectPassword = await bcrypt.compare(password, user.password);

                if (isCorrectPassword) {
                    req.session.userId = user.id;
                    res.redirect(res.locals.ROUTES.DASHBOARD.getPath());
                } else {
                    return validationFailed(
                        res,
                        "Invalid credentials",
                        res.locals.ROUTES.LOGIN.name,
                        res.locals.ROUTES.LOGIN.getPath()
                    );
                }
            } catch (error) {
                console.error(error);
                if (error == "not found") {
                    return validationFailed(
                        res,
                        "Invalid credentials",
                        res.locals.ROUTES.LOGIN.name,
                        res.locals.ROUTES.LOGIN.getPath()
                    )
                } else {
                    console.log(error);
                    return serverError(
                        res,
                        "Database error, authentication failed",
                        error,
                        `${res.locals.ROUTES.LOGIN.getPath()} error`,
                        res.locals.ROUTES.LOGIN.name,
                        res.locals.ROUTES.LOGIN.getPath()
                    );
                }
            }
        } else if (contentType == "application/json") {
            // TODO: Implement API key based authentication
        } else {
            return validationFailed(
                res,
                "Invalid authentication request body",
                res.locals.ROUTES.LOGIN.name,
                res.locals.ROUTES.LOGIN.getPath()
            );
        }
    }

    /**
     * Renders the registration page.
     * @type {express.RequestHandler}
     */
    static viewRegister(req, res) {
        if (res.locals.user)
            return res.redirect(res.locals.ROUTES.DASHBOARD.getPath());
        res.render(res.locals.ROUTES.REGISTER.getView());
    }

    /**
     * Handles the registration process.
     * It validates user input and creates a new user.
     * @type {express.RequestHandler}
     */
    static async handleRegister(req, res) {
        try {
            const validator = AuthenticationController.#validateRegisterInput(req.body);
            if (!validator.valid)
                return validationFailed(
                    res,
                    validator.message,
                    res.locals.ROUTES.REGISTER.name,
                    res.locals.ROUTES.REGISTER.getPath()
                );

            const {
                username,
                firstName,
                lastName,
                birthday,
                email,
                password
            } = validator.data;

            try {
                await UserModel.ensureUniqueUsernameEmail(username, email);
            } catch {
                return validationFailed(
                    res,
                    "Username or email already in use.",
                    res.locals.ROUTES.REGISTER.name,
                    res.locals.ROUTES.REGISTER.getPath()
                );
            }

            const hashedPassword = await bcrypt.hash(password, AuthenticationController.saltRounds);
            const user = new UserModel(
                null,
                UserRole.MEMBER,
                username,
                firstName,
                lastName,
                birthday,
                email,
                hashedPassword
            );
            user.id = (await UserModel.create(user)).insertId;

            req.session.userId = user.id;

            return res.redirect(res.locals.ROUTES.DASHBOARD.getPath());
        } catch (error) {
            return serverError(
                res,
                "Failed to register user",
                error,
                `${res.locals.ROUTES.REGISTER.getPath()} error`,
                res.locals.ROUTES.REGISTER.name,
                res.locals.ROUTES.REGISTER.getPath()
            );
        }
    }

    /**
     * Handles the logout process.
     * It destroys the user session.
     * @type {express.RequestHandler}
     */
    static handleLogout(req, res) {
        if (res.locals.user) {
            if (req.session.userId) {
                req.session.destroy((error) => {
                    if (error) {
                        console.error(error);
                        return serverError(
                            res,
                            "Failed to logout",
                            error,
                            `${res.locals.ROUTES.LOGOUT.getPath()} error`,
                            res.locals.ROUTES.DASHBOARD.name,
                            res.locals.ROUTES.DASHBOARD.getPath()
                        );
                    }

                    // This is required to have the header be updated
                    // when the status page is loaded.
                    res.locals.user = res.locals.user = undefined;
                    return renderStatus(
                        res,
                        200,
                        "Logged out",
                        "You have been logged out"
                    );
                });
            }
        } else {
            return forbidden(
                res,
                "Please login to access the requested resource",
                res.locals.ROUTES.LOGIN.name,
                res.locals.ROUTES.LOGIN.getPath()
            );
        }

    }

    /**
     * Restricts access to a route based on user roles.
     * @param {...string} allowedRoles A list of allowed roles.
     * @returns {express.RequestHandler} A middleware function.
     */
    static restrict(...allowedRoles) {
        return (req, res, next) => {
            if (res.locals.user) {
                if (allowedRoles.includes(res.locals.user.role))
                    next();
                else
                    return forbidden(
                        res,
                        "Role does not have access to the requested resource",
                        res.locals.ROUTES.DASHBOARD.name,
                        res.locals.ROUTES.DASHBOARD.getPath()
                    );
            } else {
                return forbidden(
                    res,
                    "Please login to access the requested resource",
                    res.locals.ROUTES.LOGIN.name,
                    res.locals.ROUTES.LOGIN.getPath()
                );
            }
        }
    }
}
