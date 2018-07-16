module.exports = {
    client: 'sqlite3',

    useNullAsDefault: true,

    connection: {
        filename: './db/loyalty-check-in.sqlite3'
    },

    migrations: {
        directory: './db/migrations'
    }
};