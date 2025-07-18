const jwt = require("jsonwebtoken");

// Kullan�c�n�n token'�n� do�rulayan middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // "Bearer token" yap�s�ndan sadece token k�sm�n� al
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Eri�im reddedildi. Token bulunamad�." });
    }

    // Token do�rulama
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            console.error("JWT do�rulama hatas�:", err.message); // Hata log'u i�in eklendi
            return res.status(403).json({ message: "Ge�ersiz veya s�resi dolmu� token." });
        }

        req.user = decodedUser; // decodedUser = { id: ..., isAdmin: ... }
        next();
    });
};

// Admin yetkisi olan kullan�c�lar i�in eri�im kontrol�
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.isAdmin !== true) {
        return res.status(403).json({ message: "Bu i�lemi yapmak i�in y�netici (admin) olmal�s�n�z." });
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeAdmin
};