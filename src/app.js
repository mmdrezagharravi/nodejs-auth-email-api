required("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./controllers/authControler");

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to mongo "))
  .catch((err) => console.log("error : ", err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`connected on port ${PORT}`);
});
