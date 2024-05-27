const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const UsuarioManager = require("../dao/UsersManager.js");
const CartsManager = require("../dao/CartsManager.js");
const { generaHash, validaPassword } = require("../utils.js");

const cartsManager = new CartsManager();
const usuarioManager = new UsuarioManager();

const initPassport = () => {
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv23liK3HzRiINoNgoC7",
                clientSecret: "73c63df9be3b7f02010a523cafa995cebb8d4ec8",
                callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
            },
            async (tokenAcceso, tokenRefresh, profile, done) => {
                try {
                    let email = profile._json.email;
                    let nombre = profile._json.name;
                    if (!email) {
                        return done(null, false);
                    }
                    let usuario = await usuarioManager.getUsuarioBy({ email });
                    if (!usuario) {
                        let cart = await cartsManager.crearCarrito();
                        usuario = await usuarioManager.createUsuario({
                            first_name: nombre,
                            email,
                            cart,
                            profile
                        });
                    }
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "registro",
        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    let { nombre: first_name, apellido: last_name, edad: age, rol } = req.body;
                    if (!first_name) {
                        return done(null, false);
                    }

                    let emailCheck = await usuarioManager.getUsuarioBy({ email: username });
                    if (emailCheck) {
                        return done(null, false);
                    }

                    let cart = await cartsManager.crearCarrito();
                    password = generaHash(password);
                    let usuario = { first_name, last_name, age, email: username, password, rol, cart };
                    let nuevoUsuario = await usuarioManager.createUsuario(usuario);
                    if (nuevoUsuario) {
                        nuevoUsuario = { ...nuevoUsuario };
                        delete nuevoUsuario.password;
                        return done(null, nuevoUsuario);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    let existeUsuario = await usuarioManager.getUsuarioBy({ email: username });
                    if (!existeUsuario) {
                        return done(null, false);
                    }
                    if (!validaPassword(password, existeUsuario.password)) {
                        return done(null, false);
                    }
                    return done(null, existeUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let usuario = await usuarioManager.getUsuarioBy({ _id: id });
            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    });
};

module.exports = initPassport;
