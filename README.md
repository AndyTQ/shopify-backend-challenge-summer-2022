# Shopify Backend Challenge - Summer 2022

This is the submission for the Shopify Backend Challenge of Summer 2022 internship. The challenge description is available [here](https://docs.google.com/document/d/1z9LZ_kZBUbg-O2MhZVVSqTmvDko5IJWHtuFmIu_Xg1A/edit).

Technologies Used:
- Node.js & ExpressJS (Backend Infrastructure)
- Firebase Cloud FireStore (Database)
- Git (Version Control)
- AngularJS (for a simple interactive demo of the API)

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
- After that, the API will be available at the endpoint http://localhost:5001/. **The `Operations` section of this readme document explains the operations you can perform using the API.**
- If you want a interactive front-end demo that consumes the API, please **open another terminal** and run the following commands from the root of this repository:
```
cd client
npm install
npm run start
```
- This will create a simple interactive demo at http://localhost:4200/. Using the demo, you can click buttons to view all the items, create/update/remove items, or export to CSV. This demo essentially calls the backend API at http://localhost:5001/ when you click the buttons.

# Operations

#### [POST] `/create`: Add a new item to the inventory
Format: 
```
curl -X POST http://localhost:5001/api/create -H 'Content-Type: application/json' -d '{"id":"PRODUCT ID HERE","item":"PRODUCT NAME HERE", "price": "PRODUCT PRICE HERE", "quantity": "PRODUCT QUANTITY HERE"}'
```
Sample usage:
  ```
curl -X POST http://localhost:5001/api/create -H 'Content-Type: application/json' -d '{"id":"2022101261951A","item":"Excalibur", "price": "23.40", "quantity": "66"}'
  ```
Expected response if item is successfully created (200 OK):
```
Success! Excalibur with id 2022101261951A has been added.
```
Expected response if item exists already (400 Bad Request):
```
The id '2022101261951A' already exists in the database.
```
----------------------------
#### [GET] `/read`: Read ALL items in the inventory
Sample usage:
  ```
curl -X GET http://localhost:5001/api/read
  ```
Expected response if items are successfully read (200 OK):
```
[{"id":"2022101261951A","item":"Excalibur","price":"23.40","quantity":"66"},{"id":"333213a","item":"fdsafds","price":"33.33","quantity":"333"},{"id":"4321","item":"43","price":"43","quantity":"43"},{"id":"432351","item":"Wine","price":"23.40","quantity":"33"},{"id":"434","item":"44","price":"44","quantity":"44"}]
```

----------------------------
#### [GET] `/read/:item_id`: Read a specific product by id
Format
  ```
curl -X GET http://localhost:5001/api/read/{PRUDCT ID HERE}
  ```
Sample usage:
  ```
curl -X GET http://localhost:5001/api/read/2022101261951A
  ```
Expected response if item is successfully read (200 OK):
```
{
    "quantity": "66",
    "price": "23.40",
    "item": "Excalibur"
}
```
Expected response if item does not exist (400 Bad Request):
```
Product with id '2022101261951A' does not exist.
```
----------------------------
#### [PUT] `/update/:item_id`: Update the metadata of an item by id.
Format:
  ```
curl -X PUT http://localhost:5001/api/update/{PRODUCT ID HERE} -H 'Content-Type: application/json' -d '{"item": "PRODUCT NAME HERE", "price": "PRODUCT PRICE HERE", "quantity": "PRODUCT QUANTITY HERE"}'
  ```
Sample usage:
  ```
curl -X PUT http://localhost:5001/api/update/2022101261951A -H 'Content-Type: application/json' -d '{"item":"ExcaliburV2", "price": "99.99", "quantity": "99"}'
  ```
Expected response if item is successfully updated (200 OK):
```
Product with id 2022101261951A has been updated. New product metadata: {"item":"ExcaliburV2","price":"99.99","quantity":"99"}
```
Expected response if the item is not found (400 Bad Request):
```
The id '2022101261951A' does not exist in the database.
```
----------------------------
#### [GET] `/api/export`: Export the current inventory as CSV.
Sample usage:
  ```
curl -X GET http://localhost:5001/api/export
  ```

Expected response if item is successfully exported (200 OK):
  ```
  "id","item","price","quantity"
"2022101261951A","ExcaliburV2","99.99","99"
"1235124","Toy","33.33","333"
"1235125","Oculus controller","43","43"
"4323431","HTC controller","23.40","33"
"434253555","PS5 controller","66.59","44"
  ```

----------------------------
#### [GET] `/api/export/:item_ids`: Export selected list of items (id separated using comma) as CSV.
Format:
  ```
curl -X GET http://localhost:5001/api/export/PRODUCT_ID_1,PRODUCT_ID_2,...
  ```
Sample usage:
  ```
curl -X GET http://localhost:5001/api/export/434,4321
  ```

Expected response if item is successfully exported (200 OK):
  ```
  "id","item","price","quantity"
"434","ExcaliburV2","99.99","99"
"4321","Toy","33.33","333"
  ```

You can also open a browser and enter `http://localhost:5001/api/export/434,4321`, which will directly download a csv file accordingly.