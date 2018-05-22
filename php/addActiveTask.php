<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

try {
//load composer mongo drivers
require '../vendor/autoload.php';

   $active_task = json_decode(file_get_contents('php://input'), true);
   $name = $active_task['name'];
   $project = $active_task['project'];
   $startTime= $active_task['starttime'];

   //connect to mongodb
   $m = new MongoDB\Client("mongodb://localhost:27017");
   //select a database
   $db = $m->ibtimetrackerdb;
   //select a collection
   $activeTaskCol = $db->active;

   //check if there is already an active task
   $activecursor = $activeTaskCol->find();
   if(count($activecursor->toArray())) {
       $activeTaskCol->deleteMany($activecursor, array('safe'=>true));
   }
   $arr = array(
         "name"=>$name,
         "project"=>$project,
         "startTime"=>$startTime
      );
   //add active task
   $activeTaskCol->insertOne($arr);

} catch (MongoConnectionException $e) {
        die('Error connecting to MongoDB server');
       } catch (MongoException $e) {
        die('Error: ' . $e->getMessage());
       }
?>
