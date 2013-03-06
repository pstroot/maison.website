<?
/**
* Change the path to your folder.
* This must be the full path from the root of your
* web space. If you're not sure what it is, ask your host.
*
* Name this file index.php and place in the directory.
*/
    // Define the full path to your folder from root
    $path = "../images/galleries/";

    // Open the folder
    $dir_handle = @opendir($path) or die("Unable to open $path");


    // Loop through the files
    while ($artist = readdir($dir_handle)) {

    	if($artist == "." || $artist == ".." || $artist == "index.php" )continue;
       
		if(is_dir($path . $artist)){
			 echo "<a href=\"$artist\">$artist</a><br />";
			$dir_handle2 = @opendir($path . $artist) or die("Unable to open $path");
			$directories = array();
			while ($file = readdir($dir_handle2)) {
				if($file == "." || $file == ".." || $file == "index.php" )continue;
				if(is_dir($path . $artist . "/" . $file)){
					if(is_file($path . $artist . "/" . $file . "/Thumbs.db")){
						unlink($path . $artist . "/" . $file . "/Thumbs.db");
					}
					array_push($directories,$file);
				}
			}
			
			if(in_array("zoom",$directories) && !in_array("fullsize",$directories)){
				print "CREATE FULLSIZE!<BR>";
				$newDirectory = "/fullsize";
				if(!is_dir($path . $artist . $newDirectory)){
					mkdir ($path . $artist . $newDirectory);
					recurse_copy($path . $artist . "/zoom",$path . $artist . $newDirectory);
				}
				
			}
			
			if(in_array("images",$directories)){
				rename($path . $artist . "/images", $path . $artist . "/thumbs");
			}
			if(in_array("zoom",$directories)){
				rename($path . $artist . "/zoom", $path . $artist . "/display");
			}
			
			
		}

    }
    // Close
    closedir($dir_handle);
	
	
	
function recurse_copy($src,$dst) { 
    $dir = opendir($src); 
    @mkdir($dst); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( is_dir($src . '/' . $file) ) { 
                recurse_copy($src . '/' . $file,$dst . '/' . $file); 
            } 
            else { 
                copy($src . '/' . $file,$dst . '/' . $file); 
            } 
        } 
    } 
    closedir($dir); 
} 
?>