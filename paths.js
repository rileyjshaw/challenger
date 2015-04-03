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
      dir: './client/src/static/',
      all: './client/src/static/**/*',
    },
    temp: './client/temp/',
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
