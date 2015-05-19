<?php
  //vars
  $fileName = 'data.json';
  
  //switch
  $type = null;
  if(isset($_GET['type'])){
    $type = $_GET['type'];
  }else if(isset($_POST['type'])){
    $type = $_POST['type'];
  }

  //switch
  if($type && $type == 'get'){
    getJsonData();
  }else if($type && $type == 'save'){
    saveJsonData();
  }

  //funs
  function getJsonData(){
    header('Content-Type: application/json'); //set header
    $jsonData = file_get_contents($GLOBALS['fileName']);
    $jsonArray = json_decode($jsonData);
    $callback = $_GET['callback'];  //jsonp
    echo $callback."(".json_encode($jsonArray).")";
  }

  function saveJsonData(){
    $value = $_POST['datas'];
    file_put_contents($GLOBALS['fileName'], $value);
    echo 'ok';
  }
?>