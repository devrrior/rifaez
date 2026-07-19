import {User} from '../models/Users.js'
import Raffle from '../models/Raffle.js';
import { registerSchema, saveSchema, workerSchema, methodSchema } from '../validators/registerSchema.js';
import { v2 as cloudinary } from 'cloudinary';
import setUserForClient from '../functions/userClient.js';
import plans from '../seed/plans.js';
import passport from 'passport';
import AppError from '../utils/AppError.js';
import axios from "axios";
import crypto from 'crypto';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,       // your email address
      pass: process.env.EMAIL_PASS        // your email password or app password
    }
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
});

export const register = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.json({ message: error.details[0].message, status: 400 });
    }
    const { email, name, password } = value;
    const userWithWorker = await User.findOne({ "workers.email": email });
    if(userWithWorker){
      return res.json({ message: 'Ya existe una cuenta con este correo.', status: 400 })
    }
    const user = new User({ username: email, name });
    try {
      await User.register(user, password);
      req.login(user, async () => {
        const clientUser = await setUserForClient(req, user);
        res.json({
          user: clientUser,
          message: 'Creación de usuario fue exitosa.',
          status: 201,
        });
      });
    } catch (err) {
      if (err.name === 'UserExistsError') {
        return res.json({ message: 'Ya existe una cuenta con este correo.', status: 400 });
      }
      return res.json({ message: 'Error al registrar el usuario.', error: err.message, status: 500 });
    }
}
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const logoPublicId = user.logo?.public_id;
    if (logoPublicId) {
      await cloudinary.uploader.destroy(logoPublicId);
    }

    const rafflesToDelete = await Raffle.find({ _id: { $in: user.raffles } });
    if (rafflesToDelete.length > 0) {
      await Promise.all(
        rafflesToDelete.map(async (raffle) => {
          if (raffle.images && raffle.images.length > 0) {
            await Promise.all(
              raffle.images.map(({ public_id }) =>
                cloudinary.uploader.destroy(public_id)
              )
            );
          }
        })
      );
    }

    await Raffle.deleteMany({ _id: { $in: user.raffles } });

    if (user.stripeCustomerId) {
      await stripe.customers.del(user.stripeCustomerId);
    }

    await User.findByIdAndDelete(req.user._id);

    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: 'User account and data deleted successfully' });
      });
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const login = (req, res, next) => {
    passport.authenticate('worker-aware', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.json({ message: 'Email or password is incorrect', status: 400 });
      }
      req.logIn(user, async (err) => {
        if (err) return next(err);
        const clientUser = await setUserForClient(req, user)
        return res.json({ message: 'Login successful!', user: clientUser , status: 200 });
      });
    })(req, res, next);
  }


  export const facebookLogin = async (req, res, next) => {
    const { accessToken, userID } = req.body;
  
    if (!accessToken || !userID) {
      return res.status(400).json({ error: 'Missing accessToken or userID' });
    }
  
    try {
      const appAccessToken = `${process.env.FB_CLIENT_ID}|${process.env.FB_CLIENT_SECRET}`;
      const debugRes = await axios.get(`https://graph.facebook.com/debug_token`, {
        params: {
          input_token: accessToken,
          access_token: appAccessToken,
        },
      });
  
      const isValid = debugRes.data.data?.is_valid && debugRes.data.data.user_id === userID;
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid Facebook token' });
      }
  
      const userRes = await axios.get('https://graph.facebook.com/me', {
        params: {
          access_token: accessToken,
          fields: 'id,name,email,picture,link',
        },
      });
  
      const fbUser = userRes.data;
  
      let user = await User.findOne({ facebookId: fbUser.id });
  
      if (!user) {
        user = await User.findOne({ username: fbUser.email });

        if (user) {
          return res.json({
            error: 'Email already registered. Please log in with email/password first to connect Facebook.',
            email: user.username,
            facebookId: fbUser.id,
            facebookUrl: fbUser.link,
            status: 409,
          });
        }
        user = await User.create({
          facebookId: fbUser.id,
          name: fbUser.name,
          username: fbUser.email || null,
          profilePicture: fbUser.picture?.data?.url || null,
        });
      }
  
      req.login(user, async (err) => {
        if (err) return next(err);
  
        const clientUser = await setUserForClient(req, user);
        return res.json({ message: 'Login successful!', user: clientUser, status: 200 });
      });
  
    } catch (error) {
      console.error('Facebook login error:', error);
      return res.status(500).json({ error: 'Facebook login failed' });
    }
  };

  export const linkAccount = async (req, res) => {
    const {email, facebookId} = req.body
    const user = await User.findByUsername(email)
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.facebookId = facebookId;
    await user.save();
    
    req.login(user, async (err) => {
      if (err) return res.status(500).json({ error: 'Login failed after linking' });
      const clientUser = await setUserForClient(req, user)
      res.json({
        message: "success",
        status: 200,
        user: clientUser,
      })
    });
  }
  
