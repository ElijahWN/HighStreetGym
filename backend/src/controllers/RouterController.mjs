import express from 'express';

export default class RouterController {
    static middleware = express.Router();
    static routes = Object.freeze({
        HOME: {
            getPath: () => "/",
            name: "Home",
            getView: () => "home.ejs"
        },
        ABOUT: {
            getPath: () => "/about",
            name: "About",
            getView: () => "about.ejs"
        },
        PRIVACY_POLICY: {
            getPath: () => "/privacy",
            name: "Privacy Policy",
            getView: () => "privacy_policy.ejs"
        },
        TERMS_OF_SERVICE: {
            getPath: () => "/tos",
            name: "Terms of Service",
            getView: () => "tos.ejs"
        },
        ACTIVITIES: {
            getPath: () => "/activities",
            name: "Activities",
            getView: () => "activities.ejs"
        },
        MICROBLOGS: {
            getPath: () => "/microblogs",
            name: "Microblogs",
            getView: () => "microblogs.ejs"
        },
        MICROBLOGS_NEW: {
            getPath: () => "/microblogs/new",
            name: "New Microblog",
            getView: () => null
        },
        MICROBLOGS_DELETE: {
            getPath: (id) => `/microblogs/${id}/delete`,
            name: "Delete Microblog",
            getView: () => null
        },
        DASHBOARD: {
            getPath: () => "/dashboard",
            name: "Dashboard",
            getView: (role) => `dashboard_${role}.ejs`
        },
        BOOKINGS: {
            getPath: () => "/bookings",
            name: "Bookings",
            getView: () => "bookings.ejs"
        },
        BOOKINGS_CANCEL: {
            getPath: (id) => `/bookings/cancel/${id}`,
            name: "Cancel Booking",
            getView: () => undefined
        },
        SESSIONS: {
            getPath: () => "/sessions",
            name: "Sessions",
            getView: () => "sessions.ejs"
        },
        BOOK_SESSION: {
            getPath: (id) => `/sessions/book/${id}`,
            name: "Book Session",
            getView: () => undefined
        },
        LOGIN: {
            getPath: () => "/auth/login",
            name: "Login",
            getView: () => "login.ejs"
        },
        REGISTER: {
            getPath: () => "/auth/register",
            name: "Register",
            getView: () => "register.ejs"
        },
        LOGOUT: {
            getPath: () => "/auth/logout",
            name: "Logout",
            getView: () => "logout.ejs"
        },
        CONTACT: {
            getPath: () => "/contact",
            name: "Contact",
            getView: () => "contact.ejs"
        },
        MANAGE_USERS: {
            getPath: (id) => `/manage/users/${id ?? ""}`,
            name: "Manage Users",
            getView: () => "user_management.ejs"
        },
        MANAGE_USERS_DELETE: {
            getPath: (id) => `/manage/users/${id}/delete`,
            name: "Delete User",
            getView: () => undefined
        },
        MANAGE_ACTIVITIES: {
            getPath: (id) => `/manage/activities/${id ?? ""}`,
            name: "Manage Activities",
            getView: () => "activity_management.ejs"
        },
        MANAGE_ACTIVITIES_DELETE: {
            getPath: (id) => `/manage/activities/${id}/delete`,
            name: "Delete Activity",
            getView: () => undefined
        },
        MANAGE_LOCATIONS: {
            getPath: (id) => `/manage/locations/${id ?? ""}`,
            name: "Manage Locations",
            getView: () => "location_management.ejs"
        },
        MANAGE_LOCATIONS_DELETE: {
            getPath: (id) => `/manage/locations/${id}/delete`,
            name: "Delete Location",
            getView: () => undefined
        },
        MANAGE_BOOKINGS: {
            getPath: (id) => `/manage/bookings/${id ?? ""}`,
            name: "Manage Bookings",
            getView: () => "booking_management.ejs"
        },
        MANAGE_BOOKINGS_DELETE: {
            getPath: (id) => `/manage/bookings/${id}/delete`,
            name: "Delete Booking",
            getView: () => undefined
        },
        MANAGE_SESSION: {
            getPath: (id) => `/manage/session/${id ?? ""}`,
            name: "Manage Session",
            getView: () => "session_management.ejs"
        },
        MANAGE_SESSION_DELETE: {
            getPath: (id) => `/manage/session/${id}/delete`,
            name: "Delete Session",
            getView: () => undefined
        },
        MANAGE_SESSION_BOOKING_CREATE: {
            getPath: (id) => `/manage/session/${id}/booking`,
            name: "Create Booking for Session",
            getView: () => undefined
        },
        MANAGE_SESSION_BOOKING_DELETE: {
            getPath: (sessionId, memberId) => `/manage/session/${sessionId}/booking/${memberId}/delete`,
            name: "Delete Booking for Session",
            getView: () => undefined
        },
        CREATE_SESSION: {
            getPath: () => `/manage/session/new`,
            name: "Create Session",
            getView: () => "session_create.ejs"
        },
        STATUS: {
            getPath: () => undefined,
            name: "Status",
            getView: () => "status.ejs"
        }
    });

    static {
        this.middleware.use(this.router);
    }

    static router(req, res, next) {
        if (!res.locals.ROUTES)
            res.locals.ROUTES = RouterController.routes;
        next();
    }
}
