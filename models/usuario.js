var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};
var usuarioSchema = Schema({
    nombre: { type: String, require: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, require: [true, 'El correo es necesario'] },

    password: { type: String, require: [true, 'La clave es necesaria'] },
    img: { type: String, require: false },

    // dia: { type: Number, require: false },
    role: { type: String, require: true, default: 'USER_ROLE', enum: rolesValidos }
});

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);