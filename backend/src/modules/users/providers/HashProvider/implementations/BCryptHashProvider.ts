import { compare, hash } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  // eslint-disable-next-line require-await
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  // eslint-disable-next-line require-await
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
