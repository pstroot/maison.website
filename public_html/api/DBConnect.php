<?
class DBConnect {
	
	const DB_SERVER = "localhost";
	const DB_USER = "root";
	const DB_PASSWORD = "";
	const DB = "maisondesprit";
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
	
	
	