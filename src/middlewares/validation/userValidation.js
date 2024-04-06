const joi = require('joi');


const registerValidation = (req, res, next) => {
    console.log('validation started');
    const registerSchema = joi.object({
        firstname: joi.string().trim().min(3).max(30).required().messages({
            "string.base": "isim alanı normal metin olmalıdır",
            "string.empty": "isim alanı boş olamaz",
            "string.min": "isim alanı en az 3 karakterden olşumalıdır",
            "string.max": "isim alanı en fazla 50 karakterden oluşmalıdır",
            "string.required": "isim alanı zorunludur",
        }),
        lastname: joi.string().trim().min(2).max(30).required().messages({
            "string.base": "soyad alanı metin olmalıdır",
            "string.empty": "soyad alanı boş bırakılamaz",
            "string.min": "soyad alanı en az 3 karakterden olşumalıdır",
            "string.max": "soyad alanı en fazla 50 karakterden oluşmalıdır",
            "string.required": "soyad alanı zorunludur",
        }),
        email: joi.string().trim().empty().email().required().messages({
            "string.base": "email alanı metin olmalıdır",
            "string.empty": "email alanı boş bırakılamaz",
            "string.email": "lütfen geçerli bir email giriniz",
            "string.min": "email alanı en az 3 karakterden olşumalıdır",
            "string.max": "email alanı en fazla 100 karakterden oluşmalıdır",
            "string.required": "email alanı zorunludur",

        }),
        password: joi.string().trim().min(6).max(30).required().messages({
            "string.base": "şifre alanı metin olmalıdır",
            "string.empty": "şifre alanı boş bırakılamaz",
            "string.min": "şifre alanı en az 6 karakterden olşumalıdır",
            "string.max": "şifre alanı en fazla 36 karakterden oluşmalıdır",
            "string.required": "şifre alanı zorunludur",

        })
    }).validate(req.body)
    if (registerSchema.error) {
        console.log(registerSchema.error.message);
        return res.status(400).json(registerSchema.error)
    }
    else {
        console.log('validation successfull');
        next()
    }
    ;
}


const loginValidation = (req, res, next) => {
    const loginSchema = joi.object({
        email: joi.string().trim().empty().email().required().messages({
            "string.base": "email alanı metin olmalıdır",
            "string.empty": "email alanı boş bırakılamaz",
            "string.email": "lütfen geçerli bir email giriniz",
            "string.min": "email alanı en az 3 karakterden olşumalıdır",
            "string.max": "email alanı en fazla 100 karakterden oluşmalıdır",
            "string.required": "email alanı zorunludur",

        }),
        password: joi.string().trim().min(6).max(30).required().messages({
            "string.base": "şifre alanı metin olmalıdır",
            "string.empty": "şifre alanı boş bırakılamaz",
            "string.min": "şifre alanı en az 6 karakterden olşumalıdır",
            "string.max": "şifre alanı en fazla 36 karakterden oluşmalıdır",
            "string.required": "şifre alanı zorunludur",

        })
    }).validate(req.body);
    if (loginSchema.error) {
        console.log(loginSchema.error.message);
        return res.status(400).json(loginSchema.error);
    } else {
        console.log('validation successful');
        next();
    }
}

const updateValidation = (req, res, next) => {
    const updateSchema = joi.object({
        firstname: joi.string().trim().min(3).max(30).required().messages({
            "string.base": "isim alanı normal metin olmalıdır",
            "string.empty": "isim alanı boş olamaz",
            "string.min": "isim alanı en az 3 karakterden olşumalıdır",
            "string.max": "isim alanı en fazla 50 karakterden oluşmalıdır",
            "string.required": "isim alanı zorunludur",
        }),
        lastname: joi.string().trim().min(2).max(30).required().messages({
            "string.base": "soyad alanı metin olmalıdır",
            "string.empty": "soyad alanı boş bırakılamaz",
            "string.min": "soyad alanı en az 3 karakterden olşumalıdır",
            "string.max": "soyad alanı en fazla 50 karakterden oluşmalıdır",
            "string.required": "soyad alanı zorunludur",
        }),
    }).validate(req.body);
    if (updateSchema.error) {
        console.log(updateSchema.error.message);
        return res.status(400).json(updateSchema.error)
    } else {
        console.log('validation successfull');
        next();
    }
}


module.exports = {
    registerValidation,
    loginValidation,
    updateValidation
};