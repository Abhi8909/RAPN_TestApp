# RAPN_TestApp

# HTTPS SSL certificate key gen command

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
