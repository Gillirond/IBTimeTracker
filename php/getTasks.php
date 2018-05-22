<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

try {
//load composer mongo drivers
require '../vendor/autoload.php';

   //connect to mongodb
   $m = new MongoDB\Client("mongodb://localhost:27017");
   //select a database
   $db = $m->ibtimetrackerdb;
   //select a collection
   $activeTaskCol = $db->active;
   //check if there is an active task
   $activeTask = $activeTaskCol->findOne();
   $answer = array();
   if($activeTask) {
      $activeTaskArr = array(
            "name"=>$activeTask['name'],
            "project"=>$activeTask['project'],
            "startTime"=>$activeTask['startTime']
      );
      $answer["active"] = $activeTaskArr;
   }

   $taskListCol = $db->tasklist;
   $taskListCurs = $taskListCol->find([], array("_id" => 0));
   $taskListArr = array();
   foreach($taskListCurs as $t) {
      $temp = array("name" => $t["name"],
                    "project" => $t["project"],
                    "startTime" => $t["startTime"],
                    "endTime" => $t["endTime"]);
      array_push($taskListArr, $temp);
   }
   //copy tasks to answer array
   if(count($taskListArr)) {
      $answer["tasklist"] = $taskListArr;
      }


   echo json_encode($answer);

} catch (MongoConnectionException $e) {
        die('Error connecting to MongoDB server');
       } catch (MongoException $e) {
        die('Error: ' . $e->getMessage());
       }
?>
