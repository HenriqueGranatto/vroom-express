'use strict'

exports.timeRequest = (timeStart) => parseFloat((Date.now() - timeStart) / 1000).toFixed(2)
