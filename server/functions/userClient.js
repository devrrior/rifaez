import sanitizeUser from '../utils/sanitize.js';
import customDomain from '../models/CustomDomain.js';
import plans from '../seed/plans.js';

export default async function setUserForClient(req, user){
    const popUser = await user.populate('raffles')
    const safeUser = sanitizeUser(popUser)
    const domain = await customDomain.findOne({userId: user._id, status: { $in: ['verified', 'unverified'] }})
    return {...safeUser, currentPlan: plans[user.planId]?.name, planStatus: user.subscriptionStatus, verified: user.verified, asWorker: req.user.asWorker, domain: domain || false}
  }