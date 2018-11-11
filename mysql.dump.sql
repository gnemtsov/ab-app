/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE IF NOT EXISTS `abapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `abapp`;

CREATE TABLE IF NOT EXISTS `departments` (
  `d_id` int(11) NOT NULL AUTO_INCREMENT,
  `d_title` varchar(128) DEFAULT NULL,
  `d_head` varchar(128) DEFAULT NULL,
  `d_size` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'Number of employees',
  `d_created` date DEFAULT NULL,
  PRIMARY KEY (`d_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` (`d_id`, `d_title`, `d_head`, `d_size`, `d_created`) VALUES
	(1, 'Linear happiness', 'Kivrin Fedor', 12, '2018-04-28'),
	(2, 'Sense of life', 'Kristobalt Hunta', 52, '2018-04-28'),
	(3, 'Absolute knowledge', 'Pupkoff-zadniy Moris', 32, '2018-04-28'),
	(4, 'Eternal youth', NULL, 63, '2018-04-28'),
	(5, 'Defensive magic', NULL, 0, NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `refreshtokens` (
  `rt_id` int(11) NOT NULL AUTO_INCREMENT,
  `rt_user_id` int(11) DEFAULT NULL,
  `rt_token` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_created` datetime NOT NULL,
  `rt_updated` datetime NOT NULL,
  `rt_expires` datetime NOT NULL,
  `rt_ip` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`rt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `refreshtokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refreshtokens` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `users` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_login` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `u_password` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `u_firstname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `u_lastname` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `u_timezone` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT 'Europe/Moscow',
  `u_access` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`u_id`),
  UNIQUE KEY `LOGIN` (`u_login`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`u_id`, `u_login`, `u_password`, `u_firstname`, `u_lastname`, `u_timezone`, `u_access`) VALUES
	(1, 'admin', '$2a$10$HW2PzCg5PHKpkVcZBjkflevMgogqZmmh5EvKeHZwMYfG/zLP.xuYK', 'Dmitri', 'Nekhludoff', 'Europe/Moscow', 1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

CREATE USER 'abapp'@'%' IDENTIFIED BY 'abapp';
GRANT ALL PRIVILEGES ON abapp.* TO 'abapp'@'%';
FLUSH PRIVILEGES;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
