import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { connectToDB } from "./config/db";

dotenv.config();

async function startServer() {
  await connectToDB();
  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    console.log(`Server is now listening on port ${process.env.PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error while starting the server: ", err);
  process.exit(1);
});
