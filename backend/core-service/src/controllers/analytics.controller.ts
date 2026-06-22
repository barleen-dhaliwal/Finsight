import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';

import {AnalyticsSummary} from '../models';
import {AnalyticsService} from '../services';

@authenticate('jwt')
export class AnalyticsController {
  constructor(
    @service(AnalyticsService)
    private analyticsService: AnalyticsService,

    @inject(SecurityBindings.USER)
    private currentUser: UserProfile,
  ) {}

  @get('/analytics/summary')
  @response(200, {
    description: 'Monthly income and expense summary',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AnalyticsSummary),
      },
    },
  })
  async getSummary(
    @param.query.number('year') year?: number,
    @param.query.number('month') month?: number,
  ): Promise<AnalyticsSummary> {
    const userId = this.currentUser[securityId];

    const now = new Date();
    const selectedYear = year ?? now.getFullYear();
    const selectedMonth = month ?? now.getMonth() + 1;

    return this.analyticsService.getMonthlySummary(
      userId,
      selectedYear,
      selectedMonth,
    );
  }
}
