import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 requests per windowMs
    message: "Trop de tentatives de connexion à partir de cette adresse IP, veuillez réessayer après 5 minutes !"
});

export default loginLimiter;