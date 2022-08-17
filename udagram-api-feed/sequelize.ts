import {Sequelize} from 'sequelize-typescript';
import {config} from './src/config/config';

console.log("config", config)
export const sequelize = new Sequelize({
  'username': config.username,
  'password': config.password,
  'database': config.database,
  'host': config.host,

  'dialect': config.dialect,
  'storage': ':memory:',
});
