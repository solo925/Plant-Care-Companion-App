import Joi from 'joi';


export const userSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
        'string.empty': '"name" is not allowed to be empty',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': '"email" is required',
        'string.email': '"email" must be a valid email',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': '"password" is required',
        'string.min': '"password" should have a minimum length of 6',
    }),
    confirmpassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': '"confirmPassword" must match "password"',
        'any.required': '"confirmPassword" is required',
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string().required().messages({
        'string.min': 'Password must be at least 6 characters.',
        'any.required': 'Password is required.'
    })
});



