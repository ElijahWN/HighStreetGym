import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import AuthenticationController from "./controllers/AuthenticationController.mjs";
import MicroblogController from "./controllers/MicroblogController.mjs";
import ActivityController from "./controllers/ActivityController.mjs";
import SessionController from "./controllers/SessionController.mjs";
import BookingController from "./controllers/BookingController.mjs";
import DashboardController from "./controllers/DashboardController.mjs";
import ManageController from "./controllers/ManageController.mjs";
import ContactController from "./controllers/ContactController.mjs";
import RouterController from "./controllers/RouterController.mjs";
import { notFound, renderStatus } from "./controllers/ControllerUtils.mjs";

const app = express();
const PORT = process.env.BACKEND_PORT;

// TODO: Enable session middleware

app.set("view engine", "ejs");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(AuthenticationController.middleware);
app.use(RouterController.middleware);

// Routes

// These are routes with no logic
// and thus have no controller
app.get("/", (req, res) => res.status(200).render(res.locals.ROUTES.HOME.getView()));
app.get("/about", (req, res) => res.status(200).render(res.locals.ROUTES.ABOUT.getView()));
app.get("/privacy", (req, res) => res.status(200).render(res.locals.ROUTES.PRIVACY_POLICY.getView()));
app.get("/tos", (req, res) => res.status(200).render(res.locals.ROUTES.TERMS_OF_SERVICE.getView()));

// These are routes with logic
// and thus have controllers
// The endpoints are defined within the controllers
// as per the projects specification
app.use("/activities", ActivityController.routes);
app.use("/contact", ContactController.routes);
app.use("/auth", AuthenticationController.routes);
app.use("/microblogs", MicroblogController.routes);
app.use("/sessions", SessionController.routes);
app.use("/bookings", BookingController.routes);
app.use("/dashboard", DashboardController.routes);
app.use("/manage", ManageController.routes);

app.use(express.static(path.join(__dirname, "public")));

// If google has it, I need it
// You need not ask more
app.get("/teapot", (req, res) => renderStatus(
    res,
    418,
    "I'm a teapot",
    "You can't brew coffee with me"
));

// Replaces the default 404 handler with a custom one
// this improves the user experience
app.use((req, res) => {
    return notFound(
        res,
        `The requested resource was not found (${req.originalUrl})`
    );
});

app.listen(PORT, () => {
    console.log(`Backend started on http://localhost:${PORT}`);
});
