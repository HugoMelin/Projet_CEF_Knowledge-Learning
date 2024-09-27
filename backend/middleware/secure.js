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
        return res.status(401).json('token_not_valid');
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
    return res.status(401).json('token_required');
  }
};
