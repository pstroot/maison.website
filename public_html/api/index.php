<?

require_once("Rest.inc.php");

class API extends REST{
	public $data = "";


	public function __construct(){
		parent::__construct();// Init parent contructor
		
	}
	

	
	//Public method for access api.
	//This method dynmically call the method based on the query string
	public function processApi(){
		$params = explode("/", $_REQUEST['params']);
		
		if(count($params) > 0){
			$func = array_shift ( $params );
			$func = strtolower(trim($func));
		} else {
			$func = "default??";
		}
	
		if((int)method_exists($this,$func) > 0){
			$this->$func($params);
		}else{
			$this->response('',404); // If the method not exist with in this class, response would be "Page not found".
		}
		
	}
	
	private function artists($params){	
		require_once("Artists.php");
		$artistResults = new Artists($params);		
	}
	
	private function films($params){		
		require_once("Films.php");
		$filmResults = new Films($params);		
	}
	
	private function press($params){		
		require_once("Press.php");
		$pressResults = new Press($params);		
	}
	
	private function news($params){		
		require_once("News.php");
		$pressResults = new News($params);		
	}
	
}
// Initiiate Library
$api = new API;
$api->processApi();
	
	
	
	
	
	
	
	
	
	
	/*
	$method =  $_SERVER['REQUEST_METHOD'];
	//if(isset($_SERVER['PATH_INFO'])) print "Path: " . $_SERVER['PATH_INFO'] . "<BR>\n";
	
	$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
	
	switch ($method) {
	  case 'PUT':
		rest_put($request);  
		break;
	  case 'POST':
		rest_post($request);  
		break;
	  case 'GET':
		rest_get($request);  
		break;
	  case 'HEAD':
		rest_head($request);  
		break;
	  case 'DELETE':
		rest_delete($request);  
		break;
	  case 'OPTIONS':
		rest_options($request);    
		break;
	  default:
		rest_error($request);  
		break;
	}
	
	
	function rest_put($request){
		//print "Do update \n" . print_r($request);	
		print $request;
	}
	
	function rest_post($request){
		$data = json_decode($_REQUEST["model"],true);
		$data['id'] = 3; 
		print json_encode($data);
	}
	
	function rest_get($request){
		$data = array();
		$data[] = array('name'=>"Portraits", 'thumbnail'=>"sample1.jpg", 'id'=>1);
		$data[] = array('name'=>"Mary Katrantzou SS13", 'thumbnail'=>"sample2.jpg", 'id'=>2);
		$data[] = array('name'=>"Etro 2013", 'thumbnail'=>"sample3.jpg", 'id'=>3);
		$data[] = array('name'=>"Ann Demeulemeester, The End", 'thumbnail'=>"sample4.jpg", 'id'=>4);
		$data[] = array('name'=>"The Art of Fashion, Neiman Marcus", 'thumbnail'=>"sample5.jpg", 'id'=>5);
		$data[] = array('name'=>"Lace Couture, Conde Nast Brides", 'thumbnail'=>"sample6.jpg", 'id'=>6);
		$data[] = array('name'=>"Rochas, Our Last Day in Naples", 'thumbnail'=>"sample7.jpg", 'id'=>7);
		print json_encode($data);
	}
	
	function rest_delete($request){
		print $request;
	}
	
	
	function rest_head($request){
		print "We do not support the \"HEAD\" method\n";	
	}
	
	function rest_options($request){
		print "We do not support the \"OPTIONS\" method\n";	
	}
	*/
