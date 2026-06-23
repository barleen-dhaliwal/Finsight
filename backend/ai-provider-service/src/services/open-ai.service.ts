import {BindingScope, inject, injectable} from '@loopback/core';
import OpenAI from 'openai';
import {AIBindings} from '../keys';

import {InsightSeverity, InsightType} from '../enums';
import {
  GeneratedInsightDto,
  GeneratedInsightsDto,
  GenerateInsightsDto,
} from '../models';

const INSIGHTS_SYSTEM_PROMPT = `
You are a personal finance analyst.

Generate concise personal finance insights from monthly analytics data.
Return only insights that are useful to the user.
Do not mention missing data unless it affects the analysis.

Generate between 1 and 5 insights.

Insight type enum values:
${InsightType.SpendingTrend} = SpendingTrend
${InsightType.CategoryAlert} = CategoryAlert
${InsightType.SavingOpportunity} = SavingOpportunity
${InsightType.GeneralSummary} = GeneralSummary

Insight severity enum values:
${InsightSeverity.Low} = Low
${InsightSeverity.Medium} = Medium
${InsightSeverity.High} = High
`;

const generatedInsightsSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    insights: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: {
            type: 'string',
          },
          content: {
            type: 'string',
          },
          type: {
            type: 'number',
            enum: Object.values(InsightType).filter(
              value => typeof value === 'number',
            ),
          },
          severity: {
            type: 'number',
            enum: Object.values(InsightSeverity).filter(
              value => typeof value === 'number',
            ),
          },
        },
        required: ['title', 'content', 'type', 'severity'],
      },
    },
  },
  required: ['insights'],
};

@injectable({scope: BindingScope.SINGLETON})
export class OpenAIService {
  constructor(
    @inject(AIBindings.OPENAI_CLIENT)
    private openai: OpenAI,
  ) {}
  async generateInsights(
    payload: GenerateInsightsDto,
  ): Promise<GeneratedInsightsDto> {
    const response = await this.openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: INSIGHTS_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: JSON.stringify({
            currentMonth: payload.currentMonth,
            previousMonths: payload.previousMonths,
          }),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'generated_insights',
          schema: generatedInsightsSchema,
          strict: true,
        },
      },
    });
    const parsed = JSON.parse(response.output_text) as {
      insights: GeneratedInsightDto[];
    };
    return {
      requestId: payload.requestId,
      userId: payload.userId,
      year: payload.currentMonth.year,
      month: payload.currentMonth.month,
      insights: parsed.insights,
    } as GeneratedInsightsDto;
  }
}
