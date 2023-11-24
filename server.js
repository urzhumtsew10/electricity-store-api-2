const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "32DWE0EFLTX456D7";

const { MongoClient, ObjectId } = require("mongodb");
const url =
  "mongodb+srv://andrew:Pass321@electricitystore.7fcbtjd.mongodb.net/";
const mongoClient = new MongoClient(url);

const app = express();
const PORT = 3030;

const getProducts = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("products");
    const results = await collection.find().toArray();
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const addProduct = async (product) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("products");
    const results = await collection.insertOne(product);
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const getCategories = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("categories");
    const results = await collection.find().toArray();
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const addCategory = async (category) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("categories");
    const results = await collection.insertOne(category);
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const getUsers = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("users");
    const results = await collection.find().toArray();
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const addNewUser = async (user) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("users");
    const results = await collection.insertOne(user);
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const getElected = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("elected");
    const results = await collection.find().toArray();
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const addElected = async (product) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("elected");
    const results = await collection.insertOne(product);
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const deleteElected = async (productId) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("electricirty-store");
    const collection = db.collection("elected");
    const results = await collection.deleteOne({
      productId: productId,
    });
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Welcome to Electricity store API");
});

app.get("/products", (req, res) => {
  getProducts().then((data) => res.send(JSON.stringify(data)));
});

app.post("/products", (req, res) => {
  addProduct(req.body);
  res.send("200");
});

app.get("/products/:id", (req, res) => {
  getProducts().then((products) => {
    const product = products.filter(
      (product) => new ObjectId(product.id) === +req.params["id"]
    )[0];
    res.send(JSON.stringify(product));
  });
});

app.get("/categories", (req, res) => {
  getCategories().then((categories) => res.send(JSON.stringify(categories)));
});

app.post("/categories", (req, res) => {
  addCategory(req.body);
  res.send("200");
});

app.get("/users", (req, res) => {
  getUsers().then((users) => res.send(JSON.stringify(users)));
});

app.get("/elected", (req, res) => {
  getElected().then((products) => res.send(JSON.stringify(products)));
});

app.post("/elected", (req, res) => {
  addElected(req.body);
});

app.delete("/elected/:id", (req, res) => {
  deleteElected(+req.params["id"]);
  res.send("200");
});

app.post("/user/register", async (req, res) => {
  const newUser = req.body;
  const token = jwt.sign(
    { name: newUser.email, role: newUser.role },
    SECRET_KEY
  );
  getUsers().then((users) => {
    const isFindedUser = users.filter(
      (user) => user.email === newUser.email
    )[0];
    if (isFindedUser) {
      res.send(JSON.stringify({ email: false }));
    } else {
      const user = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        token: token,
        role: "user",
      };

      addNewUser(user);
      res.send(JSON.stringify(user));
    }
  });
});

app.post("/user/auth", (req, res) => {
  const userData = req.body;
  getUsers().then((users) => {
    const isOldUser = users.filter((user) => user.email === userData.email)[0];
    if (isOldUser) {
      if (isOldUser.password === userData.password) {
        res.send(
          JSON.stringify({ email: true, password: true, userData: isOldUser })
        );
      } else {
        res.send(JSON.stringify({ email: true, password: false }));
      }
    } else {
      res.send(JSON.stringify({ email: false, password: false }));
    }
  });
});

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server is listening port ${PORT}`);
});
