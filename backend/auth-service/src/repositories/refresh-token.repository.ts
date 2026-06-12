import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {RefreshToken, RefreshTokenRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class RefreshTokenRepository extends DefaultCrudRepository<
  RefreshToken,
  typeof RefreshToken.prototype.id,
  RefreshTokenRelations
> {

  public readonly user: BelongsToAccessor<User, typeof RefreshToken.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(RefreshToken, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
