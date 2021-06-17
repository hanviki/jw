module.exports = {
  presets: [
    '@vue/app'
  ]
}
/**
 * module.exports = {
  presets: [
    '@vue/app'
  ],
  // 解决Cannot assign to read only property 'exports' of object '#Object' 
  //新的webpack不允许 import 和 module.exports 共存
  sourceType: 'unambiguous' 
}
 */