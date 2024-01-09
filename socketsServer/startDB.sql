-- Selecciona la tabla a usar, debe ser creada anteriormente.
USE sockets;
-- Crea la tabla de usuarios con primary key auto incremental.
CREATE TABLE users (
  user_id int NOT NULL AUTO_INCREMENT,
  username varchar(50) DEFAULT NULL,
  password TEXT DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  phonenumber varchar(15) DEFAULT NULL,
  avatar varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE messages (
  message_id int NOT NULL AUTO_INCREMENT,
  sender_id int NOT NULL,
  recipient_id int NOT NULL,
  postDate DATETIME NOT NULL,
  content TEXT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(sender) REFERENCES users(id),
  FOREIGN KEY(recipient) REFERENCES users(id)
)
