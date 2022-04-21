import Dotenv from 'dotenv';
Dotenv.config();

import { unexpectListener } from "./utils";
import Service from "./service";

async function run() {
  unexpectListener();

  Service.run();
}

run();
