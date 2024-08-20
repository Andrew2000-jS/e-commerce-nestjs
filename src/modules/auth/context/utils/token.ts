import * as jwt from 'jsonwebtoken';

export function generateToken(
  payload: any,
  secretKey: string,
  expiresIn: string,
): string {
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}

export function verifyToken(token: string, secretKey: string): any {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
}
