<?

require_once("Rest.inc.php");
require_once("DBConnect.php");

class Artists  extends REST{
	
	private $DB = NULL;
	
	public function __construct($params){

		
		$d = new DBConnect();
		$this->DB = $d->getDB();
		
		$method =  $_SERVER['REQUEST_METHOD'];
		switch ($method) {
		  case 'PUT':
			$this->updateRow($params[0]);	
			break;
		  case 'POST':
			rest_post($request);  
			break;
		  case 'GET':

			if(count($params) > 0){
				$this->getSingleResult($params[0]);				
			} else {				
				$this->getAllResults();
			}
			break;
		  case 'DELETE':
			//rest_delete($request);  
			break;
			
		  case 'HEAD':
			//rest_head($request);  
			break;
		  case 'OPTIONS':
			//rest_options($request);    
			break;
		  default:
			//rest_error($request);  
			break;
		}
	}
	
	
	
	private function getAllResults(){		
		$sql = mysql_query("SELECT a.id, a.title, a.slug, a.coverImage, c.cat_name , COUNT(i.image_id) AS nbrOfImages
							FROM artists a 
							LEFT JOIN categories c ON c.category_id = a.cat_id
							LEFT JOIN images i ON i.artist_id = a.id
							WHERE a.cat_id = 3 AND a.isActive = 1 AND c.isActive = 1 
							GROUP BY a.id
							ORDER BY a.theOrder", $this->DB);		
		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($row = mysql_fetch_array($sql,MYSQL_ASSOC)){
				if($row["nbrOfImages"] == 0) continue;
				$row["thumbnail"] = "images/galleries/".$row["slug"] . "/" .$row["coverImage"];
				$result[] = $row;
			}
			// If success everythig is good send header as "OK" and return list of users in JSON format
			//print"<pre>";print_r($result);
			$this->response($this->json($result), 200);
		}
		$this->response('',204); // If no records "No Content" status
	}
	
	
	private function getSingleResult($id){		
		$sql = mysql_query("SELECT a.id, a.title, a.slug, a.coverImage FROM artists a WHERE a.slug = '".$id."'", $this->DB);
		
		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($row = mysql_fetch_array($sql,MYSQL_ASSOC)){

				$result = $row;
				$sql2 = mysql_query("SELECT i.*
									FROM images i
									WHERE  i.artist_id = ".$row["id"]."
									AND i.isActive = 1
									ORDER BY i.theOrder", $this->DB);
				$totalImages = mysql_num_rows($sql2);
				
				if($totalImages > 0){
					$counter = 0;
					$images = array();
					while($row2 = mysql_fetch_array($sql2,MYSQL_ASSOC)){
						$counter++;
						$img1 = "images/galleries/" . $row["slug"] . "/thumbs/" . $row2["filename"] ;
						$img2 = "images/galleries/" . $row["slug"] . "/display/" . $row2["filename"] ;
						$img3 = "images/galleries/" . $row["slug"] . "/fullsize/" . $row2["filename"] ;
						
						$row2["thumbnail"] 	=  !is_file("../" . $img1) ? NULL : $img1 ;						
						
						if(is_file("../" . $img2))		$row2["large"] = $img2;
						else 							$row2["large"] = $img1;						
						
						if(is_file("../" . $img3))		$row2["fullsize"] = $img3;
						else if(is_file("../" . $img2)) $row2["fullsize"] = $img2;
						else 							$row2["fullsize"] = $img1;
												
						$row2["artistSlug"] =  $row["slug"] ;
						$row2["alt"] =  $row["title"] . " ($counter of $totalImages)[img src: Erik Madigan Heck - maisondesprit.com]" ;
						
						$images[] = $row2;
					}
					// If success everythig is good send header as "OK" and return list of users in JSON format
					$result["images"] = $images;
				}
				
				//print "<pre>";print_r($result);
				$this->response($this->json($result), 200);
			}
			
		}
		$this->response('',204); // If no records "No Content" status
		
		
		
		
		//$this->response('',204); // If no records "No Content" status
	}
	
	
	private function updateRow($id){	
		print "UPDATE \n";	
		/*
		$sql = mysql_query("SELECT title, slug, coverImage, theOrder FROM archives WHERE id = ".$id." AND isActive = 1", $this->DB);
		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($rlt = mysql_fetch_array($sql,MYSQL_ASSOC)){
				$result[] = $rlt;
			}
			// If success everythig is good send header as "OK" and return list of users in JSON format
			$this->response($this->json($result), 200);
		}
		$this->response('',204); // If no records "No Content" status
		*/
	}
	
	
	
	
}
	
	
	