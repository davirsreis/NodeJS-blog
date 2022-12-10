const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorie')
const Categorie = mongoose.model('categories')
require('../models/Posts')
const Post = mongoose.model('posts')
const {eAdmin} = require('../helpers/eAdmin')

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/categories', eAdmin, (req,res) => {
    Categorie.find().sort({date2:'desc'}).then((categories) => {
        res.render('admin/categories', {categories: categories})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categories/add', eAdmin, (req,res) => {
    res.render('admin/addcategories')
})

router.post('/categories/new', eAdmin, (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        erros.push({text: "Descrição inválida"})
    }

    if(req.body.nome.length < 2){
        erros.push({text: "O nome da categoria é pequeno demais"})
    }

    if(req.body.slug.length > 30){
        erros.push({text: "O slug da categoria é grande demais"})
    }

    if(erros.length > 0){
        res.render('admin/addcategories', {erros: erros})
    }else {
        const newCategorie = {
            nome: req.body.nome,
            slug: req.body.slug,
            description: req.body.description,
            date: todayDate()
        }
        new Categorie(newCategorie).save().then(() => {
            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);
            req.flash('success_msg', 'Categoria criada com sucesso!')
            console.log();
            res.redirect('/admin/categories')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao cadastrar a categoria, tente novamente.'+ err)
            res.redirect('/admin')
        })
    }
})

router.get("/categories/edit/:id", eAdmin, (req,res) => {
    Categorie.findOne({_id:req.params.id}).then((categorie) => {
        res.render('admin/editcategories', {categorie: categorie})
    }).catch((err) => {
        req.flash('error_msg','Esta categoria não existe')
        res.redirect('/admin/categories')
    })
    
})

router.post('/categories/edit', eAdmin, (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        erros.push({text: "Descrição inválida"})
    }

    if(req.body.nome.length < 2){
        erros.push({text: "O nome da categoria é pequeno demais"})
    }

    if(req.body.slug.length > 30){
        erros.push({text: "O slug da categoria é grande demais"})
    }

    if(erros.length > 0){
        Categorie.findOne({_id:req.body.id}).then((categorie) => {
            res.render('admin/editcategories', {categorie: categorie, erros: erros})
        }).catch((err) => {
            req.flash('error_msg','Esta categoria não existe')
            res.redirect('/admin/categories')
        })
    }else {
        Categorie.findOne({_id: req.body.id}).then((categorie) => {
            categorie.nome = req.body.nome
            categorie.slug = req.body.slug
            categorie.description = req.body.description
            categorie.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso')
                res.redirect('/admin/categories')
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao editar categoria')
                res.redirect('/admin/categories')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar a categoria')
            res.redirect('/admin/categories')
        })
    }
})

// router.post('/categories/delete', eAdmin, (req,res) => {
//     Categorie.remove({_id: req.body.id}).then(() => {
//         req.flash('success_msg', 'Categoria deletada com sucesso!')
//         res.redirect('/admin/categories')
//     }).catch((err) => {
//         req.flash('error_msg', 'Houve um erro ao deletar a categoria')
//         res.redirect('/admin/categories')
//     })
// })

router.get('/categories/delete/:id', eAdmin, (req,res) => {
    Categorie.remove({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categories')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/admin/categories')
    })
})

router.get('/posts', eAdmin, (req,res) => {
    Post.find().populate('categorie').sort({date2:'desc'}).then((posts) => {
        res.render('admin/posts', {posts: posts})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens' + err)
        res.redirect('/admin')
    })
})

router.get('/posts/add', eAdmin, (req,res) => {
    Categorie.find().then((categories) => {
        res.render('admin/addpost', {categories: categories})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário')
            res.redirect('/admin')
    })
    
})

router.post('/posts/new', eAdmin, (req,res) => {

    var erros = []

    if(req.body.categorie == '0'){
        erros.push({text: 'Categoria inválida, registre uma categoria'})
    }

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({text: "Título inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
    }

    if(req.body.titulo.length < 2){
        erros.push({text: "O titulo da postagem é pequeno demais"})
    }

    if(req.body.slug.length > 30){
        erros.push({text: "O slug da categoria é grande demais"})
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        erros.push({text: "Descrição inválida"})
    }

    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
        erros.push({text: "Conteúdo inválido"})
    }

    if(erros.length > 0){
        Categorie.find().then((categories) => {
            res.render('admin/addpost', {categories: categories, erros: erros})
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao carregar o formulário')
                res.redirect('/admin')
        })
    }else {
        const newPost = {
            titulo: req.body.titulo,
            description: req.body.description,
            author: "Beatriz Mateus",
            content: req.body.content,
            categorie: req.body.categorie,
            slug: req.body.slug,
            date: todayDate()
        }
        new Post(newPost).save().then(() => {
            req.flash('success_msg','Publicação criada com sucesso!')
            res.redirect('/admin/posts')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro durante o salvamento da publicação:')
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/edit/:id', eAdmin, (req,res) => {
    Post.findOne({_id: req.params.id}).then((post) => {
        Categorie.find().then((categories) => {
            res.render('admin/editposts', {categories: categories, post: post})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias')
            res.redirect('/admin/posts')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição')
        res.redirect('/admin/posts')
    })
})

router.post('/post/edit', eAdmin, (req,res) => {

    var erros = []

    if(req.body.categorie == '0'){
        erros.push({text: 'Categoria inválida, registre uma categoria'})
    }

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({text: "Título inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
    }

    if(req.body.titulo.length < 2){
        erros.push({text: "O titulo da postagem é pequeno demais"})
    }

    if(req.body.slug.length > 30){
        erros.push({text: "O slug da categoria é grande demais"})
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        erros.push({text: "Descrição inválida"})
    }

    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
        erros.push({text: "Conteúdo inválido"})
    }

    if(erros.length > 0){
        Post.findOne({_id: req.body.id}).then((post) => {
            Categorie.find().then((categories) => {
                res.render('admin/editposts', {post:post, categories: categories, erros: erros})
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao carregar o formulário')
                    res.redirect('/admin')
            })
        })}else {
        Post.findOne({_id: req.body.id}).then((post) => {

            post.titulo = req.body.titulo
            post.slug = req.body.slug
            post.description = req.body.description
            post.author = "Beatriz Mateus",
            post.content = req.body.content
            post.categorie = req.body.categorie
    
            post.save().then(() => {
                req.flash('success_msg','Publicação editada com sucesso!')
                res.redirect('/admin/posts')
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao editar a publicação')
                res.redirect('/admin/posts')
            })
    
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição')
            res.redirect('/admin/posts')
    
        })
    }
})

router.get('/posts/delete/:id', eAdmin, (req,res) => {
    Post.remove({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Publicação deletada com sucesso!')
        res.redirect('/admin/posts')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/admin/posts')
    })
})

function todayDate() {
    const today = new Date(Date.now())
    month = today.getMonth()+1
    day = today.getDate()
    year = today.getFullYear()
    hours = today.getHours()
    minutes = today.getMinutes()
    if(hours >= 3) {
        hours = hours-3
    } else if(hours == 2) {
        hours = 23
        day = day -1
    } else if(hours == 1) {
        hours = 22
        day = day -1
    } else if(hours == 0) {
        hours = 21
        day = day -1
    }
    if(minutes < 10) {
        minutes = ("0"+minutes)
    }
    if(hours < 10) {
        hours = ("0"+hours)
    }
    if(day < 10) {
        day = ("0"+day)
    }
    if(month < 10) {
        month = ("0"+month)
    }
    return dateNow = (day+"/"+month+"/"+year+" - "+hours+":"+minutes)
}

module.exports = router