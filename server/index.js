// Imports
const express = require("express");
const cors = require("cors");

// Express app creation
const app = express();

// Routes
const userRoutes = require("./routes/UserRoutes");

app.use(cors());

// Receive parameters from the Form requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRoutes);

// App init
app.listen(8080, () => {
  console.log(`Server is listenning on ${8080}! (http://localhost:${8080})`);
});
