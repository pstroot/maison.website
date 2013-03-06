

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Image Compare</title>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script> 
	<script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js "></script>
     <script>
	$(function() {
		$( "#tabs" ).tabs();
	});
	</script>
	<link href="http://code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"> 
    <style>
		#tabs{font-size:11px;}
		h1{font-size:16px;}
	</style>
</head>

<body>



<div id="tabs">
    <ul>
        <li><a href="#tabs-1">Original</a></li>
        <li><a href="#tabs-2">Original through imageOptim</a></li>
        <li><a href="#tabs-3">Save As (quality = 7)</a></li>
        <li><a href="#tabs-4">Save As through imageOptim</a></li>
        <li><a href="#tabs-5">Save For Web (60%)</a></li>
        <li><a href="#tabs-6">Save For Web (40%)</a></li>
        <li><a href="#tabs-7">Save For Web (60% - sRGB)</a></li>
        <li><a href="#tabs-8">Batch Process</a></li>
    </ul>
    
    <div id="tabs-1">    
        <?php show("size_compare/time_original.jpg"); ?>
    </div>
    
    <div id="tabs-2">    
        <?php show("size_compare/time_imageOptim.jpg"); ?>
    </div>
    
    <div id="tabs-3">
        <?php show("size_compare/time_save_as_7.jpg"); ?>
    </div>
    
    <div id="tabs-4">
        <?php show("size_compare/time_save_as_7_imageOptim.jpg"); ?>
    </div>
    
    <div id="tabs-5">
        <?php show("size_compare/time_save_for_web_60.jpg"); ?>
    </div>
    
    <div id="tabs-6">
        <?php show("size_compare/time_save_for_web_40.jpg"); ?>
    </div>
    
    <div id="tabs-7">
        <?php show("size_compare/time_save_for_web_srgb.jpg"); ?>
    </div>
    
    <div id="tabs-8">
        <?php show("size_compare/time_image_process.jpg"); ?>
    </div>
</div>

<?
function show($url){
	$filesize = filesize($url);
	$k = bytesToSize ($filesize);
	print "File Size: " .  $k . "<BR>";
	print "<img src='".$url."' />";
}

function bytesToSize($bytes, $precision = 2)
{  
    $kilobyte = 1024;
    $megabyte = $kilobyte * 1024;
    $gigabyte = $megabyte * 1024;
    $terabyte = $gigabyte * 1024;
   
    if (($bytes >= 0) && ($bytes < $kilobyte)) {
        return $bytes . ' B';
 
    } elseif (($bytes >= $kilobyte) && ($bytes < $megabyte)) {
        return round($bytes / $kilobyte, $precision) . ' KB';
 
    } elseif (($bytes >= $megabyte) && ($bytes < $gigabyte)) {
        return round($bytes / $megabyte, $precision) . ' MB';
 
    } elseif (($bytes >= $gigabyte) && ($bytes < $terabyte)) {
        return round($bytes / $gigabyte, $precision) . ' GB';
 
    } elseif ($bytes >= $terabyte) {
        return round($bytes / $terabyte, $precision) . ' TB';
    } else {
        return $bytes . ' B';
    }
}
?>








</body>
</html>

