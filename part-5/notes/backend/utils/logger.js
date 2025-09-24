const info = (...params) => {
  if(process.env.NODE_ENV !== 'test'){
    console.log('Logger: ', ...params)
  }
}

const error = (...params) => {
  if(process.env.NODE_ENV !== 'test'){
    console.log('Logger: ', ...params)
  }
}

module.exports = { info, error }