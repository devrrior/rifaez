import './config/env.js';

import express from 'express';
import mongoose from 'mongoose';

import { User } from './models/Users.js';
import raffleRoutes from './routes/raffleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import domainRoutes from './routes/domainRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import CustomDomain from './models/CustomDomain.js';
import path from "path";
import Webhook from "./middleware/webhook.js"
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

const mongoURI = process.env.MONGO_URI;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(mongoURI).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();

app.set('trust proxy', 1);

app.use("/stripe/webhook", Webhook)
  app.use(express.static(path.join(__dirname, '../client/dist')))

  app.use(async (req, res, next) => {
    try {
      const hostname = req.headers.host?.split(':')[0].toLowerCase();
      console.log('Incoming Host:', hostname);
  
      // Is this a known custom domain?
      const domainEntry = await CustomDomain.findOne({ domain: hostname, status: 'verified' })
  
      const isCustomDomain = !!domainEntry;
  
  
      // Attach tenant info for later use if needed
      if (isCustomDomain) {
        req.tenant = {
          domain: domainEntry.domain,
          userId: domainEntry.userId,
        };
      }
      
      next();
    } catch (err) {
      console.error('Error in domain access middleware:', err.message);
      res.status(500).send('Internal server error.');
    }
  });


  app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }));


app.use(express.json({ limit: '10kb' }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));


app.disable('x-powered-by');
app.use(limiter);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://js.stripe.com",
          "https://connect.facebook.net"
        ],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://www.facebook.com",
          "https://rifaez.com",
        ],
        frameSrc: [
          "https://js.stripe.com",
          "https://hooks.stripe.com",
          "https://www.facebook.com",
          "https://staticxx.facebook.com"
        ],
        imgSrc: [
          "'self'",
          "https://res.cloudinary.com",
          "https://www.facebook.com",
          "data:"
        ],
      },
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

import { Strategy as LocalStrategy } from 'passport-local';

passport.use('worker-aware', new LocalStrategy({
  usernameField: 'username'
}, async function verifyWorkerLogin(username, password, done) {
  try {
    // 1. Try login with main user
    const user = await User.findOne({ username: username });
    if (user) {
      const match = await user.authenticate(password);
      if (match.user) {
        match.user.asWorker = false;
        match.user.loggedInEmail = username;
        return done(null, match.user);
      }
    }

    // 2. Try login as a worker
    const owner = await User.findOne({
      workers: {
        $elemMatch: {
          email: username,
          isActive: true
        }
      }
    });
    
    if (!owner) return done(null, false, { message: 'User not found' });

    const match = await owner.authenticate(password);
    if (!match.user) return done(null, false, { message: 'Invalid password' });

    match.user.asWorker = true;
    match.user.loggedInEmail = username;
    return done(null, match.user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    asWorker: user.asWorker,
    loggedInEmail: user.loggedInEmail
  });
});

passport.deserializeUser(async (storedSession, done) => {
  try {
    const user = await User.findById(storedSession.id).lean();

    if (!user) return done(null, false);
    
    user.asWorker = storedSession.asWorker;
    user.loggedInEmail = storedSession.loggedInEmail;

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});



app.use('/api/raffle', raffleRoutes);
app.use('/api/domains', domainRoutes)

app.use('/stripe', stripeRoutes)
app.use('/auth', authRoutes);



app.use((req, res, next) => {
  if (req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/stripe') &&
      !req.path.startsWith('/auth')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    next();
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack); // Log for debugging
  console.log(err.message)
  res.status(err.status || 500).json({
    success: false,
    type: "form",
    message: err.message || 'Internal Server Error',
  });
})
app.listen(5050, () => {
    console.log('Server is running on port 5050');
  });

  import './jobs/cronPayment.js';
  