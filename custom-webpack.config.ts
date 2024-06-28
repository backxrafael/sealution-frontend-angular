import { EnvironmentPlugin } from 'webpack'
import DotenvWebpackPlugin from 'dotenv-webpack';
module.exports = {
    plugins: [new DotenvWebpackPlugin()]
}