import knex from "knex";

const db = knex({
    client: "mysql2",
    connection: {
        host: "127.0.0.1",
        port: 3308,
        user: "root",
        password: "root123",
        database: "Railways",
    },
    pool: {
        min: 2,
        max: 10,
    },
});

export default db;