# High Street Gym (Express + EJS)

A full‑stack MVC web application for a gym management system. Members can browse and book sessions, trainers can manage their assigned sessions, and admins can manage users, activities, locations, sessions, and bookings. The app uses server‑rendered EJS views and a MySQL database.


## Tech stack

- Node.js + Express 5
- EJS templates (SSR)
- MySQL 8 (mysql2/promise)
- express‑session for cookie sessions
- bcryptjs for password hashing
- Vanilla CSS served from `backend/src/public/`


## Repository layout

- `backend/` - backend workspace (Node.js using Express+EJS)
  - `src/`
    - `controllers/` - Express routers (MVC Controller layer)
    - `models/` - DB models that encapsulate SQL (MVC Model layer)
    - `views/` - EJS pages and partials (MVC View layer)
    - `public/` - Static assets (CSS, images, icons)
    - `server.mjs` - Express app setup and route mounting
  - `package.json` - backend dependencies and dev scripts
  - `.env` - environment variables (required, must create yourself)
- `database/`
  - `01_create_schema.sql` - database and table DDL (with triggers)
  - `02_seed_data.sql` - initial data (locations, users, activities, sessions, bookings, microblogs)
- `frontend/` - frontend workspace (React+TypeScript - not used by the current app)
- `package.json` - workspace config


## Running locally

1) Prerequisites

- Node.js 20+
- MySQL 8 server
- A MySQL user that matches the hard‑coded connection in `backend/src/models/DatabaseModel.mjs`:
  - host: `process.env.DATABASE_HOST`
  - port: `process.env.DATABASE_PORT`
  - user: `process.env.DATABASE_USER`
  - password: read from `process.env.DATABASE_PASSWORD`
  - database: `process.env.DATABASE_NAME`

2) Create `.env`

Create `backend/.env` with your DB information and the port for backend:

