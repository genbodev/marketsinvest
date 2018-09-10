const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require('fs');
const isDevelopment = !process.env.production;
const assetsPath = path.join(__dirname, '/build');

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].css",
    disable: process.env.NODE_ENV === "development"
});

const config = {
    entry: {
        app: ['babel-polyfill', './src/js/app.js'],
        'investing-calculator': ['./src/js/investing-calculator.js'],
        'traders-calculator': ['./src/js/traders-calculator.js']
    },
    output: {
        path: require('path').resolve('build'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {presets: ['es2015']}
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]',
                        publicPath: '../'
                    }
                }, {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 70
                        }
                    }
                },
                ],
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        publicPath: '../'
                    }
                },
            }
        ]
    },
    plugins: [
        extractSass,
        new CopyWebpackPlugin([
            {
                context: 'src',
                from: '**/*.html',
                to: '.'
            },
            {
                context: 'src',
                from: '**/*.css',
                to: '.'
            },
            {
                context: 'src',
                from: '**/*.js',
                to: '.'
            }
        ])
    ],
};

if (isDevelopment) {
    fs.readdirSync(assetsPath)
        .map((fileName) => {
            if (['.css', '.js'].includes(path.extname(fileName))) {
                return fs.unlinkSync(`${assetsPath}/${fileName}`);
            }

            return '';
        });
} else {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}

module.exports = config;
