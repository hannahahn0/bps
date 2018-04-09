import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './request/registerServiceWorker'
import './index.css'

ReactDOM.render(<App />, document.getElementById('root')) // eslint-disable-line react/jsx-filename-extension
registerServiceWorker()
