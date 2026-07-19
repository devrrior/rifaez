import express from 'express';
import { createRaffle, viewUpdateRaffle, findRaffle, deleteRaffle, editFindRaffle, editRaffle, paymentRaffle, updateTicket, updateTicketsById, deleteTicket, viewNotification, verifyRaffle } from '../controllers/raffleController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/upload.js';
import hasPermission from '../middleware/hasPermission.js';
import checkPlan from '../middleware/checkPlan.js';
import customDomain from '../middleware/customDomain.js';
import ownedCustomDomain from '../middleware/ownedCustomDomain.js';
import catchAsync from '../utils/catchAsync.js';
import rafflePlan from '../middleware/rafflePlan.js';

const router = express.Router();



// POST /api/raffle
router.post('/create', customDomain, isAuthenticated, catchAsync(checkPlan), upload.array('images', 10), catchAsync(rafflePlan("create")), catchAsync(createRaffle));
router.post('/delete/:id', customDomain, isAuthenticated, hasPermission, catchAsync(deleteRaffle));
router.post('/edit/:id', customDomain, isAuthenticated, hasPermission, upload.array('images', 10), catchAsync(rafflePlan("edit")), catchAsync(editRaffle));
router.post('/:id/:ticketNumber/update_ticket', customDomain, isAuthenticated, hasPermission, catchAsync(updateTicket));
router.post('/:id/:ticketId/update_tickets', customDomain, isAuthenticated, hasPermission, catchAsync(updateTicketsById));
router.post('/:id/:notificationid/view_notify', customDomain, isAuthenticated, hasPermission, catchAsync(viewNotification));
router.delete('/:id/:ticketNumber', customDomain, isAuthenticated, hasPermission, catchAsync(deleteTicket));

// router.post('/:id/contact', catchAsync(contactRaffle));
router.post('/:id/payment', ownedCustomDomain, catchAsync(paymentRaffle));
router.post('/:id/view', ownedCustomDomain, catchAsync(viewUpdateRaffle));
router.post('/:id/verify', ownedCustomDomain, catchAsync(verifyRaffle));


// GET /api/raffle/:id


router.get('/edit/:id', customDomain, isAuthenticated, hasPermission, catchAsync(editFindRaffle));
router.get('/:id', ownedCustomDomain, catchAsync(findRaffle));

export default router;
