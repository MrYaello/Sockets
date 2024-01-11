-- Selecciona la tabla a usar, debe ser creada anteriormente.
USE sockets;
-- Crea la tabla de usuarios con primary key auto incremental.
CREATE TABLE user (
  user_id int NOT NULL AUTO_INCREMENT,
  username varchar(50) DEFAULT NULL,
  password TEXT DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  phonenumber varchar(15) DEFAULT NULL,
  avatar varchar(255) DEFAULT NULL,
  state varchar(50) DEFAULT NULL,
  isOnline BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id)
);

CREATE TABLE message (
  message_id int NOT NULL AUTO_INCREMENT,
  sender_id int NOT NULL,
  recipient_id int NOT NULL, -- Se deberia eliminar para crear otra tabla con los mensajes para habilitar grupos.
  postDate DATETIME NOT NULL,
  content TEXT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id),
  FOREIGN KEY (recipient_id) REFERENCES users(user_id)
);

