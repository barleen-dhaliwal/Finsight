import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Insight, InsightRelations} from '../models';

export class InsightRepository extends DefaultCrudRepository<
  Insight,
  typeof Insight.prototype.id,
  InsightRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Insight, dataSource);
  }
}
