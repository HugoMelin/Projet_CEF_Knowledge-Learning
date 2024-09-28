const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

exports.checkJWT = async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization;
  if (!!token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Token invalide');
        return res.status(401).json({ message: 'Token invalide' });
      }
      req.decoded = decoded;

      const expiresIn = 24 * 60 * 60;
      const newToken = jwt.sign(
        {
          user: decoded.user,
        },
        SECRET_KEY,
        {
          expiresIn,
        },
      );

      res.cookie('token', newToken, {
        httpOnly: true,
        maxAge: expiresIn * 1000,
      });

      res.header('Authorization', `Bearer ${newToken}`);
      next();
    });
  } else {
    console.error('Authentification requise');
    return res.status(401).json({ message: 'Authentification requise' });
  }
};

exports.checkAdminRole = async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  if (!token) {
    console.error('Authentification requise');
    return res.status(401).json({ message: 'Authentification requise' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;

    if (!req.user.role.includes('role-admin')) {
      console.error('Accès refusé. Rôle administrateur requis');
      return res.status(403).json({ message: 'Accès refusé. Rôle administrateur requis' });
    }

    // Renouvellement du token
    const expiresIn = 24 * 60 * 60;
    const newToken = jwt.sign(
      { user: req.user },
      SECRET_KEY,
      { expiresIn },
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      maxAge: expiresIn * 1000,
    });

    res.header('Authorization', `Bearer ${newToken}`);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expiré');
      return res.status(401).json({ message: 'Token expiré' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('Token invalide');
      return res.status(401).json({ message: 'Token invalide' });
    }
    console.error('Erreur interne du serveur');
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
