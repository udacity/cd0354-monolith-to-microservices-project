import {Sequelize} from 'sequelize-typescript';
import {config} from './config/config';


export const sequelize = new Sequelize({
  'username': config.username,
  'password': config.password,
  'database': config.database,
  'host': config.host,

  'dialect': config.dialect,
  'storage': ':memory:',
  'pool': {
    'max': 15,
    'min': 5,
    'idle': 20000,
    'evict': 15000,
    'acquire': 30000
  },
});
