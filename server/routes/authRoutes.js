import { register, deleteUser, login, facebookLogin, recoverPass, verifyPassToken, changeRecoverPass, linkAccount, logout, save, checkPass, changePass, findUser, addWorker, removeWorker, addPaymentMethod, removePaymentMethod} from '../controllers/authController.js'
import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import passport from 'passport';
import crypto from "crypto";
import upload from '../middleware/upload.js';
import isWorker from '../middleware/isWorker.js';
import catchAsync from '../utils/catchAsync.js';
import customDomain from '../middleware/customDomain.js';
const router = express.Router();


router.use(customDomain)

router.post('/register', catchAsync(register));
router.post('/delete_user', catchAsync(deleteUser));
router.post('/link-account', catchAsync(linkAccount));
router.post('/generate-password-token', catchAsync(recoverPass));
router.get('/verify-token', catchAsync(verifyPassToken));
router.post('/reset-password', catchAsync(changeRecoverPass));
router.post('/save_settings', isAuthenticated, isWorker, upload.single("logo"), catchAsync(save))
router.post('/check_password', isAuthenticated, isWorker, catchAsync(checkPass))
router.post('/save_settings/add_worker', isAuthenticated, isWorker, catchAsync(addWorker))
router.post('/save_settings/remove_worker', isAuthenticated, isWorker, catchAsync(removeWorker))
router.post('/save_settings/add_method', isAuthenticated, isWorker, catchAsync(addPaymentMethod))
router.post('/save_settings/remove_method', isAuthenticated, isWorker, catchAsync(removePaymentMethod))
router.post('/change_password', isAuthenticated, isWorker, catchAsync(changePass))
// app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// app.get('/google/callback', passport.authenticate('google', { 
//   failureRedirect: '/login' 
// }), (req, res) => {
//   res.redirect('/dashboard');
// });

// Facebook
router.post('/facebook/callback', catchAsync(facebookLogin));
router.post('/facebook/deletion', (req, res) => {
    // const signedRequest = req.body.signed_request;
    // const data = parseSignedRequest(signedRequest);
  
    // if (!data || !data.user_id) {
    //   return res.status(400).json({ error: 'Invalid signed request' });
    // }
  
    // Generate confirmation code and status URL
    const confirmationCode = 'abc123'; // Should be unique per request
    const statusUrl = `${process.env.CURRENT_DOMAIN}.com/deletion?id=${confirmationCode}`;
  
    res.json({
      url: statusUrl,
      confirmation_code: confirmationCode
    });
  });
  



router.post('/login', login);
router.post('/logout', logout);
router.get('/user', isAuthenticated, catchAsync(findUser));

export default router
