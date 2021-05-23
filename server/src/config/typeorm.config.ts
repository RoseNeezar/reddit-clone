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
  host: 'localhost',
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: 'leddit',
};

export = typeOrmConfig;
