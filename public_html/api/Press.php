<?

require_once("Rest.inc.php");
require_once("DBConnect.php");

class Press extends REST{
	
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
			
		}
	}



	private function getAllResults(){		
		$sql = mysql_query("SELECT *  FROM press WHERE isActive = 1 ORDER BY theOrder", $this->DB);
		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($row = mysql_fetch_array($sql,MYSQL_ASSOC)){
				//$row['title'] = str_replace(' ', '&nbsp;', $row['title']);				
				$result[] = $row;
			}			
		}
		//print"<pre>";print_r($result);
		
		$this->response($this->json($result), 200);
		
		//$this->response('',204); // If no records "No Content" status

		
	}
	
	
	private function getSingleResult($id){		
		$result = array(
            array("name"=>"The New York Times", "url"=>"http://tmagazine.blogs.nytimes.com/tag/nomenus-quarterly/"), 
		);
		
		$this->response($this->json($result), 200);
	}
	
	
	private function updateRow($id){	
		print "UPDATE \n";	
		
	}
	
	
	
	
}
	
	
	
	