const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const MAXTOKENS = 200;

const port = process.env.PORT || 3001;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get('*', (req, res) => {
    res.redirect(301, 'https://awllms.com');
});

app.post('/ai', async (req, res) => {
    const {data, model} = req.body;
    data["max_tokens"] = MAXTOKENS;

    try {
        const response = await openai.createCompletion(model, data);
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

const server = app.listen(port, (error) => {
    if (error) throw error;
    console.log(
      `App is running in ${process.env.NODE_ENV} on port ${
        process.env.PORT ? process.env.PORT : 3001
      }`
    );
});
  
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));

});