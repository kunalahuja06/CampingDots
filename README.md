# CampingDots
## [Live link - CampingDots](https://campingdots.herokuapp.com/)

CampingDots is a website to create and review campgrounds. This project is inspired by Colt Steele's Web Development Bootcamp. 

This project is built using NodeJS, ExpressJS, MongoDB.

![2021-12-21 (1)](https://user-images.githubusercontent.com/52367650/146890012-bdf67344-765a-4fe2-ad61-4636d2c769fc.png)

![2021-12-21](https://user-images.githubusercontent.com/52367650/146890007-b8a0fdec-198d-4dd6-9e72-4b51b1c32258.png)
#
## Features
- Create, update and delete Campgrounds.
- Add, delete reviews to Campgrounds.
- Register and Login using PassportJS.
- View Campgrounds created by each user.
#
## Run it locally
1. Install MongoDB, NodeJS.
2. Create account on Cloudinary and MapBox to get an API key and secret.
3. Clone this repo.
```
cd campingdots
npm install
```
4. Create a .env file in the root of the project and add the following:
```
DB_URL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
```
5. Run mongod.
6. In terminal, run
```nodemon app.js``` 
7. Then go to localhost:3000.


