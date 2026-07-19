import isAuthenticated from '../middleware/isAuthenticated.js';
import express from 'express';
import { createDomain, verifyCname, deleteDomain } from '../controllers/domainController.js';
import catchAsync from '../utils/catchAsync.js';
import customDomain from '../middleware/customDomain.js';
const router = express.Router();

router.use(isAuthenticated)

router.use(customDomain)

router.post('/', catchAsync(createDomain));

router.post('/verify/cname', catchAsync(verifyCname));

router.post('/disconnect', catchAsync(deleteDomain));

  

  export default router