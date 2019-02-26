DEVELOPMENT = true;

PORT = 8084;

MYSQL_HOST = DEVELOPMENT ?process.env.MYSQL_HOST : '85.10.205.173:3306' //'localhost';
MYSQL_USER = DEVELOPMENT ?process.env.MYSQL_USER : 'agri_thesis' //'root';
MYSQL_PASSWORD = DEVELOPMENT ?process.env.MYSQL_PASSWORD : 'secretPassword123'// '12345';
MYSQL_DATABASE = DEVELOPMENT ?process.env.MYSQL_DATABASE : 'agri_thesis'// 'criminal_watch_db';


JWT_TOKEN      = 'secret_key';
SECRET_KEY     = 'secret';



