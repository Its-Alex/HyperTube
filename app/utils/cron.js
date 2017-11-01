const modelDownlaod = require('../models/download.js')

/**
 * Cron to delete film from queue
 */

setInterval(() => {
  modelDownlaod.cronDelete().then(res => {
    console.log('Cron delete film done')
  }).catch(err => {
    console.log(err)
    console.log('Cron delete film error')
  })
}, 864000)
