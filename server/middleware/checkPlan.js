import { User } from "../models/Users.js"
import plans from "../seed/plans.js"
const checkPlan = async (req, res, next) => {
        
    const user = await User.findById(req.user._id)
        
    const perm = plans[user?.planId]
    if(!perm) {
        req.session.redirectAfterPayment = {
            url: req.originalUrl,
            frontUrl: "/raffle-admin/create",
            method: req.method,
        };
        return res.json({message: "Plan not valid", status: 808})
    } else {
        return next();
    }

}


export default checkPlan