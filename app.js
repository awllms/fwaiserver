const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const app = express();

// const corsOptions = {
//   origin: ["http://localhost:3000", "http://awllms.com", "https://awllms.com"],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   optionsSuccessStatus: 204,
//   credentials: true,
// };
app.options("*", cors());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// app.use((req, res, next) => {
//   console.log(
//     "Received request:",
//     req.method,
//     req.path,
//     "from origin",
//     req.headers.origin
//   );
//   next();
// });

const MAXTOKENS = 200;

const port = process.env.PORT || 3001;

const environment = process.env.NODE_ENV ? "production" : "dev";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
// const openai = new OpenAI();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.post("/ai", async (req, res) => {
  req.headers.authorization = process.env.OPENAI_API_KEY;
  const { data, model } = req.body;
  data["max_tokens"] = MAXTOKENS;

  // const completion = await openai.chat.completions.create({
  //   ...data,
  //   model: model,
  // });

  try {
    // const response = await openai.createCompletion(model, data);
    const response = await openai.createCompletion({
      ...data,
      model: model,
    });
    console.log(response.data);

    res.status(200).send(response.data);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);

      res.status(400).send(error.response.data);
    } else {
      console.log(error.message);

      res.status(500).send(error.message);
    }
  }
});

app.get("*", (req, res) => {
  res.redirect(301, "https://awllms.com");
});

// app.listen(port, () => {
//   console.log(`App is running in ${environment} on port ${port}`);
// });

// const server = app.listen(port, (error) => {
//   if (error) throw error;
//   console.log(`App is running in ${environment} on port ${port}`);
// });

// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });

module.exports = app;
