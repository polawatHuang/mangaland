import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { Resp } from "@utils/Response";

dotenv.config();

const prisma = new PrismaClient();

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user: User | null = await prisma.user.findUnique({ where: { id: jwtPayload.userId } });
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username: string, password: string, done: any) => {
      try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return done(null, false, Resp.error("Incorrect username", { status: 401, meta: { timestamp: new Date().toISOString() } }));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, Resp.error("Incorrect password", { status: 401, meta: { timestamp: new Date().toISOString() } }));
        
        prisma.user.update({ where: { id: user.id }, data: { latestLogin: new Date() } });
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;