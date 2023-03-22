const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const teamsRoutes = require("./routes/teams");
const playersRoutes = require("./routes/players");

const app = express();
var corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);
app.use("/teams", teamsRoutes);
app.use("/players", playersRoutes);

const port = process.env.PORT || 3101;

app
  .listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  })
  .on("error", function (err) {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });
