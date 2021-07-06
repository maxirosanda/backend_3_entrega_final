const sId = 'AC9a41f30c56970a3e1a2f00b29c54c757';
const authToken = '7f4b745c97d5eda7ddde753c03c0df77';
const loggerInfo = require('pino')()
const loggerError = require('pino')('./logs/error.log')

const client = require('twilio')(sId, authToken);

const enviarws = (usuario,text) =>{
client.messages.create({
    body: `el usuario: ${usuario} te nombro en el mensaje : ${text}`,
    from: 'whatsapp:+16466811823',
    to: "whatsapp:+541168179706"
}).then( message => {
    loggerInfo.info(message.accountSid);
}).catch( (err) => {
    loggerError.error("error: ", err);
})
}

module.exports = enviarws

