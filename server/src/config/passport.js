const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ 
          socialId: profile.id,
          authProvider: 'google' 
        });

        // If user exists, return the user
        if (user) {
          return done(null, user);
        }

        // Check if a user with this email already exists
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        user = await User.findOne({ email });

        if (user) {
          // User exists but hasn't linked their Google account
          // We'll update the user with Google info
          user.authProvider = 'google';
          user.socialId = profile.id;
          user.socialProfile = profile;
          user.isEmailVerified = true; // Email is verified through Google
          await user.save();
          return done(null, user);
        }

        // Create a new user with Google data
        const username = profile.displayName.toLowerCase().replace(/\s+/g, '') + 
                        Math.floor(Math.random() * 10000);

        const newUser = await User.create({
          email: email,
          username: username,
          authProvider: 'google',
          socialId: profile.id,
          socialProfile: profile,
          isEmailVerified: true, // Email is verified through Google
          profile: {
            name: profile.displayName,
          }
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// LinkedIn OAuth Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this LinkedIn ID
        let user = await User.findOne({ 
          socialId: profile.id,
          authProvider: 'linkedin' 
        });

        // If user exists, return the user
        if (user) {
          return done(null, user);
        }

        // Check if a user with this email already exists
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        user = await User.findOne({ email });

        if (user) {
          // User exists but hasn't linked their LinkedIn account
          // We'll update the user with LinkedIn info
          user.authProvider = 'linkedin';
          user.socialId = profile.id;
          user.socialProfile = profile;
          user.isEmailVerified = true; // Email is verified through LinkedIn
          await user.save();
          return done(null, user);
        }

        // Create a new user with LinkedIn data
        const username = profile.displayName.toLowerCase().replace(/\s+/g, '') + 
                        Math.floor(Math.random() * 10000);

        const newUser = await User.create({
          email: email,
          username: username,
          authProvider: 'linkedin',
          socialId: profile.id,
          socialProfile: profile,
          isEmailVerified: true, // Email is verified through LinkedIn
          profile: {
            name: profile.displayName,
          }
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
