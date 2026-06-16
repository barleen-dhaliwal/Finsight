import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

import {Transaction} from '../models';
import {TransactionRepository} from '../repositories';

@authenticate('jwt')
export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    private transactionRepository: TransactionRepository,

    @inject(SecurityBindings.USER)
    private currentUser: UserProfile,
  ) {}

  private get currentUserId(): string {
    return this.currentUser[securityId];
  }

  @post('/transactions')
  @response(200, {
    description: 'Transaction model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransaction',
            exclude: ['id', 'userId', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction> {
    return this.transactionRepository.create({
      ...transaction,
      userId: this.currentUserId,
      createdAt: new Date(),
    });
  }

  @get('/transactions/count')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.transactionRepository.count({
      userId: this.currentUserId,
    });
  }

  @get('/transactions')
  @response(200, {
    description: 'Array of Transaction model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transaction, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Transaction) filter?: Filter<Transaction>,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      ...filter,
      where: {
        ...(filter?.where ?? {}),
        userId: this.currentUserId,
      },
    });
  }

  @get('/transactions/{id}')
  @response(200, {
    description: 'Transaction model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Transaction, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Transaction, {exclude: 'where'})
    filter?: FilterExcludingWhere<Transaction>,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
        userId: this.currentUserId,
      },
      ...filter,
    });

    if (!transaction) {
      throw new HttpErrors.NotFound('Transaction not found');
    }

    return transaction;
  }

  @patch('/transactions/{id}')
  @response(204, {
    description: 'Transaction PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            partial: true,
            exclude: ['id', 'userId', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    transaction: Partial<Transaction>,
  ): Promise<void> {
    const result = await this.transactionRepository.updateAll(
      {
        ...transaction,
        updatedAt: new Date(),
      },
      {
        id,
        userId: this.currentUserId,
      },
    );

    if (result.count === 0) {
      throw new HttpErrors.NotFound('Transaction not found');
    }
  }

  @del('/transactions/{id}')
  @response(204, {
    description: 'Transaction DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const result = await this.transactionRepository.deleteAll({
      id,
      userId: this.currentUserId,
    });

    if (result.count === 0) {
      throw new HttpErrors.NotFound('Transaction not found');
    }
  }
}
