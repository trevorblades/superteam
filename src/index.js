import axios from 'axios';
import cors from 'cors';
import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import schema from './schema';
import session from 'express-session';
import socketio from 'socket.io';
import {ApolloServer} from 'apollo-server-express';
import {Op} from 'sequelize';
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

function serialize(user, cb) {
  return cb(null, user);
}

passport.serializeUser(serialize);
passport.deserializeUser(serialize);

async function getUserForProvider(key, {id, email, name, image}) {
  let user = await User.findOne({
    where: {
      [Op.or]: {
        [key]: id,
        [Op.and]: {
          [key]: {
            [Op.is]: null
          },
          email: {
            [Op.iLike]: email
          }
        }
      }
    }
  });

  if (!user) {
    user = User.build();
  }

  user.set({
    email,
    name,
    image,
    [key]: id
  });

  return user.save();
}

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      includeEmail: true
    },
    async (token, tokenSecret, profile, cb) => {
      const {id, displayName, photos, emails} = profile;
      const [{value: email}] = emails;
      const [{value: photo}] = photos;

      const user = await getUserForProvider('twitterId', {
        id,
        email,
        name: displayName,
        image: photo.replace(/_normal/, '')
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
  io.in(req.session.socketId).emit('token', req.user.toJWT());
  res.end();
});

app.get('/facebook/:accessToken', async (req, res) => {
  const {data} = await axios.get(
    `https://graph.facebook.com/me?fields=name,email,picture&access_token=${
      req.params.accessToken
    }`
  );

  const user = await getUserForProvider('facebookId', {
    id: data.id,
    email: data.email,
    name: data.name,
    image: data.picture.data.url
  });

  res.send(user.toJWT());
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
