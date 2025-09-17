-- High Street Gym - Schema
-- Create database and all tables

CREATE DATABASE IF NOT EXISTS high_street_gym;

USE high_street_gym;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  role ENUM('member','trainer','admin') NOT NULL,
  username VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  birthday DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  availability VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 6,
  duration TIME NOT NULL DEFAULT '01:00:00',
  PRIMARY KEY (id)
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id INT NOT NULL AUTO_INCREMENT,
  activity INT NOT NULL,
  trainer INT NOT NULL,
  location INT NOT NULL,
  start DATETIME NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_sessions_activity FOREIGN KEY (activity)
    REFERENCES activities(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sessions_trainer FOREIGN KEY (trainer)
    REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sessions_location FOREIGN KEY (location)
    REFERENCES locations(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INT NOT NULL AUTO_INCREMENT,
  member INT NOT NULL,
  session INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_booking_member_session (member, session),
  CONSTRAINT fk_bookings_member FOREIGN KEY (member)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_session FOREIGN KEY (session)
    REFERENCES sessions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Microblogs
CREATE TABLE IF NOT EXISTS microblogs (
  id INT NOT NULL AUTO_INCREMENT,
  user INT NOT NULL,
  upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_microblogs_user FOREIGN KEY (user)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Triggers to cascade deletes via BEFORE DELETE hooks
DELIMITER $$

DROP TRIGGER IF EXISTS before_delete_sessions $$
CREATE TRIGGER before_delete_sessions
BEFORE DELETE ON sessions
FOR EACH ROW
BEGIN
  DELETE FROM bookings WHERE `session` = OLD.id;
END $$

DROP TRIGGER IF EXISTS before_delete_activities $$
CREATE TRIGGER before_delete_activities
BEFORE DELETE ON activities
FOR EACH ROW
BEGIN
  DELETE FROM sessions WHERE activity = OLD.id;
END $$

DROP TRIGGER IF EXISTS before_delete_locations $$
CREATE TRIGGER before_delete_locations
BEFORE DELETE ON locations
FOR EACH ROW
BEGIN
  DELETE FROM sessions WHERE location = OLD.id;
END $$

DROP TRIGGER IF EXISTS before_delete_users $$
CREATE TRIGGER before_delete_users
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
  DELETE FROM sessions WHERE trainer = OLD.id;
  DELETE FROM bookings WHERE member = OLD.id;
  DELETE FROM microblogs WHERE user = OLD.id;
END $$

DELIMITER ;
