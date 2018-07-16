const db = require('../db');

class Model{
    static get db(){
        return db;
    }

    async save(properties){
        const [id] = await this.constructor.table.insert(properties);
        return id;
    }

    static async find(criteria){
        const [row] = await this.table.select('*').where(criteria);
        return row;
    }
};

module.exports = Model;