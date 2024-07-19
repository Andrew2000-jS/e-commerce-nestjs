import * as bcrypt from 'bcrypt';

export const hash = (data: string): string => {
  const saltRounds = 10;
  return bcrypt.hashSync(data, saltRounds);
};

export const compare = (data: string, encrypted: string): boolean => {
  return bcrypt.compareSync(data, encrypted);
};