```dotenv
# backend/.env
BACKEND_PORT=8080

DATABASE_USER=high-street-gym
DATABASE_PASSWORD=your_password
DATABASE_NAME=high_street_gym
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

3) Create MySQL Database schema and seed data

Use the MySQL CLI (adjust to match your MySQL database config):

```bash
mysql -h 127.0.0.1 -P 3306 -u high-street-gym -p < database/01_create_schema.sql
mysql -h 127.0.0.1 -P 3306 -u high-street-gym -p < database/02_seed_data.sql
```

4) Install dependencies and start the backend

```bash
npm i # Installs Node.JS dependencies
npm run start -w backend  # Starts Express server on port 8080
```

5) Visit the app

- http://localhost:8080
- Sample accounts from `database/02_seed_data.sql`:
  - Admin: `admin@example.com` / `Abc123!!`
  - Trainer: `trainer@example.com` / `Abc123!!`
  - Member: `member@example.com` / `Abc123!!`

Note: On first login for a seeded user, `AuthenticationController.mjs` transparently hashes any plain‑text password it detects and persists the hash.


## Architecture overview

- MVC with server‑rendered EJS views.
- `RouterController` centralises route names/paths and EJS view names, exposed as `res.locals.ROUTES` for all views.
- `AuthenticationController.middleware` attaches the session user to `res.locals.user` and sets `res.locals.user` for EJS templates.
- Controllers only pass model instances and presentation‑agnostic helpers to views. EJS views contain only simple logic (loops, `if`/ternaries, one‑liners). See `backend/src/controllers/ControllerUtils.mjs` for shared helpers.


## Server and routing

- `backend/src/server.mjs` sets EJS, static middleware, mounts controllers, and defines simple static pages:
  - Static views (no controllers): `GET /`, `GET /about`, `GET /privacy`, `GET /tos`
  - Controller‑backed routers:
    - `/auth` - `AuthenticationController`
    - `/activities` - `ActivityController`
    - `/contact` - `ContactController`
    - `/microblogs` - `MicroblogController`
    - `/sessions` - `SessionController`
    - `/bookings` - `BookingController`
    - `/dashboard` - `DashboardController`
    - `/manage` - `ManageController` (admin & trainer tooling)
  - Easter egg: `GET /teapot` returns 418 via `ControllerUtils.renderStatus()`

- `backend/src/controllers/RouterController.mjs` provides the canonical route registry (paths + `getView()` mappings) used throughout controllers and EJS.


## Database schema (summary)

Defined in `database/01_create_schema.sql`:

- `users` - id, role (`member`|`trainer`|`admin`), username, first/last name, birthday (DATE), email, password (hashed)
- `locations` - id, name, description, address, availability
- `activities` - id, name, description, capacity, duration (TIME)
- `sessions` - id, activity (FK), trainer (FK - users), location (FK), start (DATETIME)
- `bookings` - id, member (FK - users), session (FK - sessions), unique (member, session)
- `microblogs` - id, user (FK), upload_time (DATETIME), title, content
- Triggers clean up dependent rows (bookings, sessions, microblogs) pre‑delete to augment FK cascades.

Seed data (`database/02_seed_data.sql`) provides:

- 5 locations
- 7 activities
- 60+ users (admins, trainers, members) plus convenience accounts (admin/trainer/member)
- A multi‑week schedule of `sessions` and corresponding `bookings`
- `microblogs` posts from users and trainers


## Models

All models extend `DatabaseModel` (`backend/src/models/DatabaseModel.mjs`), which:

- Creates a MySQL pool with `nestTables: true` and exposes `static query(sql, ...values)`
- Provides time utilities: `toMySqlDate()`, `toMySqlDateTime()`, `toMySqlTime()`

Key models:

- `ActivityModel.mjs`
  - Fields: `id`, `name`, `description`, `capacity`, `duration` (hours as a number)
  - Helpers: `timeToHours()`, `hoursToHHMMSS()`
  - CRUD: `getAll()`, `getById(id)`, `create(activity)`, `update(activity)`, `delete(id)`

- `LocationModel.mjs`
  - Fields: `id`, `name`, `description`, `address`, `availability`
  - CRUD: `getAll()`, `getById(id)`, `create()`, `update()`, `delete()`

- `UserModel.mjs`
  - Fields: `id`, `role`, `username`, `firstName`, `lastName`, `birthday` (Date), `email` (lowercased), `password`
  - Enums: `UserRole` (`member`, `trainer`, `admin`)
  - CRUD + uniqueness: `getAll()`, `getById()`, `getByEmail()`, `create()`, `update()`, `delete()`, `ensureUniqueUsernameEmail()`

- `SessionModel.mjs`
  - Fields: `id`, `activity`, `trainer`, `location`, `start` (Date)
  - CRUD: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
  - For timetable: `getForWeekWithDetails(start, end)` returns light rows (activity/location/trainer names)

- `SessionDetailsModel.mjs`
  - Composite of a `SessionModel`, `ActivityModel`, `UserModel` (trainer), `LocationModel`, and an array of booked `UserModel`s
  - API: `getAll()` and `getById(sessionId)` - merges duplicate rows from left joins into a single instance with unique user bookings

- `SessionWithBookingsModel.mjs`
  - Composite of a `SessionModel` and an array of `BookingModel`
  - API: `getAll()`, `getById(sessionId)` - used for dashboards and session management

- `BookingModel.mjs`
  - Fields: `id`, `member`, `session`
  - Capacity‑safe `create({member, session})` via `INSERT ... SELECT` + `HAVING COUNT(b.id) < a.capacity`
    - Rejects with `"session full"` or `"already booked"` (duplicate key) for controller UX
  - `getAll()`, `getById()`, `update()`, `delete(id)`, `deleteByMemberAndSession(member, session)`

- `BookingDetailsModel.mjs`
  - Composite booking + session/activity/location/trainer/member
  - `getAll()`, `getById()` using table aliasing with `nestTables`

- `MicroblogModel.mjs`
  - Fields: `id`, `user`, `uploadTime` (Date), `title`, `content`
  - `getAll()`, `getAllWithAuthors()`, `getById()`, `create()`, `update()`, `delete()`


## Shared controller utilities

`backend/src/controllers/ControllerUtils.mjs`:

- Input/date helpers: `toTrimmed()`, `toInputDate()`, `toDateValue()`, `toTimeValue()`
- Query parsing: `parseSessionQuery(req)`
- Display helpers: `formatDisplayDate(date, shortened)`, `formatActivityName(name)`, `timeUntil(start)`
- Filtering/sorting for sessions: `filterUpcomingSessions()`, `filterByLocation()`, `filterBySearchTerm()`, `sortByStart()`
- Status renderers: `renderStatus()`, `validationFailed()`, `invalidId()`, `serverError()`, `notFound()`, `forbidden()`


## Controllers and endpoints

All controllers expose `static routes = express.Router()` mounted in `server.mjs`. Where noted, routes are protected via `AuthenticationController.restrict(...)`.

- `AuthenticationController.mjs` (`/auth`)
  - Session middleware binds `res.locals.user` and `res.locals.user`
  - `GET /auth/login` - render `login.ejs`
  - `POST /auth/login` - authenticate; hashes legacy plain passwords on first login
  - `GET /auth/register` - render `register.ejs`
  - `POST /auth/register` - validate + create member; logs in new user
  - `DELETE /auth` and `GET /auth/logout` (restricted) - destroy session; render status
  - Middleware: `restrict(...roles)` enforces role‑based access

- `RouterController.mjs`
  - Central route registry (paths + `getView()` names) exposed to EJS via `res.locals.ROUTES`

- `ActivityController.mjs` (`/activities`)
  - `GET /activities` - weekly timetable + marketing activity cards
  - Data: `days`, `rows` (map of activity cells per weekday), `weekLabel`, `activities`

- `ContactController.mjs` (`/contact`)
  - `GET /contact` - render locations (`LocationModel.getAll()`)

- `SessionController.mjs` (`/sessions`)
  - `GET /sessions` - list upcoming (or all for admin) with search + location filters
  - `GET /sessions/book/:id` (members) - create booking; handles `"session full"` and `"already booked"`
  - View locals: `sessions`, `searchTerm`, `allSessions`, `locationFilter`, `locations`, `formatActivityName`, `formatDate`, `timeUntil`

- `BookingController.mjs` (`/bookings`)
  - `GET /bookings` (members/trainers) - member: upcoming bookings; trainer: upcoming assigned sessions
  - `GET /bookings/cancel/:id` (members) - cancel booking for session id
  - View locals: `sessions`, `searchTerm`, `locationFilter`, `locations`, `formatActivityName`, `formatDate`, `timeUntil`

- `MicroblogController.mjs` (`/microblogs`)
  - `GET /microblogs` - list with search; `GET /microblogs/new` toggles create form for logged-in users
  - `POST /microblogs` (logged in) - create post
  - `POST /microblogs/:id/delete` (author or admin) - delete post
  - View locals: `blogs`, `users`, `formatDisplayDate`, `showCreate`, `rawSearch`

- `DashboardController.mjs` (`/dashboard`)
  - All routes restricted to any authenticated user
  - `GET /dashboard` - role‑based dashboards:
    - Admin: counts for users/locations/activities/posts/upcoming sessions/bookings
    - Trainer: sessions this week they run
    - Member: sessions this week they booked
  - `POST /dashboard/account` - update current user (optionally password with hashing)

- `ManageController.mjs` (`/manage`)
  - Sub‑routers with role restrictions:
    - `/manage/activities` (admin) - `ManageActivitiesController`
    - `/manage/locations` (admin) - `ManageLocationsController`
    - `/manage/users` (admin) - `ManageUsersController`
    - `/manage/bookings` (admin) - `ManageBookingsController`
    - `/manage/session` (admin + trainer) - `ManageSessionsController`

- `ManageActivitiesController.mjs` (`/manage/activities`)
  - `GET /` and `GET /:id` - list + edit form
  - `POST /` - create; `POST /:id` - update; `POST /:id/delete` - delete

- `ManageLocationsController.mjs` (`/manage/locations`)
  - Same pattern as activities (list, create, update, delete)

- `ManageUsersController.mjs` (`/manage/users`)
  - Same pattern as activities (list, create, update, delete) with uniqueness checks and password hashing on create

- `ManageBookingsController.mjs` (`/manage/bookings`)
  - `GET /` and `GET /:id` - list + edit
  - `POST /` - create; `POST /:id` - update (create new then delete old to respect capacity/unique constraints); `POST /:id/delete` - delete
  - Helpers passed: `formatBookingDetails()`, `formatSessionDetails()`

- `ManageSessionsController.mjs` (`/manage/session`)
  - `GET /new` and `POST /new` - create session
  - `GET /:id` - manage specific session (capacity, members, add/remove bookings)
  - `POST /:id` - update; `POST /:id/delete` - delete
  - `POST /:id/booking` - add member booking; `POST /:id/booking/:bookingId/delete` - remove booking
  - Trainers can only manage sessions they own (server‑enforced)


## Views and partials

All views are in `backend/src/views/`, with shared partials in `backend/src/views/partials/`.

Key pages and expected locals:

- `home.ejs` - static landing page; uses `ROUTES` to link to Activities/Sessions/Login
- `about.ejs` - static About page (images `img/gym2.avif`, `img/gym3.avif`)
- `activities.ejs` - expects `days`, `rows`, `weekLabel`, `activities` (cards use images named `img/activity-<slug>.avif`)
- `contact.ejs` - expects `locations`
- `sessions.ejs` - expects `sessions`, `searchTerm`, `allSessions`, `locationFilter`, `locations`, `formatActivityName`, `formatDate`, `timeUntil` and includes `partials/session_card.ejs`
- `bookings.ejs` - similar to Sessions but contextualised for the authenticated member or trainer
- `microblogs.ejs` - expects `blogs`, `users`, `formatDisplayDate`, `showCreate`, `rawSearch`
- Dashboards - `dashboard_admin.ejs`, `dashboard_trainer.ejs`, `dashboard_member.ejs` (all include `partials/account_form.ejs`)
- Management pages - `activity_management.ejs`, `location_management.ejs`, `user_management.ejs`, `booking_management.ejs`, `session_create.ejs`, `session_management.ejs`
- Legal - `privacy_policy.ejs`, `tos.ejs`
- Status - `status.ejs` for friendly validation/forbidden/not‑found/server‑error messages

Partials:

- `partials/head.ejs` - `<meta>` and base stylesheet
- `partials/header.ejs` - top nav; shows Login/Register or Dashboard/Logout based on `user`
- `partials/footer.ejs` - footer links incl. `ROUTES.PRIVACY_POLICY` and `ROUTES.TERMS_OF_SERVICE`
- `partials/account_form.ejs` - unified account editor used by dashboards
- `partials/manage_list_item.ejs` - reusable list row for management pages
- `partials/session_card.ejs` - the session tile used by Sessions/Bookings pages
  - Dynamically shows: “Manage” (admin/trainer), “Book Now” (member), “Booked”, “Cancel”, “Booked Out”, or “Session Expired” based on `user`, time, and `spotsLeft`


## Role‑based access

- `AuthenticationController.restrict(...allowedRoles)` protects sensitive endpoints.
- Trainers can only manage/update sessions where `session.trainer === user.id`.
- Members can create/cancel their own bookings; admins manage all resources.


## Conventions and UX rules

- Controllers pass only model instances and simple helper functions to views - no class names/button text/icons.
- EJS templates may use loops, simple conditionals, and one‑line calculations only.
- Shared, DRY partials are used for repeated UI (e.g., `session_card.ejs`).
- Activity image filenames must follow:

```text
backend/src/public/img/activity-<activity-name>.avif
# e.g. activity-indoor-cycling.avif, activity-high-intensity-interval-training.avif
```


## Notable helpers (ControllerUtils)

- `formatDisplayDate(date, shortened)` - human friendly times (with short/long variants used in Microblogs)
- `timeUntil(start)` - shows “in X Days/Hours/Mins” badges on session cards
- `filterUpcomingSessions()`, `filterByLocation()`, `filterBySearchTerm()`, `sortByStart()` - standardised listing behaviour across Sessions/Bookings


## Troubleshooting

- If you cannot connect to MySQL, confirm host/port/user/password in `backend/.env`.
- Ensure the schema/seed scripts have been run. You should see sessions in late Aug–Sep 2025 and 200+ bookings.
- First login for seeded users will upgrade plain passwords to bcrypt hashes automatically if they are not already hashed.
