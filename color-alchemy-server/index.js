const express = require("express");

const app = express();
const router = express.Router();
const path = require('path');
const port = 9876;

const getRandomInt = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getGameInfo = (userId) => {
  if (!userId) {
    userId = Math.random().toString(16).slice(2, 8);
  }

  return {
    userId,
    width: getRandomInt(10, 20),
    height: getRandomInt(4, 10),
    maxMoves: getRandomInt(8, 20),
    target: [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)],
  };
};

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

router.get('/', (_, res) => {
  res.sendFile(path.join(__dirname+'/game.html'));
  //__dirname : It will resolve to your project folder.
});

app.get("/init", (_, res) => {
  return res.json(getGameInfo());
});

app.get("/init/user/:id", (req, res) => {
  return res.json(getGameInfo(req.params.id));
});

app.use("/static", express.static('./static/'));

app.use('/', router);

app.listen(port, () => {
  console.log(`Start color-alchemy-server at ${port}`);
});
