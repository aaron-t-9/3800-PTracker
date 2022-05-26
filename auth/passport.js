const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const User = require('../models/user');
const axios = require("axios");

// let URL = process.env.APP_URL;
// if (URL.endsWith('/')) {
//     URL = URL.slice(0, -1);
// }

// function initialize(passport, getUserByEmail, getUserById) {
//     const authenticateUser = (email, done) => {
//         const user = getUserByEmail(email)
//         if (user == null) {
//             return done(null, false, { message: 'No user with that email'})
//         }
//     }
//     passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser((id, done) => {
//         return done(null, getUserById(id))
//     })
// }


// const GOOGLE_CALLBACK_URL = URL + '/auth/google/callback';

passport.use(new LocalStrategy(
    function(request, done) {
      console.log(request);
      prisma.user.findUnique({ 
        where: {email: request.body.email,},
      }, function (err, user) {
        console.log("passport 34");
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'user not found'}); }
        if (!user.verify(request.body.email)) { return done(null, false, { message: 'email not found'}); }
        return done(null, user);
      }).catch(err => {console.log(err.message)});
    }
  ));

// passport.use(new LocalStrategy(
//   function(username, done) {
//     User.findByEmail({ email: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

// passport.use(new LocalStrategy(
//   function(email, done) {

//     var user = prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });
//     console.log(user);

//     // function (user) {
//     //   console.log("passport 55");
//     //   if (!user) { return done(null, false, { message: 'user not found'}); }
//     //   if (!user.verify(email)) { return done(null, false, { message: 'email not found'}); }
//     // });

//     // prisma.user.findUnique({ 
//     //   where: {email: email,},
//     // }, function (err, user) {
//     //   console.log("passport 34");
//     //   if (err) { return done(err); }
//     //   if (!user) { return done(null, false, { message: 'user not found'}); }
//     //   if (!user.verify(email)) { return done(null, false, { message: 'email not found'}); }
//     //   return done(null, user);
//     // });
//   }
// ));

//   passport.use(new LocalStrategy({
//     usernameField: 'email',
//     session: false
//   },
//   function(email, done) {
//     prisma.user.findUnique({ email: email }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false, { message: 'user not found'}); }
//       if (!user.verify(email)) { return done(null, false, { message: 'email not found'}); }
//       return done(null, user);
//     });
//   }
// ));

// passport.use(new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const userExists = await prisma.user.findUnique({
//             where: { 
//                 googleId: profile.id,
//             },
//         });

//         if (!userExists) {
//             let URL = process.env.APP_URL;
//             if (URL.endsWith('/')) {
//                 URL = URL.slice(0, -1);
//             }
//             // send post request, so it can send emails in "background"
//             await axios.post(URL + '/email/newUser', {
//                 name: profile.displayName,
//             });
//         }

//         const user = await prisma.user.upsert({
//             where: {
//                 googleId: profile.id,
//             },
//             create: {
//                 name: profile.displayName,
//                 picture: profile.photos[0].value,
//                 email: profile.emails[0].value,
//                 googleId: profile.id,
//                 sectionId: 1,
//             },
//             update: {
//                 name: profile.displayName,
//                 picture: profile.photos[0].value,
//                 email: profile.emails[0].value,
//             },
//         });
//         return done(null, user);
//     }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

passport.deserializeUser(async (id, done) => {
    const checkUser = await prisma.user.findUnique({
        where: {id: parseInt(id)},
        include: {
            section: true,
            shift: true,
        },
    })
    if (checkUser) {
        done(null, await User.find(id))
    } else {
        // This line of code is for users that didn't exist previously in the database
        done(null, checkUser);
    }
});

module.exports = passport;
