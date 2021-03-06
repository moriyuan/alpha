import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'

// import base style
// import 'codemirror/lib/codemirror.css'

// import more codemirror resource...
import 'codemirror/mode/python/python.js'

// you can set default global options and events when Vue.use
Vue.use(VueCodemirror, {
  options: { theme: 'darcula' },
})