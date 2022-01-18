// const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const json2csv = require("json2csv");
const bodyParser = require('body-parser');
const app = express();
const port = 5001;
const db = require("../utils/db").db;
const validateId = require("../utils/helper").validateId;
const validateValue = require("../utils/helper").validateValue;
const jsonParser = bodyParser.json();

app.use(cors({origin: true}));

// Create a new product
app.post("/api/create", jsonParser, (req, res) => {
  (async () => {
    try {
      res.set("Content-Type", "text/plain");
      // Check whether the given id is valid.
      let err = validateId(req.body.id);
      if (err != "") return res.status(400).send(err);

      const data = {
        item: req.body.item,
        price: req.body.price,
        quantity: req.body.quantity,
      };

      const docRef = db.collection("items").doc("/" + req.body.id + "/");
      const doc = await docRef.get();

      // Check whether the product exists in the inventory.
      if (doc.exists) {
        return res
            .status(400)
            .send(`The id '${req.body.id}' already exists in the database.`);
      }
      // Check whether the given metadata is valid.
      err = validateValue(data);
      if (err != "") return res.status(400).send(err);

      await docRef.create(data);
      return res
          .status(200)
          .send(
              `Success! ${req.body.item} with id ${req.body.id} has been added.`
          );
    } catch (error) {
      console.log(error);
      res.set("Content-Type", "text/plain");
      return res.status(500).send(error);
    }
  })();
});

// Read a product
app.get("/api/read/:item_id", (req, res) => {
  (async () => {
    try {
      const err = validateId(req.params.item_id);
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }
      const docRef = db.collection("items").doc(req.params.item_id);
      const item = await docRef.get();

      // Check whether the product exists in the inventory.
      if (!item.exists) {
        return res
            .set("Content-Type", "text/plain")
            .status(404)
            .send(
                `Product with id '${req.params.item_id}' does not exist.`
            );
      }

      const response = item.data();
      return res
          .set("Content-Type", "application/json")
          .status(200)
          .send(response);
    } catch (error) {
      console.log(error);
      return res.set("Content-Type", "text/plain").status(500).send(error);
    }
  })();
});

// Read all products
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("items");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item,
            price: doc.data().price,
            quantity: doc.data().quantity,
          };
          response.push(selectedItem);
        }
      });
      
      return res
          .set("Content-Type", "application/json")
          .status(200)
          .send(response);
    } catch (error) {
      console.log(error);
      return res.set("Content-Type", "text/plain").status(500).send(error);
    }
  })();
});

// Update product
app.put("/api/update/:item_id", jsonParser, (req, res) => {
  (async () => {
    try {
      // Check whether the given id is valid.
      let err = validateId(req.params.item_id);
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }
      const docRef = db.collection("items").doc(req.params.item_id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res
            .set("Content-Type", "text/plain")
            .status(404)
            .send(`The id '${req.body.id}' does not exist.`);
      }

      const data = {
        item: req.body.item,
        price: req.body.price,
        quantity: req.body.quantity,
      };
      // Check whether the given metadata is valid.
      err = validateValue(data);
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }
      await docRef.update(data);
      return res
          .set("Content-Type", "text/plain")
          .status(200)
          .send(
              `Product with id ${
                req.params.item_id
              } has been updated. New product metadata: ${JSON.stringify(
                  data
              )}`
          );
    } catch (error) {
      console.log(error);
      return res.set("Content-Type", "text/plain").status(500).send(error);
    }
  })();
});

// Delete product
app.delete("/api/delete/:item_id", jsonParser, (req, res) => {
  (async () => {
    try {
      // Check whether the given id is valid.
      const err = validateId(req.params.item_id);
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }
      const docRef = db.collection("items").doc(req.params.item_id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res
            .set("Content-Type", "text/plain")
            .status(404)
            .send(`The id '${req.body.id}' does not exist.`);
      }

      await docRef.delete();
      return res
          .set("Content-Type", "text/plain")
          .status(200)
          .send(
              `Product with id ${req.params.item_id} has been deleted.`
          );
    } catch (error) {
      console.log(error);
      return res.set("Content-Type", "text/plain").status(500).send(error);
    }
  })();
});

// Export to csv
app.get("/api/export", (req, res) => {
  (async () => {
    try {
      const query = db.collection("items");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item,
            price: doc.data().price,
            quantity: doc.data().quantity,
          };
          response.push(selectedItem);
        }
      });
      // Check whether the current inventory is empty.
      // If so, return an empty csv.
      let csv = "";
      if (response.length == 0){
        csv = "id,item,price,quantity";
      }
      else{
        csv = json2csv.parse(response);
      }

      const todayDate = new Date().toISOString().slice(0, 10);
      res.attachment(`inventory-${todayDate}.csv`);
      return res.set("Content-Type", "text/csv").status(200).send(csv);
    } catch (error) {
      console.log(error);
      return res.set("Content-Type", "text/plain").status(500).send(error);
    }
  })();
});

// Export to csv by an array of ids
app.get("/api/export/:item_ids", jsonParser, (req, res) => {
  (async () => {
    try {
      let idArray = req.params.item_ids.split(",");
      let idSet = new Set(idArray); // use set for faster time complexity
      let err = "";
      for (let i = 0; i < idArray.length; i++) {
        let currentErr = validateId(idArray[i]);
        if (currentErr != "") {
          currentErr = `Error at the ${i}th id: \n` + currentErr;
        }
        err += currentErr;
      }
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }

      const query = db.collection("items");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          if (idSet.has(doc.id)){ // found an id that we are querying
            const selectedItem = {
              id: doc.id,
              item: doc.data().item,
              price: doc.data().price,
              quantity: doc.data().quantity,
            };
            // remove the queried id from the set
            // if the set is non-empty after this loop, then some ids are missing.
            idSet.delete(doc.id); 
            response.push(selectedItem);
          }
        }
      });

      if (idSet.size != 0){ // some ids are not found
        err += "The following ids are not found in the database: \n";
        idSet.forEach((element) => {
          err += element + '\n';
        })
        return res.set("Content-Type", "text/plain").status(404).send(err);
      }

      // Check whether the current inventory is empty.
      // If so, return an empty csv.
      let csv = "";
      if (response.length == 0){
        csv = "id,item,price,quantity";
      }
      else{
        csv = json2csv.parse(response);
      }

      const todayDate = new Date().toISOString().slice(0, 10);
      res.attachment(`inventory-${todayDate}.csv`);
      return res.set("Content-Type", "text/csv").status(200).send(csv);
    } catch (error) {
      console.log(error);
      return res.set("Content-Type", "text/plain").status(500).send(error);
    }
  })();
});

app.listen(port, () => console.log(`Access to the server at http://localhost:${port}`));
