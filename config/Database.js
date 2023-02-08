import { Sequelize } from 'sequelize';

const db = new Sequelize('hindiatimur', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default db;
