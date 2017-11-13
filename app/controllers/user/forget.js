const isEmail = require('validator/lib/isEmail')
const nodemailer = require('nodemailer')

const model = require('../../models/user.js')
const modelForget = require('../../models/forget.js')

function genToken () {
  var str = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
  var token = ''

  for (var count = 0; count < 128; count++) {
    token += str[Math.floor((Math.random() * str.length))]
  }
  return (token)
}

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.body.mail !== 'string') {
    return error(res, 'Invalid field', 400)
  }

  if (!isEmail(req.body.mail)) return error(res, 'Invalid mail', 403)
  req.body.mail = req.body.mail.toLowerCase()

  model.getUserByMail(req.body.mail).then(results => {
    if (results.length === 0) return error(res, 'User not found', 403)
    let hash = genToken()

    modelForget.add({
      userId: results[0].id,
      token: hash
    }).then(() => {
      nodemailer.createTestAccount((err, account) => {
        if (err) return error(res, 'Mail was not send', 500)
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: 'admmatcha@gmail.com', // generated ethereal user
            pass: 'Apwn789123'  // generated ethereal password
          }
        })

        // setup email data with unicode symbols
        let mailOptions = {
          from: '"Hypertube Admin" <admmatcha@gmail.com>', // sender address
          to: req.body.mail, // list of receivers
          subject: 'Hypertube forget password', // Subject line
          text: 'Hello, if you have forget you password go on this link: http://localhost:3000/reset/' + hash, // plain text body
          html: 'Hello,</br> if you have forget you password go on this <b><a href=\'http://localhost:3000/reset/' + hash + '\'>link</a></b>' // html body
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
            return error(res, 'Mail was not send', 500)
          }
          res.json({ success: true })
        })
      })
    }).catch(err => {
      console.log(err)
      return error(res, 'Internal server error', 500)
    })
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
