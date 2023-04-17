import express from "express";
import path from "path";
import dotenv from "dotenv";
import { findUser, findUserOrFail } from "./lib/auth.js";
import users from "./data/users.js";
import { notificationWhenUserIsCreated } from "./lib/mailer.js";

dotenv.config({ path: "./../.env" });

const app = express();

const publicDir = path.join(process.cwd(), "./../public");

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());

app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "./src/views"));

function errorHandler (error, request, response, next) {
  console.log( `error ${error.message}`) // log the error
  const status = error.status || 400
  // send back an easily understandable error message to the caller
  response.status(status).json({error: error.message})
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", function (req, res) {
  req.session.destroy();
  res.render("index");
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserOrFail(email, password);
  return res.render("dashboard", {
    message: "You're in!",
  });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    return res.render("register", {
      message: "Passwords do not match",
    });
  }

  const user = findUser(email, password);

  if (user) {
    return res.render("register", {
      message: "This email is already in use",
    });
  }

  const newUser = {
    name,
    email,
    password,
  }
  users.push(newUser);

  await notificationWhenUserIsCreated(email); 

  console.log(users);

  return res.render("dashboard", {
    message: "You're registered!",
  })
});

app.get("/api/__test__/users", (req, res) => {
  res.json(users);
});

app.use(errorHandler);

export default app;
