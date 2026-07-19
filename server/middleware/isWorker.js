export default  (req, res, next) => {
        if(req.user.asWorker){
            return res.status(401).json({message: "Unauthorized"})
        } else {
            next();
        }
}