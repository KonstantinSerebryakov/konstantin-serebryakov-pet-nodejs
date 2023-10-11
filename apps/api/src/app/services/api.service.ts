import { Injectable } from '@nestjs/common';
import { v4 as getUuidV4 } from 'uuid';

@Injectable()
export class ApiService {
  async generateRequestId(prefix: string): Promise<string> {
    const uuid = getUuidV4();
    return prefix + '-' + uuid;
  }
}
