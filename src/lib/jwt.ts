import jwt from 'jsonwebtoken';

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.NEXT_PUBLIC_JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};