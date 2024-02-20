import { BaseAuditedEntity } from './base-audited-entity.model';
import { DatabaseNamingConvention, DatabaseProvider } from './database.model';

export interface MixDbContext extends BaseAuditedEntity {
  databaseProvider: DatabaseProvider;
  connectionString: string;
  schema: string;
  namingConvention?: DatabaseNamingConvention;
}

export const DbContextFixId = {
  All: -2,
  MasterDb: -1,
};
