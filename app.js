require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");
const mercadopago = require("mercadopago");

var app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/detail", function(req, res) {
  const { title, price, unit, img } = req.query;
  mercadopago.configure({
    access_token: process.env.PROD_ACCESS_TOKEN
  });
  let preference = {
    items: [
      {
        title: title,
        unit_price: Number(price),
        quantity: Number(unit),
        pictures_url: img
      }
    ]
  };
  mercadopago.preferences
    .create(preference)
    .then(resp => {
      global.init_point = resp.body.init_point;
      res.render("detail", {
        img,
        price,
        title,
        unit,
        id_preference: resp.body.id
      });
    })
    .catch(err => console.log(err));
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(3000);

// {"id":535304012,"nickname":"TESTXQBKTCN6","password":"qatest352","site_status":"active","email":"test_user_65083033@testuser.com"}
