
import { DynamicModule, Module, Global } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { CONFIG_OPTIONS } from './mongo.constants';
import { MongoModuleOptions } from './interface'


@Global()
@Module({})
export class MongoModule {
  static register(options: MongoModuleOptions): DynamicModule {
    return {
      module: MongoModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MongoService,
      ],
      exports: [MongoService],
    };
  }
}
