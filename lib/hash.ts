import { hash, compare, genSalt } from 'bcryptjs';

export async function hashPassword(password) {
  const salt = await genSalt(15);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}