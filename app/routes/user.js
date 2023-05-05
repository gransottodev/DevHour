module.exports = application => {
  application.get('/', (req, res) => {
    res.status(200),json({msg : 'OK'})
  })

  application.get('/user/:id', checkToken,(req, res) => {
    application.app.controllers.user.getById(application, req, res)
  })

  application.post('/auth/login', (req, res) => {
    application.app.controllers.user.login(application, req ,res)
  })

  application.post('/auth/register', (req, res) =>{
    application.app.controllers.user.register(application, req, res)
  })

}