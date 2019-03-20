DEVELOPMENT = true;

PORT = 8084;

MYSQL_HOST = DEVELOPMENT ?'localhost'/*process.env.MYSQL_HOST*/ : 'db4free.net'//'85.10.205.173:3306' //'localhost';
MYSQL_USER = DEVELOPMENT ?'root'/*process.env.MYSQL_USER*/ : 'agri_thesis' //'root';
MYSQL_PASSWORD = DEVELOPMENT ?'secretPassword123'/*process.env.MYSQL_PASSWORD*/ : 'secretPassword123'// '12345';
MYSQL_DATABASE = 'agri_thesis';// 'criminal_watch_db';


JWT_TOKEN      = 'secret_key';
SECRET_KEY     = 'secret';


CLOUD_NAME	   = 'agrithesis';
API_SECRET 	   = 'z8A5SJ_zExYrOtMUZxnvU7FBlwM';
API_KEY		   = '584391562241729';
ENV_VARIABLE   = 'cloudinary://584391562241729:z8A5SJ_zExYrOtMUZxnvU7FBlwM@agrithesis/';