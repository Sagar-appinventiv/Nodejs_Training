import express from 'express';
import { MongoClient, ChangeStream, ChangeStreamOptions, Document, ObjectId } from 'mongodb';

const app = express();
const port = 3000;

const mongoURI = 'mongodb+srv://Sagarsky26:Sagarsky26@cluster0.fqp5eri.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'myDatabase';
const collection1Name = 'collection1';
const collection2Name = 'collection2';

async function syncData(changeEvent: Document, targetCollection: string) {
  try {
    if (changeEvent.operationType === 'insert') {
      const insertedData = changeEvent.fullDocument;
      if (!insertedData.synced) {
        const client = new MongoClient(mongoURI);
        await client.connect();
        const db = client.db(dbName);
        const destinationCollection = db.collection(targetCollection);

        insertedData._id = new ObjectId();
        insertedData.synced = true;

        await destinationCollection.insertOne(insertedData);
        console.log('------- Data synchronized :', insertedData);
        client.close();
      }
    }
  } catch (error) {
    console.error('Error syncing data:', error);
  }
}

async function setupChangeStream(collectionName: string, targetCollection: string) {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db(dbName);
    const sourceCollection = db.collection(collectionName);

    const changeStreamOptions: ChangeStreamOptions = { fullDocument: 'updateLookup' };

    const pipeline: Document[] = [{ $match: { 'ns.db': dbName, 'ns.coll': collectionName } }];
    const changeStream: ChangeStream<Document> = sourceCollection.watch(pipeline, changeStreamOptions);

    changeStream.on('change', (changeEvent) => syncData(changeEvent, targetCollection));
  } catch (error) {
    console.error('Error:', error);
  }
}

setupChangeStream(collection1Name, collection2Name);
setupChangeStream(collection2Name, collection1Name);

app.use(express.json());

app.post('/api/insert/collection1', async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required fields.' });
  }

  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const collection1 = db.collection(collection1Name);
    const data = { name, age, synced: false };
    await collection1.insertOne(data);
    client.close();

    res.json(data);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});

app.post('/api/insert/collection2', async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required fields.' });
  }

  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const collection2 = db.collection(collection2Name);
    const data = { name, age, synced: false };
    await collection2.insertOne(data);
    client.close();

    res.json(data);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});