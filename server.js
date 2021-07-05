
const express = require('express');  
const cors = require('cors')
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require('express-session')
const path = require('path');
const app = express();
const http = require('http'); 
const server = http.createServer(app); 
const MongoStore =require('connect-mongo')
const morgan =require('morgan')
const methodOverride=require('method-override')
const handlebars = require("express-handlebars");
const cluster = require("cluster");
const fileUpload = require('express-fileupload')

const ecommerceRoutes = require('./routes/ecommerceRoutes'); 
const conectarDB = require('./config/db')
require("./passport/passport");
app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
     // dir for windows PC
      tempFileDir: path.join(__dirname, './tmp'),
    }),
  );
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.engine("hbs", handlebars({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    partialsDir: path.join(__dirname, "/views/partials"),
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const advancedOptions= {useNewUrlParser:true,useUnifiedTopology:true}
app.use(session({
    secret:'secreto',
    resave:false,
    saveUninitialized:false,
    
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://maxirosanda:dalma123@cluster0.cawk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        mongoOptions:advancedOptions,
        collectionName:'sessions',
        ttl:10*60
    })
}))
app.use(passport.initialize());
app.use(passport.session());



app.disable('x-powered-by');
ecommerceRoutes(app);
conectarDB()


const numCpu = require("os").cpus().length;
if(cluster.isMaster && process.argv[3]=="CLUSTER") {
    console.log(numCpu);
    console.log(`process ID: ${process.pid} `);


    for (let i = 0; i < numCpu; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        console.log(`Worker, ${worker.process.pid} died ${new Date()}`);
        cluster.fork();
    });
} else {
    const port = process.env.PORT || '8080';
    app.set('port', port);
    server.listen(port);
    console.log('Server listening on port ' + port +' pid:' + process.pid);
}
