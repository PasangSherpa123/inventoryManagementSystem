require("dotenv").config();
import { Client } from "pg";


const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'techunbound',
  password: 'helloworld',
  port: 5432,
});
client.connect();

export default client;