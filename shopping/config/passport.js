var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {

    // User validation

    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    // Find user

    User.findOne({'email': email}, function(err, user) {
        if(err) {
            return done(err);
        }
        if(user) {
            return done(null, false, {message: 'Email is already taken!!'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if(err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {

  // User validation

  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty();
  var errors = req.validationErrors();
  if(errors) {
      var messages = [];
      errors.forEach(function(error) {
          messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
  }

  // Find user

  User.findOne({'email': email}, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, {message: 'User NOT FOUND!!'});
      }
      if(!user.validPassword(password)) {
        return done(null, false, {message: 'Wrong PASSWORD!!'});
      }
      return done(null, user);
  });
}));
