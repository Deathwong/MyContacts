import jwt from "jsonwebtoken";

export function auth(req, res, next){
    const jwtToken = req.get("Authorization")?.split(" ")[1];
    if (!jwtToken) {
        return res.status(401).json({ message: "Non autorisé car jwtToken est Vide"})
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, function(err, decoded){

        if (err) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        // Get the Email
        req.userEmail = decoded.email;
        req.user = decoded;

        next();
    })
}