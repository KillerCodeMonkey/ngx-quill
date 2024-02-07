import * as webpack from 'webpack'

export default (
  config: webpack.Configuration
) => {
  config.module.rules.push({
    test: /\.svg$/,
    loader: 'svg-inline-loader'
  })

  return config
}