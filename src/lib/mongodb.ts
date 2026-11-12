import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

declare global {
  var mongoClient: MongoClient | undefined;
  var mongoClientUri: string | undefined;
}

let client: MongoClient;

if (
  process.env.NODE_ENV !== "production" &&
  global.mongoClient &&
  global.mongoClientUri === uri
) {
  client = global.mongoClient;
} else {
  client = new MongoClient(uri);

  if (process.env.NODE_ENV !== "production") {
    global.mongoClient = client;
    global.mongoClientUri = uri;
  }
}

export default client;