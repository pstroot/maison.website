<?
	
require_once("Rest.inc.php");
require_once("DBConnect.php");

class Films extends REST{
	
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
		$sql = mysql_query("SELECT f.* 
							FROM films f 
							WHERE f.isActive = 1 ORDER BY f.theOrder", $this->DB);
		if(mysql_num_rows($sql) > 0){
			$films = array();
			while($row = mysql_fetch_array($sql,MYSQL_ASSOC)){
				$row["thumbnail"] = "images/films/" .$row["thumbnail"];
				$films[] = $row;
			}
			// If success everythig is good send header as "OK" and return list of users in JSON format
			//print"<pre>";print_r($result);
			
			$result = array(
				"headline"=>"Films 2008 - 2013",
				"films"=>$films
			);

			$this->response($this->json($result), 200);
		}
		
		$this->response('',204); // If no records "No Content" status
	}
	
	
	
	
	private function getSingleResult($id){		
	$sql = mysql_query("SELECT * FROM films a WHERE a.slug = '".$id."'", $this->DB);
		
		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($row = mysql_fetch_array($sql,MYSQL_ASSOC)){

				$result = $row;
				$sql2 = mysql_query("SELECT i.*
									FROM films f
									WHERE  f.artist_id = ".$row["id"]."
									ORDER BY f.theOrder", $this->DB);
				$totalImages = mysql_num_rows($sql2);
				if(mysql_num_rows($sql2) > 0){
					$counter = 0;
					$images = array();
					while($row2 = mysql_fetch_array($sql2,MYSQL_ASSOC)){
						$counter++;
						$img1 = "images/galleries/" . $row["slug"] . "/images/" . $row2["filename"] ;
						$img2 = "images/galleries/" . $row["slug"] . "/zoom/" . $row2["filename"] ;
						$img3 = "images/galleries/" . $row["slug"] . "/fullsize/" . $row2["filename"] ;
						
						$row2["thumbnail"] 	=  !is_file("../" . $img1) ? NULL : $img1 ;
						$row2["large"] 		=  !is_file("../" . $img2) ? NULL : $img2 ;
						$row2["fullsize"] 	=  !is_file("../" . $img3) ? NULL : $img3 ;
						$row2["artistSlug"] =  $row["slug"] ;
						$row2["alt"] =  $row2["title"] . " ($counter of $totalImages)[img src: Erik Madigan Heck - maisondesprit.com]" ;
						
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

	}
	
	
	private function updateRow($id){	
		print "UPDATE \n";	
	}
	
	
	
	
}
	
	
	