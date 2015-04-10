var paths = {
  client: {
    dir: './client/src/',
    dist: './client/dist/',
    scripts: {
      dir: './client/src/scripts/',
      entry: './client/src/scripts/main.jsx',
      all: './client/src/scripts/**/*.{js,jsx}',
    },
    stylesheets: {
      dir: './client/src/stylesheets/',
      entry: './client/src/stylesheets/main.sass',
      all: './client/src/stylesheets/**/*.sass',
      plugins: [
        './node_modules/codemirror/lib/codemirror.css',
        './node_modules/codemirror/theme/neo.css',
        './node_modules/codemirror/addon/lint/lint.css',
      ],
    },
    static: {
      all: ['./node_modules/jailed/_*'],
    },
    temp: './client/temp/',
  },
  demo: {
    dir: './demo/src/',
    dist: './demo/dist/',
    scripts: {
      dir: './demo/src/scripts/',
      entry: './demo/src/scripts/main.js',
      all: './demo/src/scripts/**/*.js',
    },
    stylesheets: {
      dir: './demo/src/stylesheets/',
      entry: './demo/src/stylesheets/main.sass',
      all: './demo/src/stylesheets/**/*.sass',
    },
    static: {
      dir: './demo/src/static/',
      all: ['./demo/src/static/**/*', './node_modules/jailed/_*'],
    },
  },
  server: {
    dir: './server/src/',
    dist: './server/dist/',
  },
  shared: {
    dir: './shared/src/',
    dist: './shared/dist/',
    scripts: {
      dir: './shared/src/scripts/',
      all: './shared/src/scripts/**/*.js',
    },
  },
  tests: {
    dir: './test/',
    main: './test/test.js',
  },
};

module.exports = paths;
