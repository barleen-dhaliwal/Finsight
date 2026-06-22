import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';

import {GenerateInsightsRequest, Insight, InsightGeneration} from '../models';
import {InsightRepository} from '../repositories';
import {InsightService} from '../services';

@authenticate('jwt')
export class InsightController {
  constructor(
    @repository(InsightRepository)
    private insightRepository: InsightRepository,
    @inject(SecurityBindings.USER)
    private currentUser: UserProfile,
    @service(InsightService)
    private insightService: InsightService,
  ) {}

  @get('/insights')
  @response(200, {
    description: 'Array of Insight model instances for the current user',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Insight),
        },
      },
    },
  })
  async find(): Promise<Insight[]> {
    const userId = this.currentUser[securityId];

    return this.insightRepository.find({
      where: {
        userId,
      },
      order: ['createdAt DESC'],
    });
  }

  @post('/insights/generate')
  async generate(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GenerateInsightsRequest),
        },
      },
    })
    request: GenerateInsightsRequest,
  ): Promise<InsightGeneration> {
    const userId = this.currentUser[securityId];
    const now = new Date();
    const year = request.year ?? now.getFullYear();
    const month = request.month ?? now.getMonth() + 1;
    return this.insightService.generateInsights(userId, year, month);
  }
}
