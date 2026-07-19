import CustomDomain from "../models/CustomDomain.js";
import { User } from "../models/Users.js";
import Raffle from "../models/Raffle.js";
export default async (req, res, next) => {
    if (req.tenant) {
        try {
            const { id } = req.params
            const raffle = await Raffle.findOne({ shortId: id })
            const user = await User.findOne({
                raffles: raffle._id,
            });
            const domain = await CustomDomain.findOne({userId: user._id})
            console.log(domain.domain, req.tenant.domain)
            if(domain.domain === req.tenant.domain){
                next()
            } else {
                return res.status(404).json('Forbidden Access');
            }
        } catch (error) {
            return res.status(404).json(error);
        }
    } else {
        next();
    }
  
}