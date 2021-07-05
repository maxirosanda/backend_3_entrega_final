var mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'})

const conectarDB = async (elegirbase) => {
    try{
      
        let URL ='mongodb+srv://maxirosanda:dalma123@cluster0.cawk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
        
        await mongoose.connect(URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false,
            useCreateIndex:true
        })
        console.log('base de datos conectada')
        
    }
    catch(e) {
            console.log(`error ${e}`)
            process.exit(1)
    }
}
module.exports = conectarDB