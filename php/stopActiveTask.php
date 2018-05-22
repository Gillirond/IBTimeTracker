<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

try {
//load composer mongo drivers
require '../vendor/autoload.php';

   $json = json_decode(file_get_contents('php://input'), true);
   $endTime = $json['endtime'];
   //connect to mongodb
   $m = new MongoDB\Client("mongodb://localhost:27017");
   //select a database
   $db = $m->ibtimetrackerdb;
   //select a collection
   $activeTaskCol = $db->active;
   //check if there is an active task
   $activetask = $activeTaskCol->findOne();
   $arr = array(
         "name"=>$activetask['name'],
         "project"=>$activetask['project'],
         "startTime"=>$activetask['startTime'],
         "endTime"=>$endTime
   );

   //delete active task from active tasks collection
   $deleteResult = $activeTaskCol->deleteMany([]);

   $taskListCol = $db->tasklist;
   //copy active task to tasklist collection
   $taskListCol->insertOne($arr);

} catch (MongoConnectionException $e) {
        die('Error connecting to MongoDB server');
       } catch (MongoException $e) {
        die('Error: ' . $e->getMessage());
       }
?>
