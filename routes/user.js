const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/register', (req,res) => {
    res.render('users/register')
})

router.post('/register', (req,res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: 'Nome inválido'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({text: 'Email inválido'})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        erros.push({text: 'Senha inválido'})
    }
    if(req.body.password.length < 4){
        erros.push({text: 'Senha muito curta'})
    }
    if(req.body.password != req.body.password2){
        erros.push({text: 'Senhas não coincidem'})
    }

    if(erros.length > 0){
        res.render('users/register', {erros: erros})
    }else{
        console.log(erros);
        User.findOne({email: req.body.email}).then((user) => {
            if(user){
                req.flash('error_msg', 'Email já cadastrado')
                res.redirect('/users/register')
            }else {
                const newUser = new User({
                    nome: req.body.nome,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUser.password, salt, (erro, hash) => {
                        if(erro){
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuário')
                            res.redirect('/')
                        }

                        newUser.password = hash
                        newUser.save().then(() => {
                            req.flash('success_msg', 'Usuário criado com sucesso!')
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_msg', 'Houve um erro ao criar o usuário, tente novamente')
                            res.redirect('/users/register')
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/login', (req,res) => {
    res.render('users/login')
})

router.post('/login', (req,res,next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})


router.get('/logout', (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect('/');
    });
});

module.exports = router