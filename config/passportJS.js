const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CookieStrategy = require('passport-cookie').Strategy
const argon2 = require('argon2')
const User = require("../users").User
const AddNewUser = require("../users").AddNewUser


// http://www.passportjs.org/docs/username-password/
passport.use('authentication' ,new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
}, function(login, password, done) {
        User.findOne({login: login}, function (err, user) {
            if (err) {
                throw(err);//
            }
            if (!user) {
                return done(null, false, {message: "ERROR: Invalid login"})
            }
            user.VerificationPassword(password).then((result) => {
                console.log(typeof result)
                if (result) {
                    return done(null, user);
                }
                return done(null, false, {message: "ERROR: Invalid password"})
            })
        })
    }
))

//https://stackoverflow.com/questions/47457006/register-user-through-passport-js
passport.use('registration', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    //passReqToCallback: true
}, function (login,password,done) {
    User.findOne({login: login},(err,user)=>{
        if (err) {throw(err)}
        if (user) {
            return done(null, false, {message: "ERROR: This name is already taken"})
        }
        argon2.hash(password).then((password)=>{
            const NewUser = new User({
                login: login,
                password: password
            })
            NewUser.save().then(()=> {console.log('saved')})
            return done(null,NewUser)
        })
        /*
        AddNewUser(login,password).then((newUser)=>{
            if(newUser){
                return done(null,newUser)
            }
            return done(null, false, {message: "ERROR: Failed to register"})
        }*/
    })
}))

passport.use('cookie-session',new CookieStrategy({
    cookieName: 'session',
    passReqToCallback: true
}, function (req,session,done){
    User.findOne({login: req.user.login},function (err,user){
        if (err) throw (err);
        if (!user) {return done(null,false, {message: "ERROR: You doesn't authorize"})
        }
        return done(null,user);
    })
}))

/*Сериализация
Сериализация используется для передачи объектов по сети
и для сохранения их в файлы
*/

passport.serializeUser(function(user, done) {
    done(null, user.id); //хранение пользовательского id
});

passport.deserializeUser(function (id, done){
    User.findById(id).then((user)=> {
        done(null, user); //пользователя нет =>
        // аутентификации нет
    });
});

module.exports.passport = passport