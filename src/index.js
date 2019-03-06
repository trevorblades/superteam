import cors from 'cors';
import express from 'express';
import http from 'http';
import passport from 'passport';
import session from 'express-session';
import socketio from 'socket.io';
import {ApolloServer} from 'apollo-server-express';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {User, sequelize} from './db';
import {resolvers, typeDefs} from './schema';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: 'http://localhost:8000'
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
      callbackURL: process.env.TWITTER_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, cb) => {
      const {id, username, displayName, photos} = profile;
      let user = await User.findByPk(id);
      if (!user) {
        user = await User.create({
          id,
          username,
          displayName,
          profileImage: photos[0].value.replace(/_normal/, '')
        });
      }

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
  io.in(req.session.socketId).emit('user', req.user.get());
  res.end();
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
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
