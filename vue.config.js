module.exports = {
  publicPath: './', // 构建好的文件输出到哪里 内网是user  132是xh

  outputDir: "dist", // where to put static assets (js/css/img/font/...) // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error' // 当设置为‘error’时，检查出的错误会触发编译失败

  productionSourceMap: false,
  
  configureWebpack: config => {
    return {
      optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
          automaticNameDelimiter: '~',
          cacheGroups: {
            vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial',
              maxSize: 2002400
            }
          }
        }
      },
    }
    
  },
  devServer: {
    open: process.platform === "darwin",

    disableHostCheck: false,

    host: "0.0.0.0",

    port: 3050,

    https: false,

    hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy

    proxy: {
      'performance-appraisal-server-api/': {
        target: 'http://performance-appraisal-server.dev.medway.cloud/', //对应自己的接口
          // target: 'http://192.168.1.125:8080/', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/performance-appraisal-server-api': ''
        }
      }
    }

    // before: app => {}
  }, // 第三方插件配置
};
