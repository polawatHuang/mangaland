import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { generateAccessToken, generateRefreshToken } from '@utils/GenerateToken';

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: '/api/auth/discord/callback',
      scope: ['identify', 'email'],
    },
    (accessToken, refreshToken, profile, done) => {
        const discordUser = {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`,
          provider: profile.provider,
        };

        const token = generateAccessToken(discordUser);
        const newrefreshToken = generateRefreshToken(discordUser);
        
        return done(null, { token, newrefreshToken });
    }
  )
);

export default passport;
