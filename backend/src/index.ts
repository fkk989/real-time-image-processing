import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

function init() {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
  });
}

init();
