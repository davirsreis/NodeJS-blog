const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorie')
const Categorie = mongoose.model('categories')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req,res) => {
    res.send('Página de posts')
})

router.get('/categories', (req,res) => {
    res.render('admin/categories')
})

router.get('/categories/add', (req,res) => {
    res.render('admin/addcategories')
})

router.post('/categories/new', (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
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
            slug: req.body.slug
        }
    
        new Categorie(newCategorie).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categories')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao cadastrar a categoria, tente novamente.')
            res.redirect('/admin')
        })
    }
})

module.exports = router