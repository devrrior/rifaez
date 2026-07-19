import { User } from '../models/Users.js';
export default async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findById(req.user._id) 
        const raffle = user.raffles.find(r => r.toString() === id);
        if(!raffle){
            return res.status(401).json({message: "Unauthorized"})
        }
        next();
    } catch (error) {
        next(error)
    }
}