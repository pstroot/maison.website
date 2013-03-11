maison_website
==============

Source code for the website

IN ORDER TO MAKE THIS WEBSITE WORK IN A NEW ENVIRONMENT, THE FOLLOWING MUST BE DONE:
 - You'll need to update api/DBConnect.php with your databsae credentials. 
 - Need to create a database using the .sql file included in the "database" folder
 - If not on the root level, you may need to update the "base" tag at the top of index.html, and change "RewriteBase" in the .htaccess files in /public_html and in /public_html/api