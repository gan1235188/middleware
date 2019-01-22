import webpack from 'webpack';
import path from 'path';

const config: webpack.Configuration = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    }
}

export default config