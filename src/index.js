import cors from 'cors';
import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import schema from './schema';
import session from 'express-session';
import socketio from 'socket.io';
import {ApolloServer} from 'apollo-server-express';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {User, sequelize} from './db';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      includeEmail: true
    },
    async (token, tokenSecret, profile, cb) => {
      const {id: twitterId, username, displayName, photos, emails} = profile;
      let user = await User.findOne({
        where: {
          twitterId
        }
      });

      if (!user) {
        user = await User.create({twitterId});
      }

      const [{value: email}] = emails;
      await user.update({
        email,
        username,
        displayName,
        profileImage: photos[0].value.replace(/_normal/, '')
      });

      cb(null, user);
    }
  )
);

function addSocketIdToSession(req, res, next) {
  req.session.socketId = req.query.socketId;
  next();
}

const twitterAuth = passport.authenticate('twitter');
app.get('/twitter', addSocketIdToSession, twitterAuth);
app.get('/twitter/callback', twitterAuth, (req, res) => {
  const token = jwt.sign(req.user.get(), process.env.TOKEN_SECRET);
  io.in(req.session.socketId).emit('token', token);
  res.end();
});

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  async context({req}) {
    try {
      const matches = req.headers.authorization.match(/bearer (\S+)/i);
      const token = matches[1];
      const {id} = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findByPk(id);
      return {user};
    } catch (error) {
      return {
        user: null
      };
    }
  }
});

apolloServer.applyMiddleware({app});

sequelize.sync().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT +
        apolloServer.graphqlPath}`
    );
  });
});
