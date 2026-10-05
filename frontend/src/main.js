import { createApp } from 'vue'
import App from './App.vue'
import { reveal } from './directives/reveal'

import './styles/variables.css'
import './styles/base.css'
import './styles/background.css'

createApp(App)
  .directive('reveal', reveal)
  .mount('#app')
