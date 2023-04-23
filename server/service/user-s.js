const userModel = require('../models/User')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const mailService = require('./mail-s')
const tokenService = require('./token-s')
const UserDto = require('../dtos/user-dto')
const Role = require('../models/Role')

class UserService {
    async registration(email,password,role){
        const candidate = await userModel.findOne({email})
        if (candidate){
            throw new Error('пользователь с таким мылом уже существует')
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const userRole = await Role.findOne({value: role})
        const activationLink = uuid.v4()

        const user = await userModel.create({email,password: hashPassword, activationLink,roles: userRole.value})
        await mailService.sendActivationMail(email,activationLink)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async login(email, password) {
        const user = await userModel.findOne({email})
        if (!user) {
            throw new Error('Неверное имя пользователя или пароль')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw new Error('Неверное имя пользователя или пароль')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error("не авторизован")
        }
        const userData = tokenService.validateRToken(refreshToken)
        const tokenFromMongo = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromMongo) {
            throw new Error("рефреш токен не сработал")
        }
        const user = await userModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
}

module.exports = new UserService()