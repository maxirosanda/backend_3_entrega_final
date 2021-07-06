var mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'})
const loggerInfo = require('pino')()
const loggerError = require('pino')('./logs/error.log')

const conectarDB = async () => {
    try{
      
        let URL ='mongodb+srv://maxirosanda:dalma123@cluster0.cawk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
        
        await mongoose.connect(URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false,
            useCreateIndex:true
        })
        loggerInfo.info('base de datos conectada')
        
    }
    catch(e) {
            loggerError.error(`error ${e}`)
            process.exit(1)
    }
}
module.exports = conectarDB