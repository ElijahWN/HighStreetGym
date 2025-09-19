USE high_street_gym;

INSERT INTO locations (id, name, description, address, availability) VALUES
  (1,'Ashgrove','Visit our Ashgrove club for a great fitness experience.','12 High St, Ashgrove QLD','Daily 6am-10pm'),
  (2,'Brisbane City','Find us in the heart of Brisbane City.','100 Queen St, Brisbane QLD','Daily 6am-10pm'),
  (3,'Graceville','Experience our Graceville club.','5 River Rd, Graceville QLD','Daily 6am-10pm'),
  (4,'Westlake','Join the community at our Westlake location.','88 Lakes Dr, Westlake QLD','Daily 6am-10pm'),
  (5,'Chermside','Your fitness destination in Chermside.','1 Gym Ln, Chermside QLD','Daily 6am-10pm');

INSERT INTO activities (id, name, description, capacity, duration) VALUES
  (1,'Yoga','Our Yoga sessions focus on flexibility, balance, and mindfulness. These classes are led by our Les Mills accredited trainers who hold Bachelor Degrees in Human Movements, ensuring you receive top quality instruction for a holistic wellness experience.',16,'01:00:00'),
  (2,'Pilates','Pilates sessions at High Street Gym are designed to strengthen core muscles, improve posture, and enhance overall body awareness. Our expert trainers guide you through controlled movements for improved physical strength and stability.',16,'01:00:00'),
  (3,'Abs','Join our targeted Abs workout sessions designed to strengthen and tone your core muscles. These dynamic group fitness classes contribute to weight loss and build essential core strength, helping you look and feel better.',12,'01:00:00'),
  (4,'High Intensity Interval Training','Experience powerful, short bursts of intense exercise followed by brief recovery periods in our HIIT classes. This cutting edge approach is great for circuit training and maximizing calorie burn, helping you achieve your fitness goals faster.',16,'01:00:00'),
  (5,'Indoor Cycling','Our high energy Indoor Cycling classes are designed to build endurance and cardiovascular fitness. This is a fantastic group fitness option for all levels, providing an engaging and effective workout.',16,'01:00:00'),
  (6,'Boxing','Learn fundamental boxing techniques, improve coordination, and get a full body workout in our Boxing sessions. This is part of our cutting edge exercise offerings, designed to challenge and empower you.',8,'01:00:00'),
  (7,'Zumba','Zumba offers fun, energetic dance fitness classes that combine Latin rhythms with easy to follow moves. It is perfect for weight loss and having more energy, making fitness enjoyable for everyone.',16,'01:00:00');

