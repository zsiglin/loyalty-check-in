const Model = require('./index');

class CheckInModel extends Model{
    constructor(){
        super();
    }

    static async canCheckIn(userId){
        const [result] = await this.table
            .count('id')
            .where({ userId })
            .andWhereRaw("createdAt >= Datetime('now', '-5 minutes')")

        return result['count(`id`)'] === 0;
    }

    static async getUserCheckInData(userId){
        const [result] = await this.table
            .count('id')
            .sum('points')
            .where({ userId })

        return {
            totalPoints: result['sum(`points`)'] || 0,
            totalCheckIns: result['count(`id`)'] || 0
        };
    }

    static get table(){
        return this.db('checkins');
    }
};

module.exports = CheckInModel;