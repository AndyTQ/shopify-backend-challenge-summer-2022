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

// create product
app.post("/api/create", jsonParser, (req, res) => {
  (async () => {
    try {
      res.set("Content-Type", "text/plain");
      let err = validateId(req.body.id);
      if (err != "") return res.status(400).send(err);

      const data = {
        item: req.body.item,
        price: req.body.price,
        quantity: req.body.quantity,
      };

      const docRef = db.collection("items").doc("/" + req.body.id + "/");
      const doc = await docRef.get();
      if (doc.exists) {
        return res
            .status(400)
            .send(`The id '${req.body.id}' already exists in the database.`);
      }

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

// read a product
app.get("/api/read/:item_id", (req, res) => {
  (async () => {
    try {
      const err = validateId(req.params.item_id);
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }
      const docRef = db.collection("items").doc(req.params.item_id);
      const item = await docRef.get();
      if (!item.exists) {
        return res
            .set("Content-Type", "text/plain")
            .status(400)
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

// read all products
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

// update product
app.put("/api/update/:item_id", jsonParser, (req, res) => {
  (async () => {
    try {
      let err = validateId(req.params.item_id);
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }
      const docRef = db.collection("items").doc(req.params.item_id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res
            .set("Content-Type", "text/plain")
            .status(400)
            .send(`The id '${req.body.id}' does not exist in the database.`);
      }

      const data = {
        item: req.body.item,
        price: req.body.price,
        quantity: req.body.quantity,
      };

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

// delete product
app.delete("/api/delete/:item_id", jsonParser, (req, res) => {
  (async () => {
    try {
      const err = validateId(req.params.item_id);
      if (err != "") {
        return res.set("Content-Type", "text/plain").status(400).send(err);
      }
      const docRef = db.collection("items").doc(req.params.item_id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res
            .set("Content-Type", "text/plain")
            .status(400)
            .send(`The id '${req.body.id}' does not exist in the database.`);
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

// export to csv
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
      const csv = json2csv.parse(response);
      const todayDate = new Date().toISOString().slice(0, 10);
      res.attachment(`inventory-${todayDate}.csv`);
      return res.set("Content-Type", "text/csv").status(200).send(csv);
    } catch (error) {
      console.log(error);
      return res.set("Content-Type", "text/plain").status(500).send(error);
    }
  })();
});

app.listen(port, () => console.log(`Access to the server at http://localhost:${port}`))
