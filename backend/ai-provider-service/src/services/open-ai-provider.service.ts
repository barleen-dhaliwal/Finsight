import {BindingScope, injectable, Provider} from '@loopback/core';
import OpenAI from 'openai';

@injectable({scope: BindingScope.SINGLETON})
export class OpenAIProvider implements Provider<OpenAI> {
  value(): OpenAI {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
