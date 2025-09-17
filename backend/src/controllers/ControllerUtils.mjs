import express from "express";
import SessionDetailsModel from "../models/SessionDetailsModel.mjs";

/**
 * Converts a date to a date input string.
 * @param {Date} date The date to convert.
 * @returns {string} A formatted date string.
 */
export function toDateValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Converts a date to a time input string.
 * @param {Date} date The date to convert.
 * @returns {string} A formatted time string.
 */
export function toTimeValue(date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Converts a value to a date input string.
 * @param {any} value The value to convert.
 * @returns {string} A formatted date string.
 */
export function toInputDate(value) {
  if (!value) return "";
  try {
    if (value instanceof Date && !isNaN(value)) {
      return toDateValue(value);
    }
    const s = String(value);
    const m = s.match(/^\d{4}-\d{2}-\d{2}/);
    if (m) return m[0];
    const d = new Date(s);
    if (isNaN(d)) return "";
    return toDateValue(d);
  } catch (_) {
    return "";
  }
}

/**
 * Parses a numeric ID from a value.
 * @param {any} value The value to parse.
 * @returns {number?} The parsed ID or null.
 */
export function parseId(value) {
  if (value === null || value === undefined) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/**
 * Renders a status page.
 * @param {express.Response} res The response object.
 * @param {number} code The HTTP status code.
 * @param {string} status The status text.
 * @param {string} message The status message.
 * @param {string} [routeName] The name of the route to display.
 * @param {string} [routePath] The path of the route to redirect to.
 */
export function renderStatus(
  res,
  code,
  status,
  message,
  routeName = "Home",
  routePath = "/"
) {
  return res.status(code).render(
    res.locals.ROUTES.STATUS.getView(),
    {
      status,
      message,
      routeName,
      routePath,
    }
  );
}

/**
 * Renders a validation failed page.
 * @param {express.Response} res The response object.
 * @param {string} message The validation message.
 * @param {string} [routeName] The name of the route to display.
 * @param {string} [routePath] The path of the route to redirect to.
 */
export function validationFailed(
  res,
  message,
  routeName,
  routePath
) {
  return renderStatus(
    res,
    400,
    "Validation failed",
    message,
    routeName,
    routePath
  );
}

/**
 * Renders an invalid ID page.
 * @param {express.Response} res The response object.
 * @param {string} subject The subject of the ID.
 * @param {string} [routeName] The name of the route to display.
 * @param {string} [routePath] The path of the route to redirect to.
 */
export function invalidId(
  res,
  subject = "Resource",
  routeName,
  routePath
) {
  return renderStatus(
    res,
    400,
    "Invalid request",
    `${subject} id must be a number.`,
    routeName,
    routePath
  );
}

/**
 * Renders a server error page.
 * @param {express.Response} res The response object.
 * @param {string} message The error message.
 * @param {any} [error] The error object.
 * @param {string} [logTag] A tag for the log.
 * @param {string} [routeName] The name of the route to display.
 * @param {string} [routePath] The path of the route to redirect to.
 */
export function serverError(
  res,
  message,
  error,
  logTag,
  routeName,
  routePath
) {
  if (error != null)
    console.error(logTag ?? "Server Error", error);

  return renderStatus(
    res,
    500,
    "Server Error",
    message,
    routeName,
    routePath
  );
}

/**
 * Renders a not found page.
 * @param {express.Response} res The response object.
 * @param {string} message The not found message.
 * @param {string} [routeName] The name of the route to display.
 * @param {string} [routePath] The path of the route to redirect to.
 */
export function notFound(
  res,
  message,
  routeName,
  routePath
) {
  return renderStatus(
    res,
    404,
    "Not Found",
    message,
    routeName,
    routePath
  );
}

/**
 * Renders a forbidden page.
 * @param {express.Response} res The response object.
 * @param {string} message The forbidden message.
 * @param {string} [routeName] The name of the route to display.
 * @param {string} [routePath] The path of the route to redirect to.
 */
export function forbidden(
  res,
  message,
  routeName,
  routePath
) {
  return renderStatus(
    res,
    403,
    "Forbidden",
    message,
    routeName,
    routePath
  );
}

/**
 * Converts a value to a trimmed string.
 * @param {any} value The value to trim.
 * @returns {string} The trimmed string.
 */
export function toTrimmed(value) {
  return String(value ?? "").trim();
}

/**
 * Formats a date for display.
 * @param {Date} date The date to format.
 * @param {boolean} shortened Whether to use a short format.
 * @returns {string} The formatted date string.
 */
export function formatDisplayDate(date, shortened = false) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = dayNames[date.getDay()];
  const dd = date.getDate();
  const ord = dd === 1 || dd === 21 || dd === 31
    ? "st"
    : dd === 2 || dd === 22
    ? "nd"
    : dd === 3 || dd === 23
    ? "rd"
    : "th";
  const month = monthNames[date.getMonth()];
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = (hours % 12) || 12;

  if (shortened) {
    const now = new Date();
    const sameDay = now.getFullYear() === date.getFullYear()
      && now.getMonth() === date.getMonth()
      && now.getDate() === date.getDate();

    if (sameDay) return `${displayHour}:${minutes} ${ampm}`;

    const dd2 = String(date.getDate()).padStart(2, "0");
    const mm2 = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd2}/${mm2}/${yyyy}`;
  }

  return `${day}, ${dd}${ord} ${month} @ ${displayHour}:${minutes} ${ampm}`;
}

/**
 * Filters a list of sessions to include only upcoming ones.
 * @param {SessionDetailsModel[]} detailsList The list of sessions to filter.
 * @returns {SessionDetailsModel[]} A list of upcoming sessions.
 */
export function filterUpcomingSessions(detailsList) {
  const now = new Date();
  return detailsList.filter((detail) => detail.session.start >= now);
}

/**
 * Filters a list of sessions by location.
 * @param {SessionDetailsModel[]} detailsList The list of sessions to filter.
 * @param {string} locationFilter The location to filter by.
 * @returns {SessionDetailsModel[]} A list of filtered sessions.
 */
export function filterByLocation(detailsList, locationFilter) {
  const value = String(locationFilter ?? "all").toLowerCase();
  if (value === "all") return detailsList;

  return detailsList.filter((detail) => (detail.location?.name ?? "").toLowerCase().includes(value));
}

/**
 * Filters a list of sessions by a search term.
 * @param {SessionDetailsModel[]} detailsList The list of sessions to filter.
 * @param {string} searchTerm The search term.
 * @param {any} formatDate A function to format dates.
 * @returns {SessionDetailsModel[]} A list of filtered sessions.
 */
export function filterBySearchTerm(sessionDetailsList, searchTerm, formatDate = formatDisplayDate) {
  const term = toTrimmed(searchTerm).toLowerCase();
  if (!term) return sessionDetailsList;

  return sessionDetailsList.filter((sessionDetails) => {
    const blob = `
      ${sessionDetails.activity?.name ?? ""}
      ${formatActivityName(sessionDetails.activity?.name ?? "")}
      ${sessionDetails.trainer?.firstName ?? ""} ${sessionDetails.trainer?.lastName ?? ""}
      ${sessionDetails.location?.name ?? ""}
      ${formatDate(sessionDetails.session.start)}
    `.toLowerCase();
    return blob.includes(term);
  });
}

/**
 * Sorts a list of sessions by their start date.
 * @param {SessionDetailsModel[]} detailsList The list of sessions to sort.
 * @returns {SessionDetailsModel[]} A sorted list of sessions.
 */
export function sortByStart(sessionDetailsList) {
  return sessionDetailsList
    .slice()
    .sort(
      (leftSessionDetails, rightSessionDetails) =>
        leftSessionDetails.session.start - rightSessionDetails.session.start
    );
}

/**
 * Calculates the time until a given start date.
 * @param {Date} start The start date.
 * @returns {string} The time until the start date.
 */
export function timeUntil(start) {
  const now = new Date();
  const diffMs = Math.max(0, start - now);
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `in ${days} ${days === 1 ? "Day" : "Days"}`;
  if (hours >= 1) return `in ${hours} ${hours === 1 ? "Hour" : "Hours"}`;
  return `in ${Math.max(1, minutes)} Mins`;
}

/**
 * Parses session query parameters from a request.
 * @param {express.Request} req The request object.
 * @returns {{ rawSearch: string, term: string, locationFilter: string }} The parsed query parameters.
 */
export function parseSessionQuery(req) {
  const rawSearch = toTrimmed(req?.query?.search);
  const term = rawSearch.toLowerCase();
  const allSessions = req?.query?.all ?? false;
  const locationFilter = String(req?.query?.location ?? "all");

  return {
    rawSearch,
    term,
    allSessions,
    locationFilter
  };
}

/**
 * Formats an activity name for display in lists or options.
 * @param {string} activityName
 * @returns {string}
 */
export function formatActivityName(activityName) {
  if (activityName.includes(" ") && activityName.length > 20)
    return activityName.replace(/[a-z\s-]/g, "");
  return activityName;
}