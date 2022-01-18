# Shopify Backend Challenge - Summer 2022

This is the submission for the Shopify Backend Challenge of Summer 2022 internship. The challenge description is available [here](https://docs.google.com/document/d/1z9LZ_kZBUbg-O2MhZVVSqTmvDko5IJWHtuFmIu_Xg1A/edit).

Technologies Used:
- Node.js & ExpressJS (Used as the backend infrastructure)
- Firebase Cloud FireStore (Used as the database)
- Git (Used for version control)
- AngularJS (Used for a simple interactive demo of the API)

To run this application, make sure you have previously installed:
- node.js
- npm
- git

# Features

- Create new item into the inventory
- Edit an item in the inventory
- Delete an item in the inventory
- View all the items in the company's inventory
    - Each item will have id, name, price, and quantity.
- **One additional feature chosen as per requirement of the challenge:**
    - Push a button export product data to a CSV 
    
## How to use


- Download the repository.
- Run the following commands in terminal:
```
npm install
npm run start
```
- After that, the API will be available at the endpoint http://localhost:5001/. **The `Operations` section of this readme document explains the operations you can perform using the API. The most important files for the backend are routes/router.js, utils/helper.js and utils/db.js.**
- If you want a interactive front-end demo that consumes the API, please **open another terminal** and run the following commands from the root of this repository:
```
cd client
npm install
npm run start
```
- This will create a simple interactive demo at http://localhost:4200/. Using the demo, you can click buttons to view all the items, create/update/remove items, or export to CSV. This demo essentially calls the backend API at http://localhost:5001/ when you click the buttons.
- If you want to access the API using the terminal instead, please read through the next section (Operations).

# Operations
You can perform operations on the API via terminal using curl. By default, curl is installed in all recent operating systems. If you are running an older version of Windows (before Windows 10 1803), you might need to install Git Bash and run the curl command via Git Bash.
## [POST] `/create`: Add a new item to the inventory
#### Schema
```
{
  "id": string (alphanumeric),
  "item": string,
  "price": float (decimals <= 2),
  "quantity": integer
}
```
#### Curl Template: 
```
curl -s -X POST http://localhost:5001/api/create -H 'Content-Type: application/json' -d '{"id":"PRODUCT ID HERE","item":"PRODUCT NAME HERE", "price": PRODUCT PRICE HERE, "quantity": PRODUCT QUANTITY HERE}'
```
#### Sample Usage:
```
curl -s -X POST http://localhost:5001/api/create -H 'Content-Type: application/json' -d '{"id":"2022101261951A","item":"Excalibur", "price": 23.40, "quantity": 66}'
```

#### Correct Response:
Item is successfully created (200 OK):
```
Success! Excalibur with id 2022101261951A has been added.
```
#### Error Response:
Item exists already (400 Bad Request):
```
The id '2022101261951A' already exists in the database.
```

The user submitted an invalid id (400 Bad Request):
```
Item id cannot be empty.
Item id should be alphanumeric.
```

The user submitted an invalid name/price/quantity (400 Bad Request):
```
Item name cannot be empty.
Invalid price (need decimal number (<=2 decimals) or integer.)
Quantity is not valid (needs to be an integer.)
```
Note that the example above shows the case where name, price, and quantity are all invalid. It will show them partially if only some values are invalid.
If there is an error caused due to the backend, HTTP 500 (Internal Server Error) will be returned.

----------------------------
## [GET] `/read`: Read ALL items in the inventory
#### Sample Usage:
  ```
curl -s -X GET http://localhost:5001/api/read
  ```
#### Correct Response:
Items are successfully read (200 OK):
```
[{
    "id": "2022101261951A",
    "item": "Excalibur",
    "price": 23.40,
    "quantity": 66
}, {
    "id": "2022101261951A2",
    "item": "Excalibur V2",
    "price": 23.40,
    "quantity": 66
}]
```
Note that if inventory is empty, an empty array will be returned.
If there is an error caused due to the backend, HTTP 500 (Internal Server Error) will be returned.

----------------------------
## [GET] `/read/:item_id`: Read a specific product by id
#### Curl Template
  ```
curl -s -X GET http://localhost:5001/api/read/{PRODUCT ID HERE}
  ```
#### Sample Usage:
  ```
curl -s -X GET http://localhost:5001/api/read/2022101261951A
  ```
#### Correct Response:
If item is successfully read (200 OK):
```
{
    "item": "Excalibur",
    "quantity": 66,
    "price": 23.40
}
```
#### Error Response:
Invalid id (400 Bad Request):
```
Item id should be alphanumeric.
```
Item not found (404 Not Found):
```
Product with id '2022101261951A' does not exist.
```
If there is an error caused due to the backend, HTTP 500 (Internal Server Error) will be returned.

----------------------------
## [PUT] `/update/:item_id`: Update the metadata of an item by id.
#### Schema
```
{
  "item": string,
  "price": float (decimals <= 2),
  "quantity": integer
}
```
#### Curl Template:
  ```
curl -s -X PUT http://localhost:5001/api/update/{PRODUCT ID HERE} -H 'Content-Type: application/json' -d '{"item": "PRODUCT NAME HERE", "price": PRODUCT PRICE HERE, "quantity": PRODUCT QUANTITY HERE}'
  ```
#### Sample Usage:
  ```
curl -s -X PUT http://localhost:5001/api/update/2022101261951A -H 'Content-Type: application/json' -d '{"item":"ExcaliburV2", "price": 99.99, "quantity": 99}'
  ```
#### Correct Response:
Expected response if item is successfully updated (200 OK):
```
Product with id 2022101261951A has been updated. New product metadata: {"item":"ExcaliburV2","price":"99.99","quantity":"99"}
```
#### Error Response:
Invalid id (400 Bad Request):
```
Item id should be alphanumeric.
```
Item not found (404 Not Found):
```
The id '2022101261951A' does not exist in the database.
```
If there is an error caused due to the backend, HTTP 500 (Internal Server Error) will be returned.

----------------------------
## [DELETE] `/delete/:item_id`: Delete an item by id.
#### Curl Template:
  ```
curl -s -X DELETE http://localhost:5001/api/delete/{PRODUCT ID HERE}
  ```
#### Sample Usage:
  ```
curl -s -X PUT http://localhost:5001/api/delete/2022101261951A
  ```
#### Correct Response:
Expected response if item is successfully updated (200 OK):
```
Product with id 2022101261951A has been deleted.
```
#### Error Response:
Invalid id (400 Bad Request):
```
Item id should be alphanumeric.
```
Item not found (404 Not Found):
```
The id '2022101261951A' does not exist in the database.
```
If there is an error caused due to the backend, HTTP 500 (Internal Server Error) will be returned.

----------------------------
## [GET] `/api/export`: Export the current inventory to CSV.
#### Sample Usage:
  ```
curl -s -X GET http://localhost:5001/api/export
  ```
#### Correct Response:
If item is successfully exported (200 OK):
  ```
  "id","item","price","quantity"
"2022101261951A","ExcaliburV2",99.99,99
"1235124","Toy",33.33,333
"1235125","Oculus controller",43,43
"4323431","HTC controller",23.40,33
"434253555","PS5 controller",66.59,44
  ```
Note that if the inventory is empty, a csv will still be returned but it will only have the titles (id, item, price, quantity.)
If there is an error caused due to the backend, HTTP 500 (Internal Server Error) will be returned.

----------------------------
## [GET] `/api/export/:item_ids`: Export selected list of items (id separated using comma) to CSV.
#### Curl Template:
  ```
curl -s -X GET http://localhost:5001/api/export/PRODUCT_ID_1,PRODUCT_ID_2,...
  ```
#### Sample Usage:
  ```
curl -s -X GET http://localhost:5001/api/export/434,4321
  ```
#### Correct Response:
If item is successfully exported (200 OK):
  ```
  "id","item","price","quantity"
"434","ExcaliburV2",99.99,99
"4321","Toy",33.33,333
  ```
#### Error Response:
Invalid id(s) (400 Bad Request):
```
Error at the 0th id: 
Item id should be alphanumeric.
Error at the 1th id: 
Item id should be alphanumeric.
```
Some items not found (404 Not Found):
```
The following ids are not found in the database: 
111111
222222
```
You can also open a browser and enter `http://localhost:5001/api/export/434,4321`, which will directly download a csv file accordingly.
If there is an error caused due to the backend, HTTP 500 (Internal Server Error) will be returned.

# Future Works 
A number of features and development practices can be introduced in the future:
- Use docker to separate the environment of this software from infrastructure, which can improve the efficiency in deliverying this software.
- Use swagger to provide a better and more beautifully formatted API documentation.
- Allow adding/deleting/reading/updating multiple items at once.
- Add unit tests and CI/CD pipeline for this project.
