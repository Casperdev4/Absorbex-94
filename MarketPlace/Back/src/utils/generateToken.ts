import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn });
};
