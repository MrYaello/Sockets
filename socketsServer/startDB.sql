USE sockets;

CREATE TABLE user (
  user_id int NOT NULL AUTO_INCREMENT,
  username varchar(50) DEFAULT NULL,
  password TEXT DEFAULT NULL,
  salt varchar(8) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  phonenumber varchar(15) DEFAULT NULL,
  avatar varchar(255) DEFAULT "UNSET",
  state varchar(50) DEFAULT NULL,
  isOnline BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id)
);

CREATE TABLE chatgroup (
  group_id int NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (group_id)
);

CREATE TABLE message (
  message_id int NOT NULL AUTO_INCREMENT,
  sender_id int NOT NULL,
  recipient_id int NOT NULL, 
  postDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  content TEXT DEFAULT NULL,
  PRIMARY KEY (message_id),
  FOREIGN KEY (sender_id) REFERENCES user(user_id),
  FOREIGN KEY (recipient_id) REFERENCES chatgroup(group_id)
);

CREATE TABLE user_chatgroup (
  member_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  group_id int NOT NULL,
  PRIMARY KEY (member_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (group_id) REFERENCES chatgroup(group_id)
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

