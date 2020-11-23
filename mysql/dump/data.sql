CREATE DATABASE IF NOT EXISTS `compsecproject`;
USE `compsecproject`;

DROP TABLE IF EXISTS `users_entity`;
CREATE TABLE `users_entity` (
    `username`  VARCHAR(20) PRIMARY KEY,
    `hashedPassword`  VARCHAR(255) NOT NULL,
    `isModerator`   TINYINT NOT NULL DEFAULT 0
);

INSERT INTO `users_entity` (`username`, `hashedPassword`, `isModerator`) VALUES ('admin', '$2a$12$2VTEQGlWBfzPVcZI.qEIDelObbhCjRpQgXOYuj6dI/fefmwO9VNLG', 1);