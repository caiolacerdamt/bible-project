const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.post("/api/busca-versiculo", async (req, res) => {
  try {
    const { search } = req.body;
    const token = process.env.APItoken;

    const response = await axios.post(
      "https://www.abibliadigital.com.br/api/verses/search",
      {
        version: "nvi",
        search,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
