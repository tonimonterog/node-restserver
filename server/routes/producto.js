const express = require('express');

const { verificaToken } = require('../middlewares/autentication');

let app = express();
let Producto = require('../models/producto')

// ============================
// Mostrar todos los productos
// ============================
app.get('/producto', verificaToken, (req, res) => {
    //trae todos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email') //Para pedir que carge el usuario con esos campos
        .populate('categoria', 'descripcion') //Para pedir que carge la categoria con esos campos
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            })
        });
});

// ============================
// Obtener un producto por ID
// ============================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findOne({ _id: id })
        .populate('usuario', 'nombre email') //Para pedir que carge el usuario con esos campos
        .populate('categoria', 'descripcion') //Para pedir que carge la categoria con esos campos
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: 'Producto no encontrado'
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

// ============================
// Buscar productos
// ============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: 'Producto no encontrado'
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

// ============================
// Crear un producto
// ============================
app.post('/producto', verificaToken, (req, res) => {
    //grabar usuario
    //grabar categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

// ============================
// Actualizar un producto
// ============================
app.put('/producto/:id', verificaToken, (req, res) => {
    //grabar usuario
    //grabar categoria
    let id = req.params.id;
    let body = req.body;

    body.usuario = req.usuario._id; //para actualizar el usuario
    //check que exista categoria?

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        })
    });

});

// ============================
// Eliminar un producto
// ============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //cambiar estado disponible

    let id = req.params.id;
    let actualizar = { disponible: false, usuario: req.usuario._id };

    Producto.findByIdAndUpdate(id, actualizar, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: 'Producto no encontrado'
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        })
    });
});

module.exports = app;