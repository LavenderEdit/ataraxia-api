import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'studiostkoh_ataraxia',

    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],

    synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;