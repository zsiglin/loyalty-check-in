const apiKey = '';
const domain = 'zachsigl.in';
const mailgun = require('mailgun-js')({ apiKey, domain });

class EmailService{
    constructor({ recipient, newPointsEarned, totalPoints }){
        this.from = 'Loyalty Check-In <loyalty@zachsigl.in>';
        this.recipient = recipient;
        this.newPointsEarned = newPointsEarned;
        this.totalPoints = totalPoints;
    }

    sendPointTotal(){
        const message = {
            from: this.from,
            to: this.recipient,
            subject: `You earned ${this.newPointsEarned} points by checking-in!`,
            text: `Congratulations. You now have a total of ${this.totalPoints} points!`   
        };

        return mailgun.messages().send(message);
    }
};

module.exports = EmailService;


