-- MariaDB dump 10.19  Distrib 10.4.19-MariaDB, for Linux (aarch64)
--
-- Host: localhost    Database: retail_store
-- ------------------------------------------------------
-- Server version	10.4.19-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES (1,'admin@example.com','$2a$10$6VjU.x9ISSkADftkNkkD/u8EViJsggbEQp66JtLLMca44M.dRIXaS');
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brand` (
  `brand_id` int(11) NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(128) NOT NULL,
  `website` varchar(512) DEFAULT NULL,
  `location` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Zara','https://www.zara.com','3100 Howard Ave, Windsor, ON N8X 3Y8'),(2,'H&M','https://www2.hm.com/en_ca/index.html','N8X 3Y8 Windsor Windsor , Canada'),(3,'Nike','https://www.nike.com/ca','1680 Richmond St.\r\n\r\nLondon, Ontario, N6G 3Y9, CA'),(4,'Adidas','https://www.adidas.ca/en','389 Queen St. West\r\nToronto, Ontario\r\nM5V 2A5');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand_products`
--

DROP TABLE IF EXISTS `brand_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brand_products` (
  `brand_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `production_location` varchar(128) NOT NULL,
  PRIMARY KEY (`brand_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `brand_products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `brand_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand_products`
--

LOCK TABLES `brand_products` WRITE;
/*!40000 ALTER TABLE `brand_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `brand_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  PRIMARY KEY (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Clothing'),(2,'Outerwear'),(3,'Accessories'),(4,'Shoes');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `fname` varchar(20) DEFAULT NULL,
  `lname` varchar(20) DEFAULT NULL,
  `password` varchar(64) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'rgeng','Xiaoshuai','Geng1','$2a$10$ZK6YfDqfOMvP3JjS/SPJ/ucFO4ieRR20SgEPRWW6p/0lUoSIvaos.','401 Sunset Ave, Windsor, ON, Canada','geng115@uwindsor.ca'),(7,'geng115@uwindsor.ca','Xiaoshuai','Geng','$2a$10$Vj.SLqWJxkbgmgVzREEweeyIQWi3kfXOjsf1veJIJ0ZAj3KmRM32S','401 Sunset Ave, Windsor, ON, Canada','geng115@uwindsor.ca'),(8,'agreen@example.com','Aaron','Green','$2a$10$Ugyg0GctHEXV07CO0BsV4.3jvU5VxfYp7DqTZ.JiZUysfs5TjxQ7e','932 Elm, Windsor, ON, Canada','agreen@example.com'),(9,'jameel',NULL,NULL,'$2a$10$wbRWRbWHGKc76dudwFg2e.j2uHTCkZ2SymuHWheV40mawe5PQTPuS',NULL,NULL),(10,'admin@example.com',NULL,NULL,'$2a$10$iephnpOMUy62uPc7id1pQOHkpLmxC6tZQ6CuDLgaGDLxOQ3bqXrRm',NULL,NULL),(11,'jameel@example.com',NULL,NULL,'$2a$10$de1ptoxxeVxOj7bhuKLRiu5oyFrRILdtcxMohy9mr5pyj9mlOKi5m',NULL,NULL);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_orders`
--

DROP TABLE IF EXISTS `customer_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_orders` (
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  PRIMARY KEY (`customer_id`,`order_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `customer_orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `customer_orders_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_orders`
--

LOCK TABLES `customer_orders` WRITE;
/*!40000 ALTER TABLE `customer_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `payment_status` varchar(20) NOT NULL DEFAULT 'Incomplete',
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`) USING BTREE,
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,7,'2021-11-17 08:14:13','complete'),(2,1,'2021-11-03 08:12:41','complete'),(3,7,'2021-09-07 08:13:43','complete'),(4,8,'2021-11-04 08:20:20','Incomplete'),(5,1,'2021-11-13 08:20:20','Incomplete'),(6,8,'2021-11-17 08:21:05','complete'),(7,1,'2021-07-14 08:20:20','complete'),(8,8,'2021-11-01 08:20:20','complete'),(10,7,'2021-11-18 20:38:13','Incomplete'),(11,7,'2021-11-18 20:38:40','Incomplete'),(12,7,'2021-11-18 20:50:18','Incomplete'),(13,7,'2021-11-18 20:51:25','Incomplete'),(14,7,'2021-11-19 12:10:47','Incomplete'),(19,7,'2021-11-19 16:01:36','Incomplete'),(20,7,'2021-11-19 16:14:56','Incomplete'),(21,7,'2021-11-19 16:20:20','Incomplete'),(22,7,'2021-11-19 16:20:57','Incomplete'),(23,7,'2021-11-19 16:28:08','Incomplete'),(24,7,'2021-11-19 16:29:46','Incomplete'),(25,7,'2021-11-19 16:30:24','Incomplete'),(26,7,'2021-11-19 16:31:03','Incomplete'),(27,7,'2021-11-19 16:33:33','Incomplete'),(28,7,'2021-11-19 16:34:40','Incomplete'),(29,7,'2021-11-19 16:51:21','Incomplete'),(30,7,'2021-11-19 16:52:10','Incomplete'),(31,7,'2021-11-19 16:55:11','Incomplete'),(32,7,'2021-11-19 16:59:55','Incomplete'),(33,7,'2021-11-19 17:10:38','Incomplete'),(34,7,'2021-11-25 16:43:29','Incomplete'),(35,10,'2021-11-25 16:47:05','Incomplete'),(36,10,'2021-11-25 17:02:21','Incomplete'),(37,10,'2021-11-25 18:15:22','Incomplete'),(38,10,'2021-11-25 18:15:53','Incomplete'),(39,10,'2021-11-25 18:16:04','Incomplete'),(40,10,'2021-11-25 18:28:35','Incomplete'),(41,10,'2021-11-25 18:28:52','Incomplete'),(42,10,'2021-11-25 18:30:16','Incomplete'),(43,10,'2021-11-25 18:31:00','Incomplete'),(44,10,'2021-11-25 18:33:09','Incomplete'),(45,10,'2021-11-25 18:37:47','Incomplete'),(46,9,'2021-11-25 18:57:08','Incomplete');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_history`
--

DROP TABLE IF EXISTS `order_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_history` (
  `order_history_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `price_each` double(10,2) NOT NULL,
  PRIMARY KEY (`order_history_id`,`order_id`,`product_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  CONSTRAINT `order_history_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_history`
--

LOCK TABLES `order_history` WRITE;
/*!40000 ALTER TABLE `order_history` DISABLE KEYS */;
INSERT INTO `order_history` VALUES (1,13,3,7,419.93,59.99),(2,13,4,2,29.98,14.99),(3,14,3,7,419.93,59.99),(4,14,4,2,29.98,14.99),(5,19,4,1,14.99,14.99),(6,19,5,1,34.99,34.99),(7,19,7,1,120.00,120.00),(8,20,3,3,179.97,59.99),(9,20,7,1,120.00,120.00),(10,21,3,3,179.97,59.99),(11,22,3,3,179.97,59.99),(12,23,3,2,119.98,59.99),(13,24,3,1,59.99,59.99),(14,25,3,1,59.99,59.99),(15,26,3,1,59.99,59.99),(16,27,3,1,59.99,59.99),(17,28,3,1,59.99,59.99),(18,29,3,1,59.99,59.99),(19,29,5,1,34.99,34.99),(20,30,3,1,59.99,59.99),(21,30,5,1,34.99,34.99),(22,31,3,1,59.99,59.99),(23,32,3,1,59.99,59.99),(24,33,3,2,119.98,59.99),(25,34,3,2,119.98,59.99),(26,35,3,4,239.96,59.99),(27,35,4,1,14.99,14.99),(28,35,5,1,34.99,34.99),(29,35,6,1,19.99,19.99),(30,35,10,1,180.00,180.00),(31,36,3,1,59.99,59.99),(32,36,5,1,34.99,34.99),(33,36,7,1,120.00,120.00),(34,37,3,1,59.99,59.99),(35,38,3,1,59.99,59.99),(36,39,3,1,59.99,59.99),(37,40,3,1,59.99,59.99),(38,41,3,1,59.99,59.99),(39,42,3,1,59.99,59.99),(40,43,3,1,59.99,59.99),(41,44,3,1,59.99,59.99),(42,45,3,2,119.98,59.99),(43,46,3,1,59.99,59.99);
/*!40000 ALTER TABLE `order_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `brand_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` double(10,2) NOT NULL DEFAULT 0.00,
  `image_path` varchar(256) DEFAULT NULL,
  `sku` varchar(32) DEFAULT NULL,
  `item_in_stock` int(11) NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `brand_id` (`brand_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `product_ibfk_4` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (3,1,'GEOMETRIC SWEATER',1,'ROOMY SWEATER WITH ROUND NECK AND LONG SLEEVES. RIB TRIM.\r\n\r\nJOIN LIFE\r\nCARE FOR FIBER: AT LEAST 50% RECYCLED POLYESTER',59.99,'/image.jpg','5755/302',20),(4,2,'Ribbed Modal-blend Top',1,'Fitted top in soft, ribbed cotton and modal jersey. Crew neck and long sleeves.',14.99,NULL,'0999727003',31),(5,2,'Patterned Jersey Pajamas',1,'Pajamas in soft, cotton-blend jersey with a printed pattern. Top with round neckline, dropped shoulders, long sleeves, and trim at neckline and cuffs. Pants with covered, elasticized waistband and cuff at hems.',34.99,NULL,'0925124009',64),(6,2,'Ribbed Leggings',1,'Leggings in soft, ribbed, cotton-blend jersey. Regular waist, waistband with covered elastic, and ankle-length legs with raw-edge hems.',19.99,NULL,'1014382005',57),(7,4,'SUPERSTAR SHOES',4,'THE AUTHENTIC LOW TOP WITH THE SHELL TOE.',120.00,NULL,'EG4958',11),(8,4,'ULTRABOOST 21 SHOES',4,'ENERGY WAS JUST ENERGY UNTIL ENERGY MET ULTRABOOST 21.',250.00,NULL,'FY0306',11),(9,3,'Women\'s Quilted Woven Jacket',1,'Warmth doesn\'t have to be bulky.Perfectly cosy in colder temps, this jacket features a quilted design packed with lightweight insulation so you can leave the marshmallow look in the past.',130.00,NULL,'DD5120-825',5),(10,3,'Nike React Miler 2 Shield',4,'Men\'s Weatherised Road Running Shoes.\r\nDon\'t let the rain stop your daily running routine.We took the classic look of your favourite runner and added a warm upper with a weatherised coating.',180.00,NULL,'DC4064-003',7),(18,3,'Nike Air Max Plus',4,'Let your attitude have the edge in your Nike Air Max Plus, a tuned Air experience that offers premium stability and unbelievable cushioning.Featuring gradient colouring inspired by flames and the original OG\'s wavy design lines, it celebrates your defiant style.',210.00,'/1637878134742.jpg','DB0682-001',50),(20,1,'Nike Free Air Plus Max',1,'It\'s literally just a pair of shoes',215.00,NULL,'5435432',324);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'retail_store'
--

--
-- Dumping routines for database 'retail_store'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-26  0:09:29
