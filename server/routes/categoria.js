const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/categoria');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

const app = express();

// ============================
// Mostrar todas las categoria
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email') //Para pedir que carge el usuario con esos campos
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            })
        });
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'Categoria no encontrada'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ============================
// Actualiza una categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'Categoria no encontrada'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// ============================
// Elimina una categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: 'Categoria no encontrada'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    });
});



module.exports = app;