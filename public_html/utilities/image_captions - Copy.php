<style>
.thumbContainer{width:400px;font-family:verdana,arial;helvetica;font-size:10px;display:inline-block;width:auto;margin-right:6px;}
.thumbContainer img{}
.thumbContainer img{}
.thumbContainer img{}
</style>
<?php


require_once("api/Rest.inc.php");
require_once("api/DBConnect.php");

class GO extends REST{
	
	private $DB = NULL;
	
	public function __construct(){

		
		$d = new DBConnect();
		$this->DB = $d->getDB();
		
			
		$query = "SELECT a.id as Artist_id, i.image_id, a.title as Artist, i.title, i.filename, i.caption, CONCAT('images/galleries/',a.slug,'/images/',i.filename) as URL
		FROM `images` i
		LEFT JOIN artists a ON a.id = i.artist_id
		ORDER BY a.theOrder, i.theOrder";
		
		$sql = mysql_query($query);
		
		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($row = mysql_fetch_array($sql,MYSQL_ASSOC)){
				list($width, $height, $type, $attr) = getimagesize($row["URL"]);
				$theHeight = 200;
				$ratio = $theHeight/$height;
				$theWidth = $width * $ratio;
				
				if($row["Artist"] != @$lastArtist){
					print "<h1>".$row["Artist"]."</h1>";	
				}
				print "<div class='thumbContainer'>";
				print "<img style='width:".$theWidth."px;height:".$theHeight."px;'  src='" . $row["URL"] . "'>";
				print "<div style='width:".$theWidth."px;'><b>Image ID:</b> " . $row["image_id"] . "</div>";
				print "<div style='width:".$theWidth."px;'><b>Caption:</b> " . $row["caption"] . "</div>";
				print "</div>";				
				$lastArtist = $row["Artist"];
			}

		}
		
	}
	
	
	
	
	
}
	
	
$go = new GO();