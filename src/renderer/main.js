import { createApp } from 'vue'
import { router } from './router'
import './index.css'

import App from './App.vue'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'

createApp(App).use(router).mount('#app')
