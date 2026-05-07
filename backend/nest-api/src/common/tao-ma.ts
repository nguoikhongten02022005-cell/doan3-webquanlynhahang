import { randomUUID } from 'crypto';

export const taoMa = (prefix: string) => `${prefix}_${randomUUID()}`;