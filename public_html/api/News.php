<?

require_once("Rest.inc.php");
require_once("DBConnect.php");

class News extends REST{
	
	private $DB = NULL;
	
	public function __construct($params){

		
		$d = new DBConnect();
		$this->DB = $d->getDB();
		
		$method =  $_SERVER['REQUEST_METHOD'];
		switch ($method) {
		  case 'PUT':
			//$this->updateRow($params[0]);	
			break;
		  case 'POST':
			//rest_post($request);  
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
		$sql = mysql_query("SELECT *  FROM news WHERE isActive = 1 ORDER BY theOrder", $this->DB);
		if(mysql_num_rows($sql) > 0){
			$news = array();
			while($row = mysql_fetch_array($sql,MYSQL_ASSOC)){				
				$news[] = $row;
			}			
		}
		
		
		$result = array(
			"headline"=>"Recent Projects, 2013*",
			"news"=>$news
		);

		$this->response($this->json($result), 200);

	}
	
	
	private function getSingleResult($id){		
		print "GET SINGLE RESULT \n";
	}
	
	private function updateRow($id){	
		print "UPDATE \n";	
		
	}
	
	
	
	
}
	
	
	
	