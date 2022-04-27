const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k0zgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const categoryCollection = client
      .db("volunteerCategories")
      .collection("category");
    const volunteerCollection = client
      .db("volunteerCategories")
      .collection("volunteer");
    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    app.get("/donations", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = volunteerCollection.find(query);
      const donations = await cursor.toArray();
      res.send(donations);
    });

    app.delete("/donate/:id", async (req, res) => {
      const donationId = req.params.id;
      const query = { _id: ObjectId(donationId) };
      const result = await volunteerCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/category", async (req, res) => {
      const category = req.body;
      const result = await categoryCollection.insertOne(category);
      res.send(result);
    });

    app.post("/addDonation", async (req, res) => {
      const volunteer = req.body;
      const result = await volunteerCollection.insertOne(volunteer);
      res.send(result);
    });
  } finally {
    //  await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Volunteer Zone");
});

app.listen(port, () => {
  console.log("Volunteer Zone is running on ", port);
});