INSERT INTO users (id, role, username, first_name, last_name, birthday, email, password) VALUES
  (1,'admin','alex.jones','Alex','Jones','1987-04-15','alex.jones@example.com','Abc123!!'),
  (2,'trainer','taylor.smith','Taylor','Smith','1991-02-10','taylor.smith@example.com','Abc123!!'),
  (3,'trainer','jordan.lee','Jordan','Lee','1989-07-08','jordan.lee@example.com','Abc123!!'),
  (4,'trainer','casey.brown','Casey','Brown','1995-09-23','casey.brown@example.com','Abc123!!'),
  (5,'member','jamie.nguyen','Jamie','Nguyen','1999-07-07','jamie.nguyen@example.com','Abc123!!'),
  (6,'member','avery.patel','Avery','Patel','2000-08-08','avery.patel@example.com','Abc123!!'),
  (7,'member','sam.wong','Sam','Wong','2001-09-09','sam.wong@example.com','Abc123!!'),
  (8,'member','harper.singh','Harper','Singh','1995-10-10','harper.singh@example.com','Abc123!!'),
  (9,'member','drew.lam','Drew','Lam','1994-11-11','drew.lam@example.com','Abc123!!'),
  (10,'member','parker.gomez','Parker','Gomez','1993-12-12','parker.gomez@example.com','Abc123!!'),
  (11,'member','mia.kim','Mia','Kim','2007-05-14','mia.kim@example.com','Abc123!!'),
  (12,'member','liam.jones','Liam','Jones','2010-03-22','liam.jones@example.com','Abc123!!'),
  (13,'member','olivia.davis','Olivia','Davis','2009-11-05','olivia.davis@example.com','Abc123!!'),
  (14,'member','noah.wilson','Noah','Wilson','2011-01-18','noah.wilson@example.com','Abc123!!'),
  (15,'member','emma.martin','Emma','Martin','1990-06-30','emma.martin@example.com','Abc123!!'),
  (16,'member','ethan.thomas','Ethan','Thomas','1998-09-14','ethan.thomas@example.com','Abc123!!'),
  (17,'member','sophia.moore','Sophia','Moore','2005-02-27','sophia.moore@example.com','Abc123!!'),
  (18,'member','jack.murphy','Jack','Murphy','2008-12-03','jack.murphy@example.com','Abc123!!'),
  (19,'member','isabella.cox','Isabella','Cox','2011-03-12','isabella.cox@example.com','Abc123!!'),
  (20,'member','lucas.kelly','Lucas','Kelly','1989-08-21','lucas.kelly@example.com','Abc123!!'),
  (21,'member','amelia.ward','Amelia','Ward','1997-10-17','amelia.ward@example.com','Abc123!!'),
  (22,'member','logan.evans','Logan','Evans','2006-04-11','logan.evans@example.com','Abc123!!'),
  (23,'member','grace.hughes','Grace','Hughes','2010-09-01','grace.hughes@example.com','Abc123!!'),
  (24,'member','mason.turner','Mason','Turner','2003-07-25','mason.turner@example.com','Abc123!!'),
  (25,'member','alex.ward','Alex','Ward','1996-02-02','alex.ward@example.com','Abc123!!'),
  (26,'member','bella.ross','Bella','Ross','1997-03-03','bella.ross@example.com','Abc123!!'),
  (27,'member','carter.hall','Carter','Hall','1998-04-04','carter.hall@example.com','Abc123!!'),
  (28,'member','dylan.price','Dylan','Price','1999-05-05','dylan.price@example.com','Abc123!!'),
  (29,'member','ella.morris','Ella','Morris','2000-06-06','ella.morris@example.com','Abc123!!'),
  (30,'member','felix.bailey','Felix','Bailey','2001-07-07','felix.bailey@example.com','Abc123!!'),
  (31,'member','gianna.brooks','Gianna','Brooks','2002-08-08','gianna.brooks@example.com','Abc123!!'),
  (32,'member','hugo.bennett','Hugo','Bennett','2003-09-09','hugo.bennett@example.com','Abc123!!'),
  (33,'member','iris.hughes','Iris','Hughes','2004-10-10','iris.hughes@example.com','Abc123!!'),
  (34,'member','jude.foster','Jude','Foster','2005-11-11','jude.foster@example.com','Abc123!!'),
  (35,'member','keira.hunter','Keira','Hunter','2006-12-12','keira.hunter@example.com','Abc123!!'),
  (36,'member','leo.harrison','Leo','Harrison','2007-01-13','leo.harrison@example.com','Abc123!!'),
  (37,'member','maya.hart','Maya','Hart','2008-02-14','maya.hart@example.com','Abc123!!'),
  (38,'member','nate.franklin','Nate','Franklin','2009-03-15','nate.franklin@example.com','Abc123!!'),
  (39,'member','olga.summers','Olga','Summers','1995-04-16','olga.summers@example.com','Abc123!!'),
  (40,'member','paul.rivera','Paul','Rivera','1994-05-17','paul.rivera@example.com','Abc123!!'),
  (41,'member','quinn.miles','Quinn','Miles','1993-06-18','quinn.miles@example.com','Abc123!!'),
  (42,'member','riley.porter','Riley','Porter','1992-07-19','riley.porter@example.com','Abc123!!'),
  (43,'member','sienna.perry','Sienna','Perry','1991-08-20','sienna.perry@example.com','Abc123!!'),
  (44,'member','toby.grant','Toby','Grant','1990-09-21','toby.grant@example.com','Abc123!!'),
  (45,'trainer','riley.carter','Riley','Carter','1988-01-05','riley.carter@example.com','Abc123!!'),
  (46,'trainer','morgan.gray','Morgan','Gray','1986-02-06','morgan.gray@example.com','Abc123!!'),
  (47,'trainer','blake.hayes','Blake','Hayes','1990-03-07','blake.hayes@example.com','Abc123!!'),
  (48,'trainer','skyler.adams','Skyler','Adams','1992-04-08','skyler.adams@example.com','Abc123!!'),
  (49,'trainer','payton.owen','Payton','Owen','1985-05-09','payton.owen@example.com','Abc123!!'),
  (50,'trainer','reese.sullivan','Reese','Sullivan','1989-06-10','reese.sullivan@example.com','Abc123!!'),
  (51,'trainer','jamie.pearce','Jamie','Pearce','1987-07-11','jamie.pearce@example.com','Abc123!!'),
  (52,'trainer','casey.green','Casey','Green','1984-08-12','casey.green@example.com','Abc123!!'),
  (53,'trainer','taylor.young','Taylor','Young','1991-09-13','taylor.young@example.com','Abc123!!'),
  (54,'trainer','alex.morgan','Alex','Morgan','1988-10-14','alex.morgan@example.com','Abc123!!'),
  (55,'trainer','jordan.king','Jordan','King','1986-11-15','jordan.king@example.com','Abc123!!'),
  (56,'trainer','casey.scott','Casey','Scott','1990-12-16','casey.scott@example.com','Abc123!!'),
  (57,'trainer','harper.ryan','Harper','Ryan','1987-01-17','harper.ryan@example.com','Abc123!!'),
  (58,'trainer','sam.parker','Sam','Parker','1989-02-18','sam.parker@example.com','Abc123!!'),
  (59,'trainer','avery.quinn','Avery','Quinn','1985-03-19','avery.quinn@example.com','Abc123!!'),
  (60,'trainer','rowan.wells','Rowan','Wells','1984-04-20','rowan.wells@example.com','Abc123!!'),
  (61, 'admin', 'admin', 'Admin', 'Admin', '1987-04-15', 'admin@example.com', 'Abc123!!'),
  (62, 'trainer', 'trainer', 'Trainer', 'Trainer', '1987-04-15', 'trainer@example.com', 'Abc123!!'),
  (63, 'member', 'member', 'Member', 'Member', '1987-04-15', 'member@example.com', 'Abc123!!');

