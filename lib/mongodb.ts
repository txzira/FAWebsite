import { MongoClient } from "mongodb";

export const connectToDatabase = async (): Promise<MongoClient> => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.guzod6i.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  );
  return client;
};
