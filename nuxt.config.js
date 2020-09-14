module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'alpha-evaluation-system',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/small-icon.ico' }
    ],
    script: [
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    vendor: ['external_library'],
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  css: [
    // lib css
    'codemirror/lib/codemirror.css',
    // merge css
    'codemirror/addon/merge/merge.css',
    // theme css
    'codemirror/theme/darcula.css',
    'element-ui/lib/theme-chalk/index.css',  // 引入全局样式
  ],
  plugins: [
    {src: '@/plugins/CodeMirror', ssr: false},
    {src: '@/plugins/ElementUI', ssr: true }, // ssr:true代表在服务端渲染,客户端不渲染
    '~/plugins/axios',
    '~plugins/echarts',
    { src: '~/plugins/vue-html-pdf.js', ssr: false },
  ],
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    prefix: 'http://218.17.139.176:3052/api',  //在请求路径前，加上 /app
    proxy: true
  },
  // proxy: {
  //   '/app': { 
  //       target: 'http://218.17.139.176:3052'      
  //    }
  // },
}

