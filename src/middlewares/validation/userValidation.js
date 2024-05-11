const joi = require('joi');


const registerValidation = (req, res, next) => {
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
        return res.status(400).json(registerSchema.error)
    }
    else {
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
        return res.status(400).json(loginSchema.error);
    } else {
        next();
    }
}

const updateValidation = (req, res, next) => {
    const updateSchema = joi.object({
        firstname: joi.string().trim().min(3).max(30).allow('').messages({
            "string.base": "isim alanı normal metin olmalıdır",
            "string.min": "isim alanı en az 3 karakterden olşumalıdır",
            "string.max": "isim alanı en fazla 50 karakterden oluşmalıdır",
        }),
        lastname: joi.string().trim().min(2).max(30).allow('').messages({
            "string.base": "soyad alanı metin olmalıdır",
            "string.min": "soyad alanı en az 3 karakterden olşumalıdır",
            "string.max": "soyad alanı en fazla 50 karakterden oluşmalıdır",
        }),
        currentPassword: joi.string().trim().min(6).max(30).required().messages({
            "string.base": "şifre alanı metin olmalıdır",
            "string.empty": "şifre alanı boş bırakılamaz",
            "string.min": "şifre alanı en az 6 karakterden olşumalıdır",
            "string.max": "şifre alanı en fazla 36 karakterden oluşmalıdır",
            "string.required": "şifre alanı zorunludur",
        }),
        newPassword: joi.string().trim().min(6).max(30).allow('').messages({
            "string.base": "şifre alanı metin olmalıdır",
            "string.min": "şifre alanı en az 6 karakterden olşumalıdır",
            "string.max": "şifre alanı en fazla 36 karakterden oluşmalıdır",
        }),
        newPasswordAgain: joi.string().trim().min(6).max(30).allow('').messages({
            "string.base": "şifre alanı metin olmalıdır",
            "string.min": "şifre alanı en az 6 karakterden olşumalıdır",
            "string.max": "şifre alanı en fazla 36 karakterden oluşmalıdır",
        })
    }).validate(req.body);
    if (updateSchema.error) {
        return res.status(400).json(updateSchema.error)
    } else {
        next();
    }
}

const verifyValidation = (req, res, next) => {
    const verifySchema = joi.object({
        email: joi.string().trim().empty().email().required().messages({
            "string.base": "email alanı metin olmalıdır",
            "string.empty": "email alanı boş bırakılamaz",
            "string.email": "lütfen geçerli bir email giriniz",
            "string.min": "email alanı en az 3 karakterden olşumalıdır",
            "string.max": "email alanı en fazla 100 karakterden oluşmalıdır",
            "string.required": "email alanı zorunludur",

        }),
        userVerifyCode: joi.string().empty().trim().min(6).max(6).required().messages({
            "string.base": "doğrulama kodu alanı metin olmalıdır",
            "string.empty": "doğrulama kodu alanı boş bırakılamaz",
            "string.min": "doğrulama kodu alanı 6 karater olmalıdır",
            "string.max": "doğrulama kodu alanı 6 karater olmalıdır",
            "string.required": "doğrulam kodu alanı zournludur",

        })
    }).validate(req.body);
    if (verifySchema.error) {
        return res.status(400).json(verifySchema.error);

    } else {
        next();
    }
}

module.exports = {
    registerValidation,
    loginValidation,
    updateValidation,
    verifyValidation
};