INSERT INTO sessions (id, activity, trainer, location, start) VALUES
  -- Week of 18-24 Aug 2025
  (1,1,51,1,'2025-08-18 09:00:00'), -- Yoga Mon 9:00 Ashgrove
  (2,1,53,2,'2025-08-20 10:00:00'), -- Yoga Wed 10:00 Brisbane City
  (3,1,48,5,'2025-08-22 16:00:00'), -- Yoga Fri 4:00pm Chermside
  (4,2,55,2,'2025-08-19 11:00:00'), -- Pilates Tue 11:00 Brisbane City
  (5,2,46,4,'2025-08-21 17:00:00'), -- Pilates Thu 5:00pm Westlake
  (6,3,45,3,'2025-08-18 18:00:00'), -- Abs Mon 6:00pm Graceville
  (7,3,56,1,'2025-08-23 14:00:00'), -- Abs Sat 2:00pm Ashgrove
  (8,4,58,2,'2025-08-19 16:00:00'), -- HIIT Tue 4:00pm Brisbane City
  (9,4,49,5,'2025-08-24 10:00:00'), -- HIIT Sun 10:00 Chermside
  (10,5,47,4,'2025-08-20 12:00:00'), -- Indoor Cycling Wed 12:00 Westlake
  (11,5,52,1,'2025-08-22 09:00:00'), -- Indoor Cycling Fri 9:00 Ashgrove
  (12,6,3,2,'2025-08-21 19:00:00'), -- Boxing Thu 7:00pm Brisbane City
  (13,7,50,3,'2025-08-18 19:30:00'), -- Zumba Mon 7:30pm Graceville
  (14,7,54,5,'2025-08-24 11:00:00'), -- Zumba Sun 11:00 Chermside

  -- Week of 25-31 Aug 2025
  (15,1,2,1,'2025-08-25 10:00:00'), -- Yoga Mon 10:00 Ashgrove
  (16,1,57,5,'2025-08-29 10:00:00'), -- Yoga Fri 10:00 Chermside
  (17,2,53,2,'2025-08-26 11:00:00'), -- Pilates Tue 11:00 Brisbane City
  (18,2,47,4,'2025-08-28 10:00:00'), -- Pilates Thu 10:00 Westlake
  (19,3,4,3,'2025-08-27 16:00:00'), -- Abs Wed 4:00pm Graceville
  (20,3,55,2,'2025-08-31 14:00:00'), -- Abs Sun 2:00pm Brisbane City
  (21,4,58,2,'2025-08-26 16:00:00'), -- HIIT Tue 4:00pm Brisbane City
  (22,4,51,1,'2025-08-30 15:00:00'), -- HIIT Sat 3:00pm Ashgrove
  (23,5,52,1,'2025-08-30 10:00:00'), -- Indoor Cycling Sat 10:00 Ashgrove
  (24,6,59,4,'2025-08-28 16:00:00'), -- Boxing Thu 4:00pm Westlake
  (25,7,56,1,'2025-08-25 12:00:00'), -- Zumba Mon 12:00 Ashgrove
  (26,7,60,5,'2025-08-29 12:00:00'), -- Zumba Fri 12:00 Chermside

  -- Week of 1-7 Sep 2025
  (27,1,50,3,'2025-09-01 08:30:00'), -- Yoga Mon 8:30 Graceville
  (28,1,51,1,'2025-09-03 17:00:00'), -- Yoga Wed 5:00pm Ashgrove
  (29,1,55,2,'2025-09-05 09:00:00'), -- Yoga Fri 9:00 Brisbane City
  (30,2,46,4,'2025-09-02 12:00:00'), -- Pilates Tue 12:00 Westlake
  (31,2,57,5,'2025-09-04 18:00:00'), -- Pilates Thu 6:00pm Chermside
  (32,3,56,1,'2025-09-01 19:00:00'), -- Abs Mon 7:00pm Ashgrove
  (33,3,58,2,'2025-09-06 15:00:00'), -- Abs Sat 3:00pm Brisbane City
  (34,4,45,3,'2025-09-02 17:30:00'), -- HIIT Tue 5:30pm Graceville
  (35,4,59,4,'2025-09-07 11:00:00'), -- HIIT Sun 11:00 Westlake
  (36,5,60,5,'2025-09-03 13:00:00'), -- Indoor Cycling Wed 1:00pm Chermside
  (37,5,53,2,'2025-09-05 19:30:00'), -- Indoor Cycling Fri 7:30pm Brisbane City
  (38,6,4,3,'2025-09-04 20:00:00'), -- Boxing Thu 8:00pm Graceville
  (39,7,47,4,'2025-09-01 18:30:00'), -- Zumba Mon 6:30pm Westlake
  (40,7,52,1,'2025-09-07 10:30:00'), -- Zumba Sun 10:30 Ashgrove

  -- Week of 8-14 Sep 2025
  (41,1,53,2,'2025-09-08 09:30:00'), -- Yoga Mon 9:30 Brisbane City
  (42,1,59,4,'2025-09-10 16:30:00'), -- Yoga Wed 4:30pm Westlake
  (43,1,57,5,'2025-09-12 10:30:00'), -- Yoga Fri 10:30 Chermside
  (44,2,51,1,'2025-09-09 11:30:00'), -- Pilates Tue 11:30 Ashgrove
  (45,2,50,3,'2025-09-11 17:30:00'), -- Pilates Thu 5:30pm Graceville
  (46,3,55,2,'2025-09-08 18:30:00'), -- Abs Mon 6:30pm Brisbane City
  (47,3,60,5,'2025-09-13 14:30:00'), -- Abs Sat 2:30pm Chermside
  (48,4,47,4,'2025-09-09 16:30:00'), -- HIIT Tue 4:30pm Westlake
  (49,4,52,1,'2025-09-14 10:30:00'), -- HIIT Sun 10:30 Ashgrove
  (50,5,45,3,'2025-09-10 12:30:00'), -- Indoor Cycling Wed 12:30 Graceville
  (51,5,48,5,'2025-09-12 19:00:00'), -- Indoor Cycling Fri 7:00pm Chermside
  (52,6,2,1,'2025-09-11 19:30:00'), -- Boxing Thu 7:30pm Ashgrove
  (53,7,58,2,'2025-09-08 19:00:00'), -- Zumba Mon 7:00pm Brisbane City
  (54,7,59,4,'2025-09-14 11:30:00'), -- Zumba Sun 11:30 Westlake

  -- Week of 15-21 Sep 2025
  (55,1,51,1,'2025-09-15 09:00:00'), -- Yoga Mon 9:00 Ashgrove
  (56,1,59,2,'2025-09-17 10:30:00'), -- Yoga Wed 10:30 Brisbane City
  (57,1,54,5,'2025-09-19 09:30:00'), -- Yoga Fri 9:30 Chermside
  (58,2,46,3,'2025-09-16 12:00:00'), -- Pilates Tue 12:00 Graceville
  (59,2,55,4,'2025-09-18 17:30:00'), -- Pilates Thu 5:30pm Westlake
  (60,3,56,1,'2025-09-15 18:30:00'), -- Abs Mon 6:30pm Ashgrove
  (61,3,45,3,'2025-09-20 14:30:00'), -- Abs Sat 2:30pm Graceville
  (62,4,58,2,'2025-09-16 16:30:00'), -- HIIT Tue 4:30pm Brisbane City
  (63,4,49,4,'2025-09-21 10:30:00'), -- HIIT Sun 10:30 Westlake
  (64,5,52,1,'2025-09-17 12:30:00'), -- Indoor Cycling Wed 12:30 Ashgrove
  (65,5,47,5,'2025-09-19 19:00:00'), -- Indoor Cycling Fri 7:00pm Chermside
  (66,6,2,2,'2025-09-18 19:30:00'), -- Boxing Thu 7:30pm Brisbane City
  (67,7,50,3,'2025-09-15 19:30:00'), -- Zumba Mon 7:30pm Graceville
  (68,7,60,1,'2025-09-21 11:30:00'), -- Zumba Sun 11:30 Ashgrove

  -- Week of 22-28 Sep 2025
  (69,1,45,3,'2025-09-22 08:30:00'), -- Yoga Mon 8:30 Graceville
  (70,1,59,4,'2025-09-24 16:30:00'), -- Yoga Wed 4:30pm Westlake
  (71,1,57,5,'2025-09-26 10:00:00'), -- Yoga Fri 10:00 Chermside
  (72,2,51,1,'2025-09-23 11:30:00'), -- Pilates Tue 11:30 Ashgrove
  (73,2,50,3,'2025-09-25 17:30:00'), -- Pilates Thu 5:30pm Graceville
  (74,3,55,2,'2025-09-22 19:00:00'), -- Abs Mon 7:00pm Brisbane City
  (75,3,60,5,'2025-09-27 15:00:00'), -- Abs Sat 3:00pm Chermside
  (76,4,47,3,'2025-09-23 17:30:00'), -- HIIT Tue 5:30pm Graceville
  (77,4,52,1,'2025-09-28 11:00:00'), -- HIIT Sun 11:00 Ashgrove
  (78,5,53,4,'2025-09-24 13:00:00'), -- Indoor Cycling Wed 1:00pm Westlake
  (79,5,58,2,'2025-09-26 19:30:00'), -- Indoor Cycling Fri 7:30pm Brisbane City
  (80,6,3,1,'2025-09-25 20:00:00'), -- Boxing Thu 8:00pm Ashgrove
  (81,7,49,5,'2025-09-22 18:30:00'), -- Zumba Mon 6:30pm Chermside
  (82,7,56,4,'2025-09-28 11:30:00'); -- Zumba Sun 11:30 Westlake

