const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}` +
  `@vee9-1.e4dwdky.mongodb.net/?retryWrites=true&w=majority&appName=vee9-1`;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let usersCollection = null;
let tasksCollection = null;
let isConnected = false;
let cbidsCollection = null;

async function initDb() {
  if (!isConnected) {
    await client.connect();
    const db = client.db('usersDB');
    usersCollection = db.collection('users');
    tasksCollection = db.collection('tasks');
    cbidsCollection = db.collection('cbids');
    isConnected = true;
  }
}

app.get('/', (req, res) => {
  res.send('Giggy server is getting hotter.');
});

app.get('/users', async (req, res) => {
  try {
    await initDb();
    const allUsers = await usersCollection.find().toArray();
    res.json(allUsers);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    await initDb();

    const { email } = req.query;
    const query = email ? { email } : {};

    const allTasks = await tasksCollection.find(query).toArray();
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});


app.get('/users/tasks', async (req, res) => {
  try {
    await initDb();
    const allTasks = await tasksCollection.find().toArray();
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});


app.post('/users', async (req, res) => {
  try {
    await initDb();
    const user = req.body;
    const { value: savedUser } = await usersCollection.findOneAndUpdate(
      { email: user.email },
      { $set: user },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ success: true, user: savedUser });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    await initDb();
    const task = req.body;
    const result = await tasksCollection.insertOne(task);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task', details: err.message });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    await initDb();
    const taskId = req.params.id;
    const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Invalid task ID', details: err.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    await initDb();
    const id = req.params.id;
    const updates = req.body;


    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.modifiedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Task not found or not updated.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
});


app.delete('/tasks/:id', async (req, res) => {
  try {
    await initDb();
    const taskId = req.params.id;
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });

    if (result.deletedCount === 1) {
      res.json({ success: true, deletedCount: 1 });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid task ID", details: err.message });
  }
});


app.patch('/users', async (req, res) => {
  try {
    await initDb();
    const { email, lastSignInTime } = req.body;
    const { value: updatedUser } = await usersCollection.findOneAndUpdate(
      { email },
      { $set: { lastSignInTime } },
      { returnDocument: 'after' }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: updatedUser });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/bids', async (req, res) => {
  try {
    await initDb();
    const { taskId, email } = req.body;

    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID' });
    }

    const taskObjectId = new ObjectId(taskId);

    const result = await tasksCollection.updateOne(
      { _id: taskObjectId },
      { $addToSet: { bids: email } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (result.modifiedCount === 0) {
      return res.status(409).json({ success: false, message: 'You already bid on this task.' });
    }

    res.json({ success: true, message: 'Bid placed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to place bid', details: err.message });
  }
});

app.get('/bids/:taskId', async (req, res) => {
  try {
    await initDb();
    const { taskId } = req.params;

    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await tasksCollection.findOne(
      { _id: new ObjectId(taskId) },
      { projection: { bids: 1 } }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true, bids: task.bids || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bids", details: err.message });
  }
});


app.put('/cbids', async (req, res) => {
  try {
    await initDb();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }

    const result = await cbidsCollection.findOneAndUpdate(
      { email },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    res.json({ success: true, cbid: result.value });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update cbid", details: err.message });
  }
});

app.get('/cbids', async (req, res) => {
  try {
    await initDb();

    const allCounts = await cbidsCollection.find().toArray();

    res.json({
      success: true,
      counts: allCounts.map(({ email, count }) => ({ email, count }))
    });
  } catch (err) {
    console.error("Failed to fetch all cbids:", err);
    res.status(500).json({ success: false, error: "Failed to fetch cbids", details: err.message });
  }
});


app.get('/cbids/:email', async (req, res) => {
  try {
    await initDb();
    const email = req.params.email;

    const cbid = await cbidsCollection.findOne({ email });

    res.json({
      success: true,
      count: cbid?.count || 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch cbid", details: err.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