export const logout = (req, res, next) => {
    req.logout(function (err) {
      if (err) { 
        return next(err); 
      }
      res.json({ message: 'Logged out successfully' }); // ✅ Only ONE response
    });
}
export const save = async(req, res)=> {
      const parsedBody = {
        ...req.body,
        facebookUrl:
          req.body.facebookUrl && req.body.facebookUrl !== 'undefined'
            ? req.body.facebookUrl
            : null,
      };


      const userWithUsername = await User.findOne({ username: req.body.email });
      const userWithWorker = await User.findOne({ "workers.email": req.body.email });

      if (req.user.username !== req.body.email && (userWithUsername || userWithWorker)) {
        if(req.file){
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.json({ message: "Este correo ya está registrado como usuario.", status: 401  });
      }
      const { error, value } = saveSchema.validate(parsedBody);
      if (error) {
        return res.json({ message: error.details[0].message, status: 400 });
      }
      const tempUser = await User.findById(req.user._id)
      if(req.file){
        if(tempUser.logo){
          await cloudinary.uploader.destroy(tempUser.logo.public_id);
        }
        value.logo = {url: req.file.path, public_id: req.file.filename}
      }
      const userData = value
      const user = await User.findByIdAndUpdate(req.user._id, {...userData, username: userData.email});
      if(user){
        res.json({message: "Se guardo exitosamente", status: 200})
      } else {
        res.json({message: "Usuario no se encontro", status: 400})
      }
  }

  export const recoverPass = async (req, res) => {
    const { email } = req.body;
    const user = await User.findByUsername(email)
    if (!user) return res.json({ message: 'Email not found', status: 404 });
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 1000 * 60 * 15;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();
    await transporter.sendMail({
      to: email,
      subject: 'Restablecimiento de Contraseña',
      html: `<p>Haz clic <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">aquí</a> para restablecer tu contraseña. Este enlace expirará en 15 minutos.</p>`
    });
    res.json({message: 'token generated', status: 200})
  }

  export const verifyPassToken = async (req, res) => {
    const token = req.query.token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })
    if(!user) return res.json({message: "token is invalid", status: 404})
    res.json({message: 'token verified', status: 200})
  }

  export const changeRecoverPass = async (req, res) => {
    const { password, token} = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })
    if(!user) return res.json({message: "token is invalid", status: 404})
      await new Promise((resolve, reject) => {
        user.setPassword(password, async (err) => {
          if (err) return reject(err);
  
          try {
            await user.save();
            resolve();
          } catch (saveErr) {
            reject(saveErr);
          }
        });
      });
  
      req.login(user, async (err) => {
        if (err) return res.status(500).json({ error: 'login failed after password changed.' });
        const clientUser = await setUserForClient(req, user)
        res.json({
          message: "password changed",
          status: 200,
          user: clientUser,
        })
      });
  }

  export const checkPass = async (req, res) => {
    let password = req.body.password; 
    if(!password) password = '';
    const user = await User.findByUsername(req.user.username);
    if (!user) {
      return res.json({ error: 'User not found', status: 400 });
    }
    const isValid = await new Promise((resolve) => {
      user.authenticate(password, (err, thisUser, passwordErr) => {
        if (err || passwordErr) return resolve(false);
        return resolve(true);
      });
    });
    if (isValid) {
      res.json({ message: "Password is correct", status: 200 });
    } else {
      res.json({ message: "Password is incorrect", status: 400 });
    }
  };

  export const changePass = async (req, res) => {
    let { password, password_new } = req.body; 
    if(!password) password = '';
    if(!password_new) password_new = '';
    const user = await User.findByUsername(req.user.username)
    if (!user) {
      return res.json({ error: 'User not found', status: 400 });
    }
    user.changePassword(password, password_new, function(err) {
      if (err) {
        return res.json({ error: err, status: 400 });
      } else {
        return res.json({ error: 'password changed', status: 200 });
      }
    });
  };
  
  export const findUser = async (req, res) => {
      const user = await User.findById(req.user._id)
      if(!user) return res.json({ message: 'User not found', status: 401 });
      const clientUser = await setUserForClient(req, user)
      return res.json(clientUser);
 
  }




  export const addWorker = async (req, res) => {
    const {email, password} = req.body
    const {error, value} = workerSchema.validate({email})
    if(error){
      throw new AppError(error);
    }
    if(!password) password = '';
    const user = await User.findByUsername(req.user.username);
    if (!user) {
      return res.json({ error: 'User not found', status: 400 });
    }
    const userWithUsername = await User.findOne({ username: value.email });
    if (userWithUsername) {
      return res.json({ message: "Este correo ya está registrado como usuario.", status: 401  });
    }

    const userWithWorker = await User.findOne({ "workers.email": value.email });
    if (userWithWorker) {
      return res.json({ message: "Este correo ya pertenece a otro trabajador." , status: 401 });
    }
    const isValid = await new Promise((resolve) => {
      user.authenticate(password, (err, thisUser, passwordErr) => {
        if (err || passwordErr) return resolve(false);
        return resolve(true);
      });
    });
    if(isValid){
      if(!req.user?.planId){
        return res.json({message: `Para crear trabajadores, primero debes contar con una suscripción activa.`, status: 808})
      }
      const allowedWorkers = plans[req.user?.planId]?.workers;
      if(req.user?.workers?.length >= allowedWorkers){
        return res.json({message: `Tu plan actual no te deja hacer mas de (${allowedWorkers}) trabajadores. Actualiza tu plan para poder hacer mas trabajadores.`, status: 808})
      }
      await User.updateOne(
        { _id: req.user._id },
        { $push: { workers: value } }
      );

      res.json({message: "worker added", status: 200})
    } else {
      res.json({message: "password incorrect", status: 400})
    }
  }
  export const removeWorker = async (req, res) => {
    const {error, value} = workerSchema.validate(req.body)
    if(error){
      throw new AppError(error);
    }
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { workers: value } }
    );
    

    res.json({message: "worker removed", status: 200})
  }
  export const addPaymentMethod = async (req, res) => {
    const {error, value} = methodSchema.validate(req.body, {stripUnknown: true})
    if(error){
      throw new AppError(error);
    }
    const user = await User.findById(req.user._id);

    user.payment_methods.push(value);

    await user.save();

    const clientUser = await setUserForClient(req, user)
    const newMethodId = user.payment_methods[user.payment_methods.length - 1]._id;



    res.json({message: "method added", status: 200, id: newMethodId, user: clientUser})
  }


  export const removePaymentMethod = async (req, res) => {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { payment_methods: { _id: req.body.id } } }
    );
    
    const user = await User.findById(req.user._id)

    const clientUser = await setUserForClient(req, user)
    res.json({message: "method removed", status: 200, user: clientUser})
  }
  // import { customAlphabet } from "nanoid";
  // const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8); // only digits
  
  // async function assignShortIdsToRaffles() {
  //   const raffles = await Raffle.find({ shortId: { $exists: false } }); // Only those without one
  //   console.log(raffles)
  //   for (const raffle of raffles) {
  //     raffle.shortId = nanoid();
  //     await raffle.save(); // Will respect schema validations
  //   }
  
  //   console.log(`Updated ${raffles.length} raffles with shortId`);
  // }
  
  // assignShortIdsToRaffles();