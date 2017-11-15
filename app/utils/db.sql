-- Adminer 4.3.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `hypertube`;
CREATE DATABASE `hypertube` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `hypertube`;

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `movieId` char(36) NOT NULL,
  `comment` longtext NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `download`;
CREATE TABLE `download` (
  `id` varchar(36) NOT NULL,
  `imdbId` varchar(25) NOT NULL,
  `tmdbId` varchar(25) NOT NULL,
  `title` varchar(512) NOT NULL,
  `magnet` text NOT NULL,
  `path` varchar(1024) DEFAULT NULL,
  `originalPath` varchar(1024) DEFAULT NULL,
  `ext` varchar(5) DEFAULT NULL,
  `originalExt` varchar(5) DEFAULT NULL,
  `length` bigint(20) DEFAULT NULL,
  `provider` varchar(64) DEFAULT NULL,
  `quality` enum('4k','1080p','720p','480p','360p','240p','144p') NOT NULL,
  `state` enum('search','downloading','transcoding','ready','error') NOT NULL DEFAULT 'search',
  `date` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `forget`;
CREATE TABLE `forget` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(36) NOT NULL,
  `token` char(128) NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `subtitles`;
CREATE TABLE `subtitles` (
  `id` varchar(36) NOT NULL,
  `movieId` varchar(36) NOT NULL,
  `path` text NOT NULL,
  `lang` char(2) NOT NULL,
  `encoding` varchar(50) NOT NULL,
  `score` int(11) NOT NULL,
  `date` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `token` char(128) NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `mail` varchar(254) NOT NULL,
  `username` varchar(30) DEFAULT NULL,
  `firstName` varchar(36) NOT NULL,
  `lastName` varchar(36) NOT NULL,
  `password` char(60) DEFAULT NULL,
  `id_42` bigint(20) DEFAULT NULL,
  `id_github` bigint(20) DEFAULT NULL,
  `id_facebook` bigint(20) DEFAULT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail` (`mail`),
  UNIQUE KEY `id_github` (`id_github`),
  UNIQUE KEY `id_42` (`id_42`),
  UNIQUE KEY `id_facebook` (`id_facebook`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `mail`, `username`, `firstName`, `lastName`, `password`, `id_42`, `id_github`, `id_facebook`, `date`) VALUES
('04392f1b-3b62-46a5-ac32-4ad6ca7a2cc5',	'crozet.valentin@gmail.com',	'valentin Crozet',	'valentin',	'Crozet',	
'$2a$10$mlrXnxjjWVmuX0KJGgg3SuqIw4s4Ho1SsSAf8uJ95QiLatb.e76Za',	19053,	20908645,	10214448593830194,	1509113383785),
('8b982131-cfc5-416b-9efb-a15be957c1de',	'oseng@student.42.fr',	'Olivier Seng',	'Olivier',	'Seng',	NULL,	14530,	NULL,	NULL,	1510679520027),
('a98a8c15-0385-4185-a3ff-dd2c3d8b9371',	'malexand@student.42.fr',	'ItsAlex',	'Alexandre',	'MARRE',	'$2a$10$wnoFpwEYg2P6aUiabUjkTesgbBeiae79oVn6a87UQ9mGX0PKaudOG',	
14967,	6404072,	1989671391059360,	1506696221141),
('d985f016-b626-4a2c-81a7-e283ba90aaae',	'giraudthomas38@gmail.com',	'thgiraud',	'thomas',	'giraud',	'$2a$10$7ey.mvzaZmi1c4xwGbY1sOaBgNz.Muu5Qsc162CVV9HNk/pFUIxRK',	
18627,	19876741,	875624989268056,	1509117849276);

DROP TABLE IF EXISTS `viewed`;
CREATE TABLE `viewed` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `imdbId` varchar(25) NOT NULL,
  `tmdbId` varchar(25) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 2017-11-15 10:56:29
