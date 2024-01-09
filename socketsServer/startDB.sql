-- Selecciona la tabla a usar, debe ser creada anteriormente.
USE sockets;
-- Crea la tabla de usuarios con primary key auto incremental.
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(50) DEFAULT NULL,
  password varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE messages (
  id int NOT NULL AUTO_INCREMENT,
  sender int NOT NULL,
  recipient int NOT NULL,
  content varchar(65535) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(sender) REFERENCES tableName(users),
  FOREIGN KEY(recipient) REFERENCES tableName(users)
)
