/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

INSERT INTO `mysql`.`user` (`Host`, `User`, `Password`, `Select_priv`, `Insert_priv`, `Update_priv`, `Delete_priv`, `Create_priv`, `Drop_priv`, `Reload_priv`, `Shutdown_priv`, `Process_priv`, `File_priv`, `Grant_priv`, `References_priv`, `Index_priv`, `Alter_priv`, `Show_db_priv`, `Super_priv`, `Create_tmp_table_priv`, `Lock_tables_priv`, `Execute_priv`, `Repl_slave_priv`, `Repl_client_priv`, `Create_view_priv`, `Show_view_priv`, `Create_routine_priv`, `Alter_routine_priv`, `Create_user_priv`, `Event_priv`, `Trigger_priv`, `Create_tablespace_priv`, `ssl_cipher`,`x509_issuer`, `x509_subject`, `authentication_string`) VALUES ('%', 'ab-erp', PASSWORD('ab-erp'), 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '', '', '', '');

FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS `ab-erp` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `ab-erp`;

CREATE TABLE IF NOT EXISTS `refreshtokens` (
  `rt_id` int(11) NOT NULL AUTO_INCREMENT,
  `rt_user_id` int(11) DEFAULT NULL,
  `rt_token` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_created` datetime NOT NULL,
  `rt_updated` datetime NOT NULL,
  `rt_expires` datetime NOT NULL,
  `rt_ip` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`rt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
	(1, 'admin', '$2b$10$uVlRw/eP08DN3dK5uL3DOOPuyFo8tilaqDUBQ.76CSIGdF8eCAhzK', 'Dmitri', 'Nekhludoff', 'Europe/Moscow', 1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
