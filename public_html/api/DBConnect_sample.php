<?

class DBConnect {
	
	const DB_SERVER = "ENTER DB HOST HERE";
	const DB_USER = "ENTER DB USERNAME HERE";
	const DB_PASSWORD = "ENTER DB PASSWORD HERE";
	const DB = "ENTER DB NAME HERE";
	private $db = NULL;
	
	public function __construct(){
		$this->dbConnect();// Initiate Database connection
		
	}
	
	//Database connection
	private function dbConnect(){
		$this->db = mysql_connect(self::DB_SERVER,self::DB_USER,self::DB_PASSWORD);
		if($this->db)
		mysql_select_db(self::DB,$this->db);
	}
	
	public function getDB(){
		return $this->db;
	}
	
	
	
	
}
	
	
	