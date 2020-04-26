'use strict'

/*
 |--------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------
 |
 | Http routes are entry points to your web application. You can create
 | routes for different URL's and bind Controller actions to them.
 |
 | A complete guide on routing is available here.
 | http://adonisjs.com/docs/4.1/routing
 |
 */

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')
const User = use('App/Models/User')
const path = require('path')
const fs = require('fs')
const isDev = Env.get('NODE_ENV') === 'development'

Route.group(() => {
	Route.post('/register', 'AuthController.register').validator('CreateUser')
	Route.post('/login', 'AuthController.login').validator('LoginUser')
	Route.post('/logout', 'AuthController.logout')
	Route.post('/info', 'AuthController.getUserData')
}).prefix('api/auth')

Route.group(() => {
	Route.get('/all', async () => await User.all())
	Route.post('/edit', 'UserController.updateUser').validator('UpdateUser').middleware(['auth'])
}).prefix('api/user')

Route.group(() => {
	Route.get('/index', 'QuestionController.index').middleware(['auth'])
	Route.post('/create', 'QuestionController.create').middleware(['auth']).validator('Question')
	Route.patch('/edit/:id', 'QuestionController.edit').middleware(['auth'])
	Route.delete('/delete/:id', 'QuestionController.delete').middleware(['auth'])
}).prefix('api/question')

Route.group(() => {
	Route.get('/index', 'AnswerController.index').middleware(['auth'])
	Route.post('/create', 'AnswerController.create').middleware(['auth']).validator('CreateAnswer')
}).prefix('api/answer')

Route.group(() => {
	Route.get('/index', 'QuestionnaireController.index').middleware(['auth'])
	Route.get('/show/:id', 'QuestionnaireController.show')
	Route.post('/create', 'QuestionnaireController.create').middleware(['auth']).validator('QuestionnaireCreate')
	Route.post('/complete/:id', 'QuestionnaireController.complete').validator('QuestionnaireComplete')
	Route.patch('/edit/:id', 'QuestionnaireController.edit').middleware(['auth']).validator('QuestionnaireCreate')
	Route.delete('/delete/:id', 'QuestionnaireController.delete').middleware(['auth'])
}).prefix('api/questionnaire')

Route.any('*', ({ response, request }) => {
	if (isDev) {
		response.redirect(`http://${ Env.get('HOST', 'localhost') }:3000`)
		return
	}
	response.send(fs.readFileSync(path.join(__dirname, '../public/index.html')).toString())
})