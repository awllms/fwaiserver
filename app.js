const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const { Configuration, OpenAIApi } = require("openai");
const OpenAI = require("openai");

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// app.use((req, res, next) => {
//   console.log(`Incoming ${req.method} request to ${req.url}`);
//   console.log(`Headers: ${JSON.stringify(req.headers)}`);
//   next();
// });

// app.use((err, req, res, next) => {
//   console.error(`Error processing request: ${err.message}`);
//   res.status(500).send("Internal Server Error");
// });

const MAXTOKENS = 200;

const port = process.env.PORT || 3001;

const environment = process.env.NODE_ENV ? "production" : "dev";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);
const openai = new OpenAI();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.post("/ai", async (req, res) => {
  // req.headers.authorization = process.env.OPENAI_API_KEY;
  const { data, model } = req.body;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: data.prompt },
      ],
      model: model,
    });

    console.log(response.choices[0].message);

    res.status(200).send(response);
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

app.listen(port, () => {
  console.log(`App is running in ${environment} on port ${port}`);
});

// const server = app.listen(port, (error) => {
//   if (error) throw error;
//   console.log(`App is running in ${environment} on port ${port}`);
// });

// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });

module.exports = app;
