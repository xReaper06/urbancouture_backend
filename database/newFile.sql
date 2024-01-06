-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: urbancouture_db
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `item_deliver`
--

DROP TABLE IF EXISTS `item_deliver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_deliver` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(100) NOT NULL,
  `user_id` int NOT NULL,
  `proof` text,
  `status` int NOT NULL DEFAULT '1',
  `dateDelivered` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_deliver`
--

LOCK TABLES `item_deliver` WRITE;
/*!40000 ALTER TABLE `item_deliver` DISABLE KEYS */;
INSERT INTO `item_deliver` VALUES (7,'681722bb6b',6,'images/413120462_1559481064854141_1002883845738169308_n.jpg',2,'2024-01-05 11:06:05'),(8,'d258265949',6,'images/413120462_1559481064854141_1002883845738169308_n.jpg',2,'2024-01-05 13:01:52'),(9,'c530777982',6,'images/414109450_387334797093755_3921422582659426905_n.jpg',2,'2024-01-05 13:01:58'),(10,'c4c21c5b61',6,'images/413348237_907285394347266_4756137832534415662_n.jpg',2,'2024-01-05 13:02:04'),(11,'7f9e32b046',6,'images/413918014_7101459136542833_6201295894764936195_n.jpg',2,'2024-01-05 13:02:10'),(12,'2a4368a3be',6,'images/413257241_393041463173808_9145776292811708226_n.jpg',2,'2024-01-05 13:02:17'),(13,'952a5a41a5',6,'images/413348237_907285394347266_4756137832534415662_n.jpg',2,'2024-01-05 13:02:23');
/*!40000 ALTER TABLE `item_deliver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `json_token`
--

DROP TABLE IF EXISTS `json_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `json_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT (0),
  `token` text NOT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `json_token`
--

