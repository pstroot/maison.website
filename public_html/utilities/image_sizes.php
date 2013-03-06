<?

require_once("../api/DBConnect.php");

class GO{
	
	private $DB = NULL;	
	
	//private $targetDir = "display";
	//private $targetSize = "540";
	
	//private $targetDir = "thumb";
	//private $targetSize = "163";
	
	public function __construct($targetDir,$targetSize){

		
		$d = new DBConnect();
		$this->DB = $d->getDB();
			
		$query = "SELECT a.title, a.slug, a.id FROM artists a ORDER BY a.title";
		
		$sql = mysql_query($query);
		while($row1 = mysql_fetch_array($sql,MYSQL_ASSOC)){
			//echo $row1["title"] . "<BR>";
			$query2 = "SELECT i.*
						FROM `images` i
						WHERE artist_id = " . $row1["id"]. "
						ORDER BY i.theOrder";
			$sql2 = mysql_query($query2);
			
			$tooTall = array();
			
			while($row2 = mysql_fetch_array($sql2,MYSQL_ASSOC)){
				$url =  'images/galleries/' . $row1["slug"] . "/" . $targetDir . "/" . $row2["filename"];
				if(!is_file("../" . $url)){
					array_push($tooTall,"<span style='color:#CC0000;'>" . $url . " (File not found)</span>");
				} else {
				
					list($width, $height, $type, $attr) = getimagesize("../" . $url);
					if($height != $targetSize){
						array_push($tooTall,$url . " (".$height.")");					
					}
				}
			}
			
			if(count($tooTall) > 0){
				print "<h1>".$row1["title"]."</h1>";
				foreach($tooTall as $url){
					print $url . "<BR>";
				}
			}
			

		}
		
	}
	
	
	
	
	
}

		
	
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Image Sizes</title>
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
        <li><a href="#tabs-1">Full Size</a></li>
        <li><a href="#tabs-2">Display</a></li>
        <li><a href="#tabs-3">Thumbnails</a></li>
    </ul>
    
    <div id="tabs-1">    
        <?php $go = new GO("fullsize",1000); ?>
    </div>
    
    <div id="tabs-2">
    	<?php $go = new GO("display",540); ?>
    </div>
    
    <div id="tabs-3">
        <?php $go = new GO("thumbs",163); ?>
    </div>
</div>








</body>
</html>

