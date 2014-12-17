<?php
  //vars
  $fileName = 'data.json';
  
  //switch
  $type = isset($_GET['type']) ? $_GET['type'] : '';
  //switch
  if($type && $type == 'get'){
    getJsonData();
  }else if($type && $type == 'lottery'){
    lottery($_GET['index']);
  }


  //funs
  function getJsonData(){
    header('Content-Type: application/json'); //set header
    $jsonData = file_get_contents($GLOBALS['fileName']);
    $jsonArray = json_decode($jsonData);
    echo json_encode($jsonArray);
  }

  function saveJsonData($value){
    // file_put_contents($GLOBALS['fileName'], $value);
    echo "ok";
  }

  // lottery(0);
  //lottery
  function lottery($index){
    //getData
    $jsonData = file_get_contents($GLOBALS['fileName']);
    $jsonArray = json_decode($jsonData);


    //lotteryArr
    $lotteryArr = $jsonArray->lottery;
    if(count($lotteryArr)>0){
      $rand_key = array_rand($lotteryArr);
      $rand_value = $lotteryArr[$rand_key];
      unset($lotteryArr[$rand_key]);
      
      //echo
      // echo $rand_value.'=====';
      // echo json_encode(array_values($lotteryArr));
      
      //save data
      $jsonArray->winners++;
      $jsonArray->lottery = array_values($lotteryArr);
      $userItem = $jsonArray->items[$index];
      $userItem->giftforID = $rand_value;

      //save
      $value = json_encode($jsonArray);

      //echo
      // echo "<br>";
      // echo json_encode($jsonArray);
      file_put_contents($GLOBALS['fileName'], $value);
      $result = array('status'=>'success','giftforID'=> $rand_value);
    }else{
      $result = array('status'=>'error','msg'=> '出错啦！');
    }

    //return
    header('Content-Type: application/json'); //set header
    echo json_encode($result);
  }

?>