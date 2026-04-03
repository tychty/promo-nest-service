import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(@Inject('DB_CONNECTION') private readonly db: NodePgDatabase) {}

  async getDbVersion(): Promise<{ message: string; version: string }> {
    try {
      const result = await this.db.execute(sql`SELECT version()`);
      const version = (result.rows[0]?.version as string) || 'No version found';
      return {
        message: 'Connection successful!',
        version,
      };
    } catch (error) {
      this.logger.error(
        'Database query failed',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException(
        'Failed to connect to the database.',
      );
    }
  }
}
