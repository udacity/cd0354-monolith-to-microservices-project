import {Sequelize} from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import {config} from './config/config';


export const sequelize = new Sequelize({
  'username': config.username,
  'password': config.password,
  'database': config.database,
  'host': config.host,

  'dialect': config.dialect as Dialect,
  'storage': ':memory:',
});