INSERT INTO bookings (member, session) VALUES
-- Week of 18-24 Aug 2025
  -- Yoga by Trainer 51 at Ashgrove (6 booked)
  (13,1),(14,1),(15,1),(25,1),(26,1),(27,1),
  -- Abs by Trainer 56 at Ashgrove (6 booked)
  (13,7),(14,7),(15,7),(25,7),(26,7),(27,7),
  -- Indoor Cycling by Trainer 52 at Ashgrove (6 booked)
  (13,11),(14,11),(15,11),(25,11),(26,11),(27,11),
  -- Yoga by Trainer 53 at Brisbane City (16 booked)
  (5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(28,2),(29,2),(30,2),(31,2),(32,2),(33,2),(34,2),(35,2),
  -- Pilates by Trainer 55 at Brisbane City (15 booked)
  (5,4),(6,4),(7,4),(8,4),(9,4),(10,4),(11,4),(12,4),(28,4),(29,4),(30,4),(31,4),(32,4),(33,4),(34,4),
  -- HIIT by Trainer 58 at Brisbane City (12 booked)
  (5,8),(6,8),(7,8),(8,8),(9,8),(10,8),(11,8),(12,8),(28,8),(29,8),(30,8),(31,8),
  -- Boxing by Trainer 3 at Brisbane City (8 booked)
  (5,12),(6,12),(7,12),(8,12),(9,12),(10,12),(11,12),(12,12),
  -- Abs by Trainer 45 at Graceville (6 booked)
  (16,6),(17,6),(18,6),(36,6),(37,6),(38,6),
  -- Zumba by Trainer 50 at Graceville (6 booked)
  (16,13),(17,13),(18,13),(36,13),(37,13),(38,13),
  -- Pilates by Trainer 46 at Westlake (6 booked)
  (19,5),(20,5),(21,5),(39,5),(40,5),(41,5),
  -- Indoor Cycling by Trainer 47 at Westlake (6 booked)
  (19,10),(20,10),(21,10),(39,10),(40,10),(41,10),
  -- Yoga by Trainer 48 at Chermside (6 booked)
  (22,3),(23,3),(24,3),(42,3),(43,3),(44,3),
  -- HIIT by Trainer 49 at Chermside (6 booked)
  (22,9),(23,9),(24,9),(42,9),(43,9),(44,9),
  -- Zumba by Trainer 54 at Chermside (6 booked)
  (22,14),(23,14),(24,14),(42,14),(43,14),(44,14),

-- Week of 25-31 Aug 2025
  -- Yoga by Trainer 2 at Ashgrove (10 booked)
  (5,15),(6,15),(7,15),(8,15),(13,15),(14,15),(15,15),(25,15),(26,15),(27,15),
  -- Yoga by Trainer 57 at Chermside (6 booked)
  (22,16),(23,16),(24,16),(42,16),(43,16),(44,16),
  -- Pilates by Trainer 53 at Brisbane City (10 booked)
  (9,17),(10,17),(11,17),(12,17),(16,17),(28,17),(29,17),(30,17),(31,17),(32,17),
  -- Pilates by Trainer 47 at Westlake (6 booked)
  (19,18),(20,18),(21,18),(39,18),(40,18),(41,18),
  -- Abs by Trainer 4 at Graceville (6 booked)
  (17,19),(18,19),(16,19),(36,19),(37,19),(38,19),
  -- Abs by Trainer 55 at Brisbane City (8 booked)
  (9,20),(10,20),(11,20),(12,20),(16,20),(33,20),(34,20),(35,20),
  -- HIIT by Trainer 58 at Brisbane City (8 booked)
  (9,21),(10,21),(11,21),(12,21),(16,21),(28,21),(29,21),(30,21),
  -- HIIT by Trainer 51 at Ashgrove (9 booked)
  (5,22),(6,22),(7,22),(8,22),(13,22),(14,22),(25,22),(26,22),(27,22),
  -- Indoor Cycling by Trainer 52 at Ashgrove (10 booked)
  (5,23),(6,23),(7,23),(8,23),(13,23),(14,23),(15,23),(25,23),(26,23),(27,23),
  -- Boxing by Trainer 59 at Westlake (5 booked)
  (19,24),(20,24),(21,24),(39,24),(40,24),
  -- Zumba by Trainer 56 at Ashgrove (9 booked)
  (5,25),(6,25),(7,25),(8,25),(13,25),(14,25),(25,25),(26,25),(27,25),
  -- Zumba by Trainer 60 at Chermside (6 booked)
  (22,26),(23,26),(24,26),(42,26),(43,26),(44,26),

-- Week of 1-7 Sep 2025
  -- Yoga by Trainer 50 at Graceville (6 booked)
  (16,27),(17,27),(18,27),(36,27),(37,27),(38,27),
  -- Yoga by Trainer 51 at Ashgrove (6 booked)
  (13,28),(14,28),(15,28),(25,28),(26,28),(27,28),
  -- Yoga by Trainer 55 at Brisbane City (16 booked)
  (5,29),(6,29),(7,29),(8,29),(9,29),(10,29),(11,29),(12,29),(28,29),(29,29),(30,29),(31,29),(32,29),(33,29),(34,29),(35,29),
  -- Pilates by Trainer 46 at Westlake (6 booked)
  (19,30),(20,30),(21,30),(39,30),(40,30),(41,30),
  -- Pilates by Trainer 57 at Chermside (6 booked)
  (22,31),(23,31),(24,31),(42,31),(43,31),(44,31),
  -- Abs by Trainer 56 at Ashgrove (6 booked)
  (13,32),(14,32),(15,32),(25,32),(26,32),(27,32),
  -- Abs by Trainer 58 at Brisbane City (12 booked)
  (5,33),(6,33),(7,33),(8,33),(9,33),(10,33),(11,33),(12,33),(28,33),(29,33),(30,33),(31,33),
  -- HIIT by Trainer 45 at Graceville (6 booked)
  (16,34),(17,34),(18,34),(36,34),(37,34),(38,34),
  -- HIIT by Trainer 59 at Westlake (6 booked)
  (19,35),(20,35),(21,35),(39,35),(40,35),(41,35),
  -- Indoor Cycling by Trainer 60 at Chermside (6 booked)
  (22,36),(23,36),(24,36),(42,36),(43,36),(44,36),

-- Week of 8-14 Sep 2025
  -- Indoor Cycling by Trainer at Brisbane (16 booked)
  (5,37),(6,37),(7,37),(8,37),(9,37),(10,37),(11,37),(12,37),(28,37),(29,37),(30,37),(31,37),(32,37),(33,37),(34,37),(35,37),
  -- Boxing by Trainer at Graceville (6 booked)
  (16,38),(17,38),(18,38),(36,38),(37,38),(38,38),
  -- Zumba by Trainer at Westlake (6 booked)
  (19,39),(20,39),(21,39),(39,39),(40,39),(41,39),
  -- Zumba by Trainer at Ashgrove (6 booked)
  (13,40),(14,40),(15,40),(25,40),(26,40),(27,40),
  -- Yoga by Trainer at Brisbane (16 booked)
  (5,41),(6,41),(7,41),(8,41),(9,41),(10,41),(11,41),(12,41),(28,41),(29,41),(30,41),(31,41),(32,41),(33,41),(34,41),(35,41),
  -- Yoga by Trainer at Westlake (6 booked)
  (19,42),(20,42),(21,42),(39,42),(40,42),(41,42),
  -- Yoga by Trainer at Chermside (6 booked)
  (22,43),(23,43),(24,43),(42,43),(43,43),(44,43),
  -- Pilates by Trainer at Ashgrove (6 booked)
  (13,44),(14,44),(15,44),(25,44),(26,44),(27,44),
  -- Pilates by Trainer at Graceville (6 booked)
  (16,45),(17,45),(18,45),(36,45),(37,45),(38,45),
  -- Abs by Trainer at Brisbane (12 booked)
  (5,46),(6,46),(7,46),(8,46),(9,46),(10,46),(11,46),(12,46),(28,46),(29,46),(30,46),(31,46),
  -- Abs by Trainer at Chermside (6 booked)
  (22,47),(23,47),(24,47),(42,47),(43,47),(44,47),
  -- HIIT by Trainer at Westlake (6 booked)
  (19,48),(20,48),(21,48),(39,48),(40,48),(41,48),
  -- HIIT by Trainer at Ashgrove (6 booked)
  (13,49),(14,49),(15,49),(25,49),(26,49),(27,49),
  -- Indoor Cycling by Trainer at Graceville (6 booked)
  (16,50),(17,50),(18,50),(36,50),(37,50),(38,50),
  -- Indoor Cycling by Trainer at Chermside (6 booked)
  (22,51),(23,51),(24,51),(42,51),(43,51),(44,51),
  -- Boxing by Trainer at Ashgrove (6 booked)
  (13,52),(14,52),(15,52),(25,52),(26,52),(27,52),
  -- Zumba by Trainer at Brisbane (16 booked)
  (5,53),(6,53),(7,53),(8,53),(9,53),(10,53),(11,53),(12,53),(28,53),(29,53),(30,53),(31,53),(32,53),(33,53),(34,53),(35,53),
  -- Zumba by Trainer at Westlake (6 booked)
  (19,54),(20,54),(21,54),(39,54),(40,54),(41,54),

-- Week of 15-21 Sep 2025
  -- Yoga by Trainer at Ashgrove (6 booked)
  (13,55),(14,55),(15,55),(25,55),(26,55),(27,55),
  -- Yoga by Trainer at Brisbane (16 booked)
  (5,56),(6,56),(7,56),(8,56),(9,56),(10,56),(11,56),(12,56),(28,56),(29,56),(30,56),(31,56),(32,56),(33,56),(34,56),(35,56),
  -- Yoga by Trainer at Chermside (6 booked)
  (22,57),(23,57),(24,57),(42,57),(43,57),(44,57),
  -- Pilates by Trainer at Graceville (6 booked)
  (16,58),(17,58),(18,58),(36,58),(37,58),(38,58),
  -- Pilates by Trainer at Westlake (6 booked)
  (19,59),(20,59),(21,59),(39,59),(40,59),(41,59),
  -- Abs by Trainer at Ashgrove (6 booked)
  (13,60),(14,60),(15,60),(25,60),(26,60),(27,60),
  -- Abs by Trainer at Graceville (6 booked)
  (16,61),(17,61),(18,61),(36,61),(37,61),(38,61),
  -- HIIT by Trainer at Brisbane (16 booked)
  (5,62),(6,62),(7,62),(8,62),(9,62),(10,62),(11,62),(12,62),(28,62),(29,62),(30,62),(31,62),(32,62),(33,62),(34,62),(35,62),
  -- HIIT by Trainer at Westlake (6 booked)
  (19,63),(20,63),(21,63),(39,63),(40,63),(41,63),
  -- Indoor Cycling by Trainer at Ashgrove (6 booked)
  (13,64),(14,64),(15,64),(25,64),(26,64),(27,64),
  -- Indoor Cycling by Trainer at Chermside (6 booked)
  (22,65),(23,65),(24,65),(42,65),(43,65),(44,65),
  -- Boxing by Trainer at Brisbane (8 booked)
  (5,66),(6,66),(7,66),(8,66),(9,66),(10,66),(11,66),(12,66),
  -- Zumba by Trainer at Graceville (6 booked)
  (16,67),(17,67),(18,67),(36,67),(37,67),(38,67),
  -- Zumba by Trainer at Ashgrove (6 booked)
  (13,68),(14,68),(15,68),(25,68),(26,68),(27,68),

-- Week of 22-28 Sep 2025
  -- Yoga by Trainer at Graceville (6 booked)
  (16,69),(17,69),(18,69),(36,69),(37,69),(38,69),
  -- Yoga by Trainer at Westlake (6 booked)
  (19,70),(20,70),(21,70),(39,70),(40,70),(41,70),
  -- Yoga by Trainer at Chermside (6 booked)
  (22,71),(23,71),(24,71),(42,71),(43,71),(44,71),
  -- Pilates by Trainer at Ashgrove (6 booked)
  (13,72),(14,72),(15,72),(25,72),(26,72),(27,72),
  -- Pilates by Trainer at Graceville (6 booked)
  (16,73),(17,73),(18,73),(36,73),(37,73),(38,73),
  -- Abs by Trainer at Brisbane (12 booked)
  (5,74),(6,74),(7,74),(8,74),(9,74),(10,74),(11,74),(12,74),(28,74),(29,74),(30,74),(31,74),
  -- Abs by Trainer at Chermside (6 booked)
  (22,75),(23,75),(24,75),(42,75),(43,75),(44,75),
  -- HIIT by Trainer at Graceville (6 booked)
  (16,76),(17,76),(18,76),(36,76),(37,76),(38,76),
  -- HIIT by Trainer at Ashgrove (6 booked)
  (13,77),(14,77),(15,77),(25,77),(26,77),(27,77),
  -- Indoor Cycling by Trainer at Westlake (6 booked)
  (19,78),(20,78),(21,78),(39,78),(40,78),(41,78),
  -- Indoor Cycling by Trainer at Brisbane (16 booked)
  (5,79),(6,79),(7,79),(8,79),(9,79),(10,79),(11,79),(12,79),(28,79),(29,79),(30,79),(31,79),(32,79),(33,79),(34,79),(35,79),
  -- Boxing by Trainer at Ashgrove (6 booked)
  (13,80),(14,80),(15,80),(25,80),(26,80),(27,80),
  -- Zumba by Trainer at Chermside (6 booked)
  (22,81),(23,81),(24,81),(42,81),(43,81),(44,81),
  -- Zumba by Trainer at Westlake (6 booked)
  (19,82),(20,82),(21,82),(39,82),(40,82),(41,82);

INSERT INTO microblogs (id, user, upload_time, title, content) VALUES
  (1,5,'2025-08-19 09:00:00','Joined!','Just joined High Street Gym!'),
  (2,6,'2025-08-19 10:00:00','Yoga Love','Loved the Yoga session today.'),
  (3,3,'2025-08-19 11:00:00','Trainer Tip','Trainer tip: stay hydrated and stretch!'),
  (4,7,'2025-08-19 12:00:00','HIIT Hype','Can''t wait for HIIT tomorrow.'),
  (5,8,'2025-08-19 13:00:00','Cycling Fave','Indoor Cycling on Saturday is my fave.'),
  (6,2,'2025-08-19 14:00:00','Boxing Energy','Great energy in Boxing this week!'),
  (7,2,'2025-08-20 08:00:00','Trainer Taylor: New Boxing Slots','I''ll be opening extra Boxing sessions next month. Watch this space!'),
  (8,3,'2025-08-20 08:30:00','Trainer Jordan: Yoga Series','Starting a new Sunrise Yoga series every Wednesday.'),
  (9,4,'2025-08-20 09:00:00','Trainer Casey: HIIT Challenge','Launching a 4-week HIIT challenge. Who''s in?'),
  (10,1,'2025-08-20 09:30:00','Admin Update','Please remember to check in before each class.'),
  (11,5,'2025-08-21 07:45:00','Ashgrove Crew','Booked my second class this week. Feeling great!'),
  (12,6,'2025-08-21 08:15:00','Stretch Goals','Pilates really helps my posture.'),
  (13,7,'2025-08-21 12:05:00','Core Burn','Abs day burnt so good.'),
  (14,8,'2025-08-21 18:20:00','Spin Win','Crushed the Indoor Cycling session.'),
  (15,9,'2025-08-22 07:10:00','City Vibes','Love the Brisbane City gym vibe.'),
  (16,10,'2025-08-22 12:40:00','New PB','Hit a new personal best on the bike!'),
  (17,11,'2025-08-22 19:05:00','Zumba Fun','Zumba tonight was a blast.'),
  (18,12,'2025-08-23 09:30:00','Boxing Buddy','Anyone up for Boxing Thursday?'),
  (19,13,'2025-08-23 10:15:00','Westlake Warriors','Westlake sessions are 🔥'),
  (20,14,'2025-08-23 16:25:00','Focus','Dialing in on form this week.'),
  (21,15,'2025-08-24 08:00:00','Sunday Stretch','Yoga + coffee = perfect Sunday.'),
  (22,16,'2025-08-24 12:50:00','Night Owl','Late sessions suit me best.'),
  (23,17,'2025-08-24 13:15:00','HIIT Squad','Signed up for the HIIT challenge!'),
  (24,18,'2025-08-24 14:10:00','Boxing Pad Work','Loved today''s combos.'),
  (25,19,'2025-08-24 15:05:00','Cardio Kick','Felt strong today.'),
  (26,20,'2025-08-24 16:45:00','Bike Life','Westlake cycle crew rolling.'),
  (27,21,'2025-08-24 17:20:00','Northside Crew','Chermside fam 💪'),
  (28,22,'2025-08-24 18:00:00','Consistency','Two sessions a week feels great.'),
  (29,23,'2025-08-24 18:30:00','Progress','Seeing improvements already.'),
  (30,24,'2025-08-24 19:00:00','Dance It Out','Zumba is my happy place.'),
  (31,5,'2025-08-25 08:10:00','Another One','Booked Yoga again!'),
  (32,9,'2025-08-25 12:00:00','Lunchtime Sweat','Quick Abs session at lunch.'),
  (33,14,'2025-08-25 18:40:00','Evening Grind','Boxing then stretch. Perfect combo.'),
  (34,21,'2025-08-26 09:00:00','Morning Roll Call','Chermside 9am squad!'),
  (35,12,'2025-08-26 19:20:00','Gear Up','Got new gloves for Boxing.'),
  (36,7,'2025-08-27 07:25:00','Midweek Move','Keeping the streak alive.'),
  (37,3,'2025-08-27 11:45:00','Trainer Jordan: Form Clinic','Running a free form clinic after Yoga this week.'),
  (38,2,'2025-08-27 17:30:00','Trainer Taylor: Sparring Basics','Intro sparring basics demo this Friday.'),
  (39,4,'2025-08-28 08:05:00','Trainer Casey: Mobility','Pre-HIIT mobility warm-up video dropping soon.'),
  (40,45,'2025-08-28 09:00:00','Trainer Riley: Welcome','Excited to join the team!'),
  (41,46,'2025-08-28 09:30:00','Trainer Morgan: Pilates Focus','Pilates progressions coming this week.'),
  (42,47,'2025-08-28 10:00:00','Trainer Blake: Cycling Tips','Improve cadence with interval drills.'),
  (43,48,'2025-08-28 10:30:00','Trainer Skyler: Yoga Flow','Gentle vinyasa to start your day.'),
  (44,49,'2025-08-28 11:00:00','Trainer Payton: Boxing Footwork','Light, quick steps win rounds.'),
  (45,50,'2025-08-28 11:30:00','Trainer Alex: Graceville Update','Adding morning Yoga next week.'),
  (46,51,'2025-08-28 12:00:00','Trainer Jamie: Ashgrove Update','See you at Friday Indoor Cycling!'),
  (47,52,'2025-08-28 12:30:00','Trainer Casey G.: Strength & Form','Form checks before heavier sets.'),
  (48,53,'2025-08-28 13:00:00','Trainer Taylor Y.: City Schedule','Extra midday Yoga in Brisbane.'),
  (49,54,'2025-08-28 13:30:00','Trainer Alex M.: Chermside Crew','Thanks for the awesome energy!'),
  (50,55,'2025-08-28 14:00:00','Trainer Jordan K.: Breathwork','Breath drives movement.'),
  (51,56,'2025-08-28 14:30:00','Trainer Casey S.: Core Prep','Activate core before Abs.'),
  (52,57,'2025-08-28 15:00:00','Trainer Harper: Balance Drills','Static holds, dynamic balance.'),
  (53,58,'2025-08-28 15:30:00','Trainer Sam: HIIT Blocks','3x5min blocks this Friday.'),
  (54,59,'2025-08-28 16:00:00','Trainer Avery: Mobility','Hips and ankles this weekend.'),
  (55,60,'2025-08-28 16:30:00','Trainer Rowan: Cycling Routes','New scenic routes uploaded.'),
  (56,25,'2025-08-28 17:00:00','First Timer','Tried Ashgrove Yoga today!'),
  (57,26,'2025-08-28 17:15:00','Getting Started','Booked my first two classes.'),
  (58,27,'2025-08-28 17:30:00','Ashgrove Squad','Great vibe at the studio.'),
  (59,28,'2025-08-28 17:45:00','City Crew','Brisbane lunch class was perfect.'),
  (60,29,'2025-08-28 18:00:00','Flow State','Morning Yoga hit different.'),
  (61,30,'2025-08-28 18:15:00','Spin Up','Booked Friday cycling!'),
  (62,31,'2025-08-28 18:30:00','Graceville Hello','HIIT tonight, let’s go!'),
  (63,32,'2025-08-28 18:45:00','City Abs','Core class was spicy.'),
  (64,33,'2025-08-28 19:00:00','Bike Cadence','Working on smoother pedal stroke.'),
  (65,34,'2025-08-28 19:15:00','Friday Plans','Zumba then brunch.'),
  (66,35,'2025-08-28 19:30:00','Consistency','Another week, another session.');
