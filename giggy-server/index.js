const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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

async function initDb() {
  if (!isConnected) {
    await client.connect();
    const db = client.db('usersDB');
    usersCollection = db.collection('users');
    tasksCollection = db.collection('tasks');
    isConnected = true;
  }
}

// Health check
app.get('/', (req, res) => {
  res.send('Giggy server is getting hotter.');
});

// GET /users — all users
app.get('/users', async (req, res) => {
  try {
    await initDb();
    const allUsers = await usersCollection.find().toArray();
    res.json(allUsers);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /tasks — all tasks
app.get('/tasks', async (req, res) => {
  try {
    await initDb();
    const allTasks = await tasksCollection.find().toArray();
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});

// ALIAS: GET /users/tasks — also returns all tasks
app.get('/users/tasks', async (req, res) => {
  try {
    await initDb();
    const allTasks = await tasksCollection.find().toArray();
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});

// POST /users — upsert by email
app.post('/users', async (req, res) => {
  try {
    await initDb();
    const user = req.body;
    const { value: savedUser } = await usersCollection.findOneAndUpdate(
      { email: user.email },
      { $setOnInsert: user },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ success: true, user: savedUser });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /tasks — add a new task
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

// PATCH /users — update lastSignInTime
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

module.exports = app;
module.exports.handler = serverless(app);
