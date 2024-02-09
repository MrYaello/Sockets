USE sockets;

CREATE TABLE user (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(50) DEFAULT NULL,
  password TEXT DEFAULT NULL,
  salt varchar(8) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  phonenumber varchar(15) DEFAULT NULL,
  isOnline BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id)
);

CREATE TABLE chatgroup (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  avatar varchar(255) DEFAULT "UNSET",
  PRIMARY KEY (id)
);

CREATE TABLE message (
  id int NOT NULL AUTO_INCREMENT,
  sender_id int NOT NULL,
  recipient_id int NOT NULL, 
  postDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  content TEXT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (sender_id) REFERENCES user(id),
  FOREIGN KEY (recipient_id) REFERENCES chatgroup(id)
);

CREATE TABLE user_chatgroup (
  user_id int NOT NULL,
  group_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (group_id) REFERENCES chatgroup(id)
);

CREATE TABLE verification (
  email varchar(255) DEFAULT NULL,
  code varchar(6) DEFAULT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE EVENT clearDeadCodes
    ON SCHEDULE
      EVERY 1 HOUR
    DO
      DELETE FROM sockets.verification WHERE DATE_SUB(CURDATE(), INTERVAL 30 MINUTE) >= created;

