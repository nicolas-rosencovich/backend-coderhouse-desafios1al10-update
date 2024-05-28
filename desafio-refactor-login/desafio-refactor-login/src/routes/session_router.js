const { Router } = require("express");
const router = Router();
const passport = require("passport");
const UsuarioManager = require("../dao/UsersManager.js");
const { generaHash, validaPassword } = require("../utils.js");
const CartsManager = require("../dao/CartsManager.js");
const auth = require("../middleware/auth.js");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error);
  if (error instanceof passport.AuthenticationError) {
    response.status(401).json({ error: "Credenciales inválidas" });
  } else {
    response.status(500).json({ error: "Error inesperado en el servidor" });
  }
};

// Configure Express session
const app = express();
const mongoStore = new MongoStore({
  mongoUrl: process.env.MONGODB_URL,
  collection: "sessions",
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mongoStore,
}));

// Initialize passport strategies
passport.use("github", passport.strategy(require("passport-github2").Strategy, {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}));

passport.use("registro", require("./strategies/registro.js"));
passport.use("login", require("./strategies/login.js"));

// User authentication routes
router.get("/error", (request, response) => {
  response.status(401).json({ error: "Credenciales inválidas" });
});

router.get("/github", passport.authenticate("github", {}));

router.get("/callbackGithub", passport.authenticate("github", { failureRedirect: "/api/sessions/error" }), (request, response) => {
  request.session.usuario = request.user;
  response.redirect("/products");
});

router.post("/registro", passport.authenticate("registro", { failureRedirect: "/api/sessions/error" }), async (request, response) => {
  response.status(201).json({ mensaje: "Registro exitoso" });
});

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/error" }), async (request, response) => {
  let usuario = { ...request.user };
  delete usuario.password;
  delete usuario.createdAt;
  delete usuario.updatedAt;
  request.session.usuario = usuario;
  response.redirect("/products");
});

// User session management routes
router.get("/logout", auth, async (request, response) => {
  await request.session.destroy();
  response.redirect("/login");
});

// Cookie management routes
router.get("/crearcookie", async (request, response) => {
  let datos = { nombre: "Paulina", deporte: "Crossfit" };
  response.cookie("cookie1", "Valor Cookie 1", {});
  response.cookie("cookie2", datos, {});
  response.cookie("cookie3", "Vive 5 segúndos", { maxAge: 5000 });
  response.cookie("cookie4", "Con fecha de expiración", { expires: new Date(2024, 4, 15) });

  let MisCookies = request.cookies;
  console.log(MisCookies);
  if (request.session.contador) {
    request.session.contador++;
  } else {
    request.session.contador = 1;
  }
  response.send(`<h1>Estamos en Session</h1> <br><h2>Creando Cookies</h2><h3></h3>${request.session.contador}`);
});

router.get("/leercookie", async (request, response) => {
  let MisCookies = request.cookies;
  response.send(`<h1>Estamos en Session</h1><br><h2>leyendo Cookies</h2>`);
  console.log(MisCookies);
});

router.get("/borrarcookie", (request, response) => {
  response.clearCookie("cookie1");
response.send(`<h1>Estamos en Session</h1><br><h2>Cookie1`)
})
