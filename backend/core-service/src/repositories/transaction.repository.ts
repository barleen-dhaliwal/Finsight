import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Category, Transaction, TransactionRelations} from '../models';
import {CategoryRepository} from './category.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {
  public readonly category: BelongsToAccessor<
    Category,
    typeof Transaction.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,

    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Transaction, dataSource);

    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );

    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
