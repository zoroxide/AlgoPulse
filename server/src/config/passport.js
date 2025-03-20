const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    // Find user in database
    User.findById(jwtPayload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => done(err, false));
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return done(null, false);
    }
    done(null, {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
      avatar: foundUser.avatar,
    });
  } catch (err) {
    done(err);
  }
});

module.exports = passport;