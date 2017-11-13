const modelDownload = require('../models/download.js')
const CronJob = require('cron').CronJob

let getPrevMonth = () => {
  let d = new Date()
  d.setMonth(d.getMonth() - 1)
  d.setHours(0, 0, 0)
  d.setMilliseconds(0)
  return (d / 1000 | 0)
}

/**
 * Cron to delete film from queue
 */

let jobDeleteMovie = new CronJob({
  cronTime: '00 00 00 1 * *',
  onTick: function () {
    modelDownload.cronDelete(getPrevMonth()).then(() => {
      console.log('Cron movie done :)')
    }).catch(err => {
      console.log(err)
    })
  },
  start: true,
  timeZone: 'Europe/Paris'
})

jobDeleteMovie.start()
