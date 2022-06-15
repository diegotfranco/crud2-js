const express = require('express');
const exphbs = require('express-handlebars');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

//config parsing middleware
app.use(express.urlencoded({extended: false}));

// tipo de parse json
app.use(express.json());

//arq estaticos
app.use(express.static('public'));
app.use('/css', express.static(__dirname +'public/css'));
app.use('/js', express.static(__dirname +'public/js'));

//motor de templates
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

//rotas para a tabela ocorrencia
const rOcorrencia = require('./server/routes/ocorrencia');
app.use('/', rOcorrencia);


app.listen(port, () => console.log(`Servidor escutando a porta http://localhost:${port}`));
