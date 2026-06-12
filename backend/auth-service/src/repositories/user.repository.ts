import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, RefreshToken} from '../models';
import {RefreshTokenRepository} from './refresh-token.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly refreshTokens: HasManyRepositoryFactory<RefreshToken, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('RefreshTokenRepository') protected refreshTokenRepositoryGetter: Getter<RefreshTokenRepository>,
  ) {
    super(User, dataSource);
    this.refreshTokens = this.createHasManyRepositoryFactoryFor('refreshTokens', refreshTokenRepositoryGetter,);
    this.registerInclusionResolver('refreshTokens', this.refreshTokens.inclusionResolver);
  }
}
