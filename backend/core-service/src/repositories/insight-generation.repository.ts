import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {InsightGeneration, InsightGenerationRelations} from '../models';

export class InsightGenerationRepository extends DefaultCrudRepository<
  InsightGeneration,
  typeof InsightGeneration.prototype.id,
  InsightGenerationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(InsightGeneration, dataSource);
  }
}
