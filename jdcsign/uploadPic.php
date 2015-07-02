<?php

//switch
if(isset($_FILES["upload_image"])){
    uploadImage();
}else if(isset($_FILES["upload_logo"])){
    uploadLogo();
}elseif (isset($_POST['type']) && $_POST['type'] == 'crop') {
    cropImage();
}

function uploadImage(){
    //getUplaodImg
    $errMsg = $_FILES["upload_image"]["error"];
    //
    if ($errMsg > 0){
        $result = array('status'=>'error','msg'=> $errMsg);
    }else{
        //max
        $maxSize = 300;
        //success
        $path = $_FILES["upload_image"]["tmp_name"];
        $src = imagecreatefromstring(file_get_contents($path));
        list($imgW, $imgH) = getimagesize($path);
        $final_width = $imgW;
        $final_height = $imgH;
        //是否scale
        if($imgW>$maxSize || $imgH>$maxSize){
            if($imgW>=$imgH){
                $final_width = $maxSize;
                $final_height = round($final_width * $imgH / $imgW);
            }else{
                $final_height = $maxSize;
                $final_width = round($final_height * $imgW / $imgH);
            }
        }
        //scale img
        $new_image = imagecreatetruecolor($final_width, $final_height);
        $color = imagecolorallocate($new_image, 255, 255, 255);
        imagefill($new_image, 0,0, $color);
        //crop img
        //裁剪开区域左上角的点的坐标
        $x = 0;
        $y = 0;
        imagecopyresampled($new_image, $src, 0, 0, $x, $y, $final_width, $final_height, $imgW, $imgH);
        //输出图片
        $time =time();
        $outImg = "upload/avatar-".$time.".jpg";
        imagejpeg ($new_image, $outImg, 100);
        //result
        $result = array(
            'status'=>'success',
            'url'=> $outImg,
            'width'=> $final_width,
            'height'=> $final_height
        );
    }
    //result
    echo json_encode($result);
}

function uploadLogo(){
    //getUplaodImg
    $errMsg = $_FILES["upload_logo"]["error"];
    //
    if ($errMsg > 0){
        $result = array('status'=>'error','msg'=> $errMsg);
    }else{
        //success
        $path = $_FILES["upload_logo"]["tmp_name"];
        //输出图片
        $time =time();
        $ext = pathinfo($_FILES["upload_logo"]["name"],PATHINFO_EXTENSION);
        $outImg = "upload/logo-".$time.".".$ext;
        move_uploaded_file($path, $outImg);
        //result
        $result = array('status'=>'success','url'=> $outImg);
    }
    //result
    echo json_encode($result);
}

function cropImage(){
    $cropData = isset($_POST['data']) ? $_POST['data'] : null;
    //max
    $maxSize = 300;
    //success
    $path = $_POST['img'];
    $src = imagecreatefromstring(file_get_contents($path));
    list($imgW, $imgH) = getimagesize($path);
    $final_width = $cropData['w'];
    $final_height = $cropData['h'];
    //裁剪区域的宽和高
    $width = 75;
    $height = 75;
    //scale img
    $new_image = imagecreatetruecolor($width, $height);
    $color = imagecolorallocate($new_image, 255, 255, 255);
    imagefill($new_image, 0,0, $color);
    //crop img
    //裁剪开区域左上角的点的坐标
    $x = $cropData['x'];
    $y = $cropData['y'];
    imagecopyresampled($new_image, $src, 0, 0, $x, $y, $width, $height, $final_width, $final_height);
    //输出图片
    $time =time();
    $outImg = $path;
    imagejpeg ($new_image, $outImg, 90);
    //result
    $result = array(
        'status'=>'success',
        'url'=> $outImg
    );
    //result
    echo json_encode($result);
}

?>