LOCK TABLES `json_token` WRITE;
/*!40000 ALTER TABLE `json_token` DISABLE KEYS */;
INSERT INTO `json_token` VALUES (69,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzA0NDMwOTY4LCJleHAiOjE3MDQ1MTczNjh9.pz_fx1v6eUpAcdBS39i0oaieuCQPputh2yIqbvZdEvE','2024-01-05 13:02:48',NULL);
/*!40000 ALTER TABLE `json_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `content` text NOT NULL,
  `is_read` int NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'b1f461eda3',4,1,'hi',0,'2024-01-03 19:54:11',NULL),(2,'b1f461eda3',4,1,'hi',0,'2024-01-03 20:01:22',NULL),(3,'b1f461eda3',4,1,'hello',0,'2024-01-03 20:01:29',NULL),(4,'b1f461eda3',4,1,'zup',0,'2024-01-03 20:01:34',NULL),(5,'b1f461eda3',4,1,'zip',0,'2024-01-03 20:02:24',NULL),(6,'b1f461eda3',4,1,'kumusta?',0,'2024-01-03 20:04:54',NULL),(7,'b1f461eda3',4,1,'okay raka diha?',0,'2024-01-03 20:05:44',NULL),(8,'b1f461eda3',4,1,'tarung?',0,'2024-01-03 20:05:51',NULL),(9,'b1f461eda3',5,1,'hi',0,'2024-01-03 20:22:04',NULL),(10,'b1f461eda3',5,1,'hi',0,'2024-01-03 20:22:45',NULL),(11,'b1f461eda3',4,1,'hello po',0,'2024-01-03 20:22:54',NULL),(12,'994e0595fb',5,1,'sup?',0,'2024-01-03 20:22:59',NULL),(13,'994e0595fb',4,1,'hello',0,'2024-01-03 20:23:07',NULL),(14,'994e0595fb',4,1,'hi',0,'2024-01-04 15:06:37',NULL),(15,'994e0595fb',5,1,'hello',0,'2024-01-04 15:06:48',NULL),(16,'e5939af2dc',4,1,'dugay pa?',0,'2024-01-04 15:19:55',NULL),(17,'e5939af2dc',5,1,'ohh',0,'2024-01-04 15:20:32',NULL),(18,'681722bb6b',4,1,'hi',0,'2024-01-05 11:08:12',NULL),(19,'681722bb6b',5,1,'hello',0,'2024-01-05 11:08:20',NULL);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_cart`
--

DROP TABLE IF EXISTS `product_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(20,2) NOT NULL DEFAULT '0.00',
  `status` int NOT NULL DEFAULT '0',
  `is_deleted` int NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_cart`
--

LOCK TABLES `product_cart` WRITE;
/*!40000 ALTER TABLE `product_cart` DISABLE KEYS */;
INSERT INTO `product_cart` VALUES (41,'1ef3b41b1e',4,4,1,999.00,2,0,'2024-01-05 11:04:20','2024-01-05 11:04:35'),(42,'d8942ada5f',4,6,1,1000.00,2,0,'2024-01-05 11:04:27','2024-01-05 11:04:35'),(43,'ca239d0fea',4,5,4,1600.00,2,0,'2024-01-05 12:47:51','2024-01-05 12:48:05'),(44,'a8cc4979e4',4,8,3,894.00,2,0,'2024-01-05 12:47:57','2024-01-05 12:48:05'),(45,'569d363698',4,4,2,1998.00,2,0,'2024-01-05 12:49:59','2024-01-05 12:50:14'),(46,'562d3ba290',4,6,2,2000.00,2,0,'2024-01-05 12:50:07','2024-01-05 12:50:14'),(47,'301c644013',4,4,1,999.00,2,0,'2024-01-05 12:54:54','2024-01-05 12:55:08'),(48,'0b53f7228a',4,5,1,400.00,2,0,'2024-01-05 12:54:59','2024-01-05 12:55:08'),(49,'6a01e0562d',4,4,1,999.00,2,0,'2024-01-05 12:56:29','2024-01-05 12:56:34'),(50,'4c6c15223d',4,7,2,8000.00,2,0,'2024-01-05 12:58:44','2024-01-05 12:58:58'),(51,'ed6de953b1',4,7,1,4000.00,2,0,'2024-01-05 12:59:04','2024-01-05 12:59:12');
/*!40000 ALTER TABLE `product_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_checkout`
--

DROP TABLE IF EXISTS `product_checkout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_checkout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(100) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `products` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `totalPrice` decimal(20,2) NOT NULL,
  `status` int NOT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_checkout`
--

LOCK TABLES `product_checkout` WRITE;
/*!40000 ALTER TABLE `product_checkout` DISABLE KEYS */;
INSERT INTO `product_checkout` VALUES (15,'681722bb6b','4','[{\"id\":4,\"image\":\"images/413120462_1559481064854141_1002883845738169308_n.jpg\",\"productname\":\"White suit\",\"quantity\":1,\"price\":999},{\"id\":6,\"image\":\"images/413348237_907285394347266_4756137832534415662_n.jpg\",\"productname\":\"White blue\",\"quantity\":1,\"price\":1000}]',1999.00,6,'2024-01-05 11:04:35',NULL),(16,'d258265949','4','[{\"id\":5,\"image\":\"images/413257241_393041463173808_9145776292811708226_n.jpg\",\"productname\":\"Black brown\",\"quantity\":4,\"price\":1600},{\"id\":8,\"image\":\"images/414109450_387334797093755_3921422582659426905_n.jpg\",\"productname\":\"Black white\",\"quantity\":3,\"price\":894}]',2494.00,6,'2024-01-05 12:48:05',NULL),(17,'c530777982','4','[{\"id\":4,\"image\":\"images/413120462_1559481064854141_1002883845738169308_n.jpg\",\"productname\":\"White suit\",\"quantity\":2,\"price\":1998},{\"id\":6,\"image\":\"images/413348237_907285394347266_4756137832534415662_n.jpg\",\"productname\":\"White blue\",\"quantity\":2,\"price\":2000}]',3998.00,6,'2024-01-05 12:50:14',NULL),(18,'c4c21c5b61','4','[{\"id\":4,\"image\":\"images/413120462_1559481064854141_1002883845738169308_n.jpg\",\"productname\":\"White suit\",\"quantity\":1,\"price\":999},{\"id\":5,\"image\":\"images/413257241_393041463173808_9145776292811708226_n.jpg\",\"productname\":\"Black brown\",\"quantity\":1,\"price\":400}]',1399.00,6,'2024-01-05 12:55:08',NULL),(19,'2a4368a3be','4','[{\"id\":4,\"image\":\"images/413120462_1559481064854141_1002883845738169308_n.jpg\",\"productname\":\"White suit\",\"quantity\":1,\"price\":999}]',999.00,6,'2024-01-05 12:56:35',NULL),(20,'7f9e32b046','4','[{\"id\":7,\"image\":\"images/413918014_7101459136542833_6201295894764936195_n.jpg\",\"productname\":\"Nice Suit\",\"quantity\":2,\"price\":8000}]',8000.00,6,'2024-01-05 12:58:58',NULL),(21,'952a5a41a5','4','[{\"id\":7,\"image\":\"images/413918014_7101459136542833_6201295894764936195_n.jpg\",\"productname\":\"Nice Suit\",\"quantity\":1,\"price\":4000}]',4000.00,6,'2024-01-05 12:59:12',NULL);
/*!40000 ALTER TABLE `product_checkout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_ratings`
--

DROP TABLE IF EXISTS `product_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `stars` int NOT NULL,
  `comment` text,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_ratings`
--

LOCK TABLES `product_ratings` WRITE;
/*!40000 ALTER TABLE `product_ratings` DISABLE KEYS */;
INSERT INTO `product_ratings` VALUES (6,4,4,4,'this item is good and its exactly like the picture','2024-01-05 11:06:57'),(7,6,4,5,'this item is Good and its the same as the picture','2024-01-05 11:07:28'),(8,5,4,4,'asdgasdg','2024-01-05 13:03:00'),(9,8,4,4,'asdgasdhasd','2024-01-05 13:03:08'),(10,7,4,4,'adfhasdf','2024-01-05 13:03:46');
/*!40000 ALTER TABLE `product_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `image` text NOT NULL,
  `productname` varchar(50) NOT NULL,
  `productdesc` text,
  `original_stocks` int NOT NULL,
  `updated_stocks` int NOT NULL DEFAULT '0',
  `price` decimal(20,2) NOT NULL,
  `status` int NOT NULL DEFAULT '0',
  `is_deleted` int DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (4,5,'images/413120462_1559481064854141_1002883845738169308_n.jpg','White suit','this is a white suit',150,145,999.00,2,0,'2024-01-05 10:53:40',NULL),(5,5,'images/413257241_393041463173808_9145776292811708226_n.jpg','Black brown','this is a black brown',100,95,400.00,0,0,'2024-01-05 10:55:17',NULL),(6,5,'images/413348237_907285394347266_4756137832534415662_n.jpg','White blue','this is a white blue',160,157,1000.00,0,0,'2024-01-05 10:55:53',NULL),(7,5,'images/413918014_7101459136542833_6201295894764936195_n.jpg','Nice Suit','This is a nice Suit',1000,997,4000.00,0,0,'2024-01-05 10:56:29',NULL),(8,5,'images/414109450_387334797093755_3921422582659426905_n.jpg','Black white','this is a Black white',100,97,298.00,0,0,'2024-01-05 10:57:12',NULL),(9,5,'images/414201481_701035105460422_2055208688526954366_n.jpg','White dirty Black','this is a White dirty Black',100,100,300.00,0,0,'2024-01-05 10:57:51',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rider_applicant`
--

DROP TABLE IF EXISTS `rider_applicant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rider_applicant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `file` text NOT NULL,
  `status` int NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rider_applicant`
--

LOCK TABLES `rider_applicant` WRITE;
/*!40000 ALTER TABLE `rider_applicant` DISABLE KEYS */;
INSERT INTO `rider_applicant` VALUES (1,'helldeadpool456@gmail.com','images/sample PDF.pdf',2,'2023-12-31 15:10:08'),(2,'helldead@gmail.com','images/sample PDF.pdf',2,'2024-01-04 15:08:13');
/*!40000 ALTER TABLE `rider_applicant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `role_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,3,'admin'),(2,2,'rider'),(3,1,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `user_id` int NOT NULL,
  `created` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (6,'681722bb6b',4,'2024-01-05 11:04:35'),(7,'d258265949',4,'2024-01-05 12:48:05'),(8,'c530777982',4,'2024-01-05 12:50:14'),(9,'c4c21c5b61',4,'2024-01-05 12:55:09'),(10,'2a4368a3be',4,'2024-01-05 12:56:35'),(11,'7f9e32b046',4,'2024-01-05 12:58:58'),(12,'952a5a41a5',4,'2024-01-05 12:59:12');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `sitio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `baranggay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `zipcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (3,4,'camolinas','poblacion','cordova','cebu','6011',2,'2023-12-30 12:11:20','2024-01-03 14:38:40'),(4,5,'admin','admin','admin','admin','admin',1,'2023-12-30 12:12:41',NULL),(5,6,'camolinas','poblacion','cordova','cebu','8124',1,'2023-12-31 17:33:17',NULL),(6,7,'Camolinas','Poblacion','Cordova','Cebu','6017',1,'2024-01-02 12:21:14',NULL),(7,8,'camolinas','poblacion','cordova','cebu','6017',1,'2024-01-04 15:11:07',NULL);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `mname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (3,4,'John Francis','Astillero','Ompad','user@gmail.com','0919-345-8847',1,'2023-12-30 12:11:20',NULL),(4,5,'admin','admin','admin','admin@admin.com','0000-000-0000',1,'2023-12-30 12:12:41',NULL),(5,6,'rider','rider','rider','rider@gmail.com','0923-241-2551',1,'2023-12-31 17:33:18',NULL),(6,7,'user2','user2','user2','user2@gmail.com','0923-234-2556',1,'2024-01-02 12:21:15',NULL),(7,8,'francis','astillero','ompad','helldead@gmail.com','0919-324-8024',1,'2024-01-04 15:11:07',NULL);
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profile`
--

LOCK TABLES `user_profile` WRITE;
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
INSERT INTO `user_profile` VALUES (1,2,'images/Screenshot from 2023-12-28 19-53-57.png','2023-12-30 11:03:09',NULL),(2,3,'images/Screenshot from 2023-12-28 19-53-57.png','2023-12-30 11:05:58',NULL),(3,4,'images/Screenshot from 2023-12-30 15-22-49.png','2023-12-30 12:11:20','2024-01-03 14:38:26'),(4,5,'images/Screenshot from 2023-12-28 19-53-57.png','2023-12-30 12:12:41',NULL),(5,6,'images/Screenshot from 2023-12-28 19-53-57.png','2023-12-31 17:33:19',NULL),(6,7,'images/Screenshot from 2023-12-28 19-53-57.png','2024-01-02 12:21:15',NULL),(7,8,'images/Screenshot from 2023-12-30 15-22-49.png','2024-01-04 15:11:07',NULL);
/*!40000 ALTER TABLE `user_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL DEFAULT (1),
  `last_loggin` datetime DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT '0',
  `created` timestamp NULL DEFAULT NULL,
  `updated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'user','$2a$10$4m/hHvGIKQMdFq9.GtPi6.zNyUvNt5/JNzwppJCyRaYSJc0SQSXg6',1,'2024-01-05 13:02:48','online','2023-12-30 04:11:20',NULL),(5,'admin','$2a$10$vbI2e0Kfhef95yNnEB70iOY9WTYAR0H0ARMwaI5v30Y2b7g5cSkGK',3,'2024-01-06 13:50:38','0','2023-12-30 04:12:41',NULL),(6,'rider','$2a$10$WQCD7WFgf2KnYy9WHnCtte6us9MTHNyXsV75OrocLicxXwW5D7yay',2,'2024-01-05 13:02:40','0','2023-12-31 09:33:15',NULL),(7,'user2','$2a$10$h4sbhgd5wJmUnFcpBcLrr.Ex80xmgM/BvUVLgev.62vMfOu5rv27i',1,'2024-01-02 13:50:18','0','2024-01-02 04:21:14',NULL),(8,'rider2','$2a$10$rIRGOw1hw5geNBF7bkKPsuRNr3vhbW.w5j81K5OlRptDTvfOGQ3BC',2,'2024-01-04 15:17:52','0','2024-01-04 07:11:07',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-06 14:41:25
