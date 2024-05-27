const { Router } = require("express");
const router = Router();
const UsuarioManager = require("../dao/UsersManager.js");
const { generaHash, validaPassword } = require("../utils.js");
const CartsManager = require("../dao/CartsManager.js");
const usuarioManager = new UsuarioManager();
const cartsManagar =new CartsManager();
const auth = require("../middleware/auth.js");
const passport = require("passport");

router.get("/error",(req, res) => {
    res.setHeader("Content-Type","application/json");
    return res.status(500).json({error:"Fallos al autenticar"});
});

router.get("/github", passport.authenticate("github",{}),(req, res) => {

});

router.get("/callbackGithub", passport.authenticate("github",{failureRedirect:"/api/sessions/error"}),(req, res) => {
    req.session.usuario = req.user;
    //res.setHeader("Content-Type","application/json");
    //return res.status(200).json({payload: req.user});
    return res.status(200).redirect("/products");
});

router.post("/registro", passport.authenticate("registro",{failureRedirect:"/api/sessions/error"}), async (req, res) => {
    res.setHeader("Content-Type","application/json");
    //return res.status(201).json({mensaje:"Registro OK", nuevoUsuario:req.user});
    return res.status(200).redirect("/login");
});

router.post("/login", passport.authenticate("login",{failureRedirect:"/api/sessions/error"}), async(req, res) => {
    let usuario = {...req.user};
    delete usuario.password;
    delete usuario.createdAt;
    delete usuario.updatedAt;
    req.session.usuario = usuario;
    //res.setHeader("Content-Type","application/json");
    //return res.status(200).json({payload:"Login Correcto", usuario});
    return res.status(200).redirect("/products");
});

router.get("/logout", auth, (req, res) => {
    req.session.destroy(error => {
        if(error){console.log(error);
            res.setHeader("Content-Type","application/json");
            return res.status(500).json({error:"Error inesperado en el servidor", detalle:`${error.message}`});
            
        }
    })

    //res.setHeader("Content-Type","application/json");
    //return res.status(200).json({payload:"Logout exito"});
    return res.status(200).redirect("/login");
});

router.get("/crearcookie", async (req, res) => {
    let datos = {nombre:"Paulina", deporte:"Crossfit"};
    res.cookie("cookie1","Valor Cookie 1", {});
    res.cookie("cookie2", datos,{});
    res.cookie("cookie3", "Vive 5 segúndos",{maxAge:5000});
    res.cookie("cookie4", "Con fecha de expiración",{expires:new Date(2024,4,15)});

    let MisCookies = req.cookies;

    console.log(MisCookies);
    if(req.session.contador){req.session.contador++}else{req.session.contador = 1}
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1> <br><h2>Creando Cookies</h2><h3></h3>${req.session.contador}`);
});

router.get("/leercookie", async (req, res) => {
    let MisCookies = req.cookies;
    
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1><br><h2>leyendo Cookies</h2>`);
    console.log(MisCookies);
});

router.get("/borrarcookie", (req, res)=>{
    res.clearCookie("cookie1");
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1><br><h2>Cookie1 Borrada</h2>`);
});

module.exports = router;
