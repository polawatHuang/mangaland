import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateAccessToken, generateRefreshToken } from '@utils/GenerateToken';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        const googleUser = {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0].value,
            avatar: profile.photos?.[0].value,
            provider: profile.provider,
        };

        const token = generateAccessToken(googleUser);
        const newrefreshToken = generateRefreshToken(googleUser);
        
        return done(null, { token, newrefreshToken });
    }
  )
);

export default passport;
