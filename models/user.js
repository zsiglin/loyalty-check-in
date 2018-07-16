const Model = require('./index');

class UserModel extends Model{
    constructor(){
        super();
    }

    static get table(){
        return this.db('users');
    }
};

module.exports = UserModel;