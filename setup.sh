# This script setups the enviroment variables to run the project

if [ -e "./.setup" ]; then
  echo "DETECTED ".setup" FILE!"
  echo "Project already setuped"
  exit
fi

echo "Installing packages"
npm add
clear

echo "Enter database host:" 
read host
clear

echo "Enter databse port:"
read port
clear

echo "Enter the database name:"
read name
clear

echo "Enter your user name:"
read user_name
clear

echo "Enter your password:"
read -s user_password
clear

if [ ! -e "./db.env" ]; then
  echo "Creating .env file"
  touch "db.env"
fi

if [ ! -e "./.gitignore" ]; then
  echo "Creating .gitignore file"
  touch ".gitignore"
fi

echo "DATABASE_NAME=$name" >> "./db.env"
echo "DATABASE_USER_NAME=$user_name" >> "./db.env"
echo "DATABASE_USER_PASSWORD=$user_password" >> "./db.env"
echo "DATABASE_HOST=$host" >> "./db.env"
echo "DATABASE_PORT=$port" >> "./db.env"

echo "*.env" >> ".gitignore"
echo ".setup" >> ".gitignore"

touch "./.setup"

echo "Setup finished!"