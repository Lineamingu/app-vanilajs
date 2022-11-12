const express = require("express");
const app = express();
const morgan = require("morgan");
const routes = require("./routes/routes");
const cors = require("cors");

//settings
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use(routes);

//starting the server
app.listen(app.get(`port`), () => {
  console.log(`Server on port ${app.get("port")}`);
});
