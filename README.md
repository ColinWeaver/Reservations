# [Reservations](https://reservations-front-end.herokuapp.com/dashboard)
 
 ---------------------------------------------------------------------------------------------------------------
## Summary:
This app allows you to manage restaurant reservations by creating tables and reservations and modifying the associations between them and the statuses of the reservations and tables. After creating a reservation you can edit it, seat it at a table, and cancel it. After creating a table you can finish a seating if a reservation is seated at it. Each table has a status of either: 'Free' or 'Occupied'. Each reservation has a status of either: 'booked', 'seated', or 'finished.' There is also a search page where you can search through the reservations by phone number. All reservations display a 'Cancel' button and depending on their status, reservations display 'Seat' and 'Edit' buttons. Depending on their status, a table displays a 'Finish' button.


## FURTHER DETAILS:
### This application is used to create restaurant reservations and assign/track tables for them. The apps functionality includes the ability to:
1. create reservations
1. edit reservations
1. create tables
1. seat reservations at a table
1. finish a reservation's seating at a table
1. cancel a reservation

### The following are the pages displayed while using the app: 
- Every page displays the menu at the top which allows you to navigate to the primary pages: Dashboard, Search, Create Reservation, Create Table. Through links in some of the previous pages you can access the following pages: Edit Reservation, Edit Table, Seat Reservation.
- Complete list of pages in the app: Dashboard, Search, Create Reservation, Create Table, Edit Reservation, Seat Reservation.
- Links in the app include: Finish Reservation, Cancel Reservation,  


#### Dashboard: 

file:///Users/colinweaver/Desktop/Reservations-screenshots/Dashboard%20Page.png


- This is the first page opened while using the app. It displays a list of reservations for the current day (if any) and a list of any tables. Above the lists it displays 3 nagivation buttons to navigate through different dates and view any reservations assigned to those days.
##### For each reservation listed, there is a:
 - Cancel Button: Clicking this button changes the status of the reservation to "canceled". 

 - Seat Button: This button is only displayed if the reservation status is "booked". A reservation can have a status of 'booked', 'seated', 'finished', and 'canceled'. 

 - Edit Button: This button takes you to the 'edit reservation' page and allows you to modify the reservation.
##### For each table listed, there is a:
 - Finish Button: This button is only displayed if the table status is 'Occupied' which means it has a reservation associated with it. 

#### Search: 
- This page displays a search bar (to input a number) and 'Find' button to submit the search. When you click the find button it displays a list of reservations with phone numbers containing the input numbers. The same buttons can be found in the listed reservations displayed on this page as the ones displayed in the dashboard page.

#### Create Reservation:
- This page displays a form that allows you to input and save the required data for the reservation. No form can be left blank and there is various validation from the API that displays an error if any field is not filled in correctly. Below the form is a "Submit" button that allows you to save the reservation and a 'Cancel' button that takes you back to previous page. 

#### Create Table:
- This page displays a form that allows you to input and save the required data for the table. No form can be left blank and there is various validation from the API that displays an error if any field is not filled in correctly. Below the form is a "Submit" button that allows you to save the table and a 'Cancel' button that takes you back to previous page. 

#### Edit Reservation:
- You access this page by clicking the 'Edit' button displayed on a reservation with a status of 'booked.' This page displays a form that contains data from previous reservation and that allows you to modify the required data for the reservation. No form can be left blank and there is various validation from the API that displays an error if any field is not filled in correctly. Below the form is a "Submit" button that allows you to save the reservation and a 'Cancel' button that takes you back to previous page. 

#### Seat Reservation:
- This page displays a drop down menu of the tables and allows you to select one of them to assign the reservation to. You access this page via the "Seat" button listed on reservations with a status of 'booked.' When a table is selected you press the "Submit" button to change the status of the table to 'Occupied' and the reservation status to 'Seated'. If you press the 'Cancel' button it takes you to the previous page. 


 ---------------------------------------------------------------------------------------------------------------
## API: 
The API consists of a various routes to '/reservations' and '/tables'.

### /reservations routes:
1. /reservations?date={0000-00-00}
-LIST: This route responds with a list of reservations that have reservation_date matching the query date sorted by time.

1. /reservations
-CREATE: This route receives a new reservation object in the request body and responds with the new reservation object once it has been successfully created.

1. /reservations/:reservation_id
-READ: This route responds with a reservation whose reservation_id matches the reservation_id passed in route param.
-UPDATE: This route recieves an updated reservation object in the request body and responds with the updated reservation object when the reservation has been successfully updated. 

1. /reservations/:reservation_id/status: 
-UPDATE: This route recieves a status in the request body and responds with the updated status when the reservation's status has been successfully updated. 

### /tables routes:
1. /tables
- LIST: This route responds with a list of all tables sorted in ascending order by table_name.
- CREATE: This route recieves a table object in the request body and responds with the table object when the table has been successfully created. 

1. /tables/:table_id/seat:
- UPDATE: This route recieves an updated table status in the request body and updates the status of the table whose table_id matches the table_id in the param as well as the status of the reservation now associated to the table. It then responds with the same status as the request body when the status of the table has been successfully updated. 
- DELETE: This route updates the reservation_id column of the table whose table_id matches the table_id in the param so it no longer has an associated reservation and also sets the status of the reservation that was associated with that table to 'finished.' It responds with 'finished'.


 ---------------------------------------------------------------------------------------------------------------
## Technologies Used:

1. Frontend:
- I used React to develop the app in JavaScript and used various React libraries and features. For styling I used CSS flexbox heavily (the project's styling code also contains some boostrap classes already present in the starter code).

1. Backend:
- I used Express to develop the API. I developed the routes using JavaScript and used the Knex library to query the PostgreSQL database. I also used the Knex library to develop the seed and migration files. 

 ---------------------------------------------------------------------------------------------------------------
## Installation: 
1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Create at least one database with ElephantSQL or another hosting site to add to a .env file in backend.
1. In back-end repository .env file `./back-end/.env` include the addresses of the database(s) you created assign them to environment variables that match the following: `DATABASE_URL_DEVELOPMENT`, `DATABASE_URL_TEST`, or `DATABASE_URL` for production database. It should follow this format: `DATABASE_URL="database-url-here"`.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`. This .env file should contain the following: `REACT_APP_API_BASE_URL=http://localhost:5000`
1. Run `npm install` to install project dependencies.
1. In front-end repository, back-end repository, and root repository there are package.json files (3 in total). Follow the commands to run the app via the scripts included in the package.json files.





















