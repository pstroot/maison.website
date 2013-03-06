<?php


require_once("../api/DBConnect.php");

class GO{
	
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
				list($width, $height, $type, $attr) = getimagesize("../" . $row["URL"]);
				
				if($row["Artist"] != @$lastArtist){
					print "<h1>".$row["Artist"]."</h1>";	
				}
				print "<div class='thumbContainer'>";
					print "<img height='200'  src='../" . $row["URL"] . "'>";
					print "<div><b>Size: </b> " . $width . " x " . $height . "</div>";
				print "</div>";	
				
				$query2 = "UPDATE images SET width = ".$width.", height = ".$height." WHERE image_id = " . $row["image_id"];
				$sql2 = mysql_query($query2);
				
				$lastArtist = $row["Artist"];
				
			}

		}
		
	}
	
	
	
	
	
}
	
	
$go = new GO();
