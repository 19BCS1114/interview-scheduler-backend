const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB =
  "mongodb+srv://19bcs1114:Anubhav123@cluster0.xwhfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => console.log(err));

const homePage = require("./router/homePage");
const createInterview = require("./router/createInterview");
const editInterview = require("./router/editInterview");

app.use("/", homePage);
app.use("/createinterview", createInterview);
app.use("/editinterview", editInterview);

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running on 3001");
});
