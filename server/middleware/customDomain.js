
export default async (req, res, next) => {
    if (req.tenant) {
      return res.status(404).json('Forbidden Access');
    }
  
    next();
}