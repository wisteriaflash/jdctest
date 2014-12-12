<?php
  //vars
  $fileName = 'data.json';
  
  
  //switch
  // $type = 'aa';
  // if(isset($_POST['type'])){
  //   echo "bbb";
  // }else{
  //   echo $type;
  // }

  $type = isset($_POST['type']) ? $_POST['type'] : 'edit';
  if($type == 'save'){
    saveJsonData($_POST['data']);
  }else{
    getJsonData();
  }


  //funs
  function getJsonData(){
    header('Content-Type: application/json'); //set header
    $jsonData = file_get_contents($GLOBALS['fileName']);
    $jsonArray = json_decode($jsonData);
    echo json_encode($jsonArray);
  }

  function saveJsonData($value){
    file_put_contents($GLOBALS['fileName'], $value);
    echo "ok";
  }

?>