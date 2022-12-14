// Carregando módulos
require("dotenv").config();
const express = require('express')
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Posts')
const Post = mongoose.model('posts')
require('./models/Categorie')
const Categorie = mongoose.model('categories')
require('./models/Saves')
const Save = mongoose.model('saves')
const users = require('./routes/user')
const passport = require('passport');
const { post } = require("./routes/admin");
require('./config/auth')(passport)
//const db = require("./config/db")

// Configurações
if(process.env.NODE_ENV == "production"){
    mongoURI = process.env.accessKey
}else {
    mongoURI = "mongodb://localhost/blogapp"
}

// Variáveis de ambiente


// Sessão
app.use(session({
    secret: 'sessionsecret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Middleware
app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next()
})

// Body Parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Handlebars
app.engine('handlebars', engine({defaultLayout: 'main',
runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
}}))
app.set('view engine', 'handlebars')

// Mongoose
mongoose.connect(mongoURI).then(() => {
    console.log('Conectado com sucesso!');
}).catch((err) => {
    console.log('Não foi possível se conectar! erro: ' + err);
})
// Public 
app.use(express.static(path.join(__dirname,'public')))


// Imagem
// app.use(express.static('public/img'));
// app.get('/static', (req,res) => {
//     res.render('static')
// })

// app.get('/dynamic', (req,res) => {
//     imageList = [];
//     imageList.push({src: 'direito.png', name: 'logo-direito'})
//     res.render('dynamic', {imageList: imageList})
// })

// Rotas
app.get('/', (req,res) => {
    Post.find().populate('categorie').sort({date2: 'desc'}).then((posts) => {
        res.render('index', {posts: posts})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/404')
    })
})

app.get('/post/:slug', (req,res) => {
    Post.findOne({slug: req.params.slug}).then((post) => {
        if(post) {
            res.render('post/index', {post: post})
        }else{
            req.flash('error_msg', 'Essa publicação não existe')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
    })
})

app.get('/categories', (req,res) => {
    Categorie.find().sort({date2:'desc'}).then((categories) => {
        res.render('categories/index', {categories: categories})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/')
    })
})

app.get('/categories/:slug',(req,res) => {
    Categorie.findOne({slug: req.params.slug}).then((categorie) => {
        if(categorie){
            Post.find({categorie: categorie._id}).then((posts) => {
                res.render('categories/posts', {posts: posts, categorie: categorie})
            }).catch((err) => {
                req.flash('error_msg',"Houve um erro ao listar as publicações")
                res.redirect('/')
            })
        }else{
            req.flash('error_msg', 'Essa categoria não existe')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar a página dessa categoria' + err)
        res.redirect('/')
    })
})

// app.get('/saves', (req,res) => {
//     Save.find({save: req.user._id}).sort({date2:'desc'}).then((saves) => {
//         Post.find({post: saves.post}).sort({date2:'desc'}).then((posts) => {
//             res.render('saves/index', {saves: saves, posts: posts})
//         })
//     })
//    .catch((err) => {
//         req.flash('error_msg', 'Houve um erro ao listar as categorias' + err)
//         res.redirect('/')
//     })
// })

app.post('/saves/new/:_id', (req,res) => {
    const newSave = {
        user: req.user._id,
        post: req.params._id
    }
    console.log(newSave);
    new Save(newSave).save().then(() => {
        req.flash('success_msg','Publicação salva com sucesso!')
        res.redirect('/')
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível salvar a publicação' + err)
        res.redirect('/')
    })

})

app.get('/404', (req,res) => {
    res.send('Erro 404!')
})

app.use('/admin', admin)
app.use('/users', users)

// Outros
const PORT =  process.env.PORT || 8080
app.listen(PORT,() => {
    console.log("Servidor rodando!");
})