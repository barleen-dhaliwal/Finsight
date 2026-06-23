import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AIBindings, KafkaBindings} from './keys';
import {KafkaProvider, OpenAIProvider} from './services';
import {KafkaConsumerObserver} from './observers/kafka-consumer.observer';

export {ApplicationConfig};

export class AiProviderServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Kafka Bindings
    this.bind(KafkaBindings.CLIENT)
      .toProvider(KafkaProvider)
      .inScope(BindingScope.SINGLETON);
    this.lifeCycleObserver(KafkaConsumerObserver);

    // OpenAI Bindings
    this.bind(AIBindings.OPENAI_CLIENT)
      .toProvider(OpenAIProvider)
      .inScope(BindingScope.SINGLETON);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
