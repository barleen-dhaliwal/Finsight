import {Model, model, property} from '@loopback/repository';

@model()
export class GenerateInsightsRequest extends Model {
  @property({
    type: 'number',
    minimum: 2000,
  })
  year?: number;

  @property({
    type: 'number',
    minimum: 1,
    maximum: 12,
  })
  month?: number;
}
