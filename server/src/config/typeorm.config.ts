import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const typeOrmModuleOptions: TypeOrmModuleOptions = {
  synchronize: true,
  logging: false,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/*.js'],
};

const typeOrmConfig: PostgresConnectionOptions = {
  ...typeOrmModuleOptions,
  // @ts-ignore
  seeds: ['dist/seeds/*.js'],
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres_password',
  database: 'postgres',
};

export = typeOrmConfig;
