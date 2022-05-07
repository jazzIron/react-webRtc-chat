module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier', '@emotion'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-var-requires': 'off', // var 사용금지
    '@typescript-eslint/no-unused-vars': 'off', // 선언 후 미사용 금지
    'import/no-extraneous-dependencies': [
      'error',
      {
        //  테스트 또는 개발환경을 구성하는 파일에서는 devDependency 사용을 허용
        devDependencies: [
          '**/*.@(spec|test).@(js|ts)?(x)',
          '**/script/*.js',
          '**/mocks/**/*.@(js|ts)?(x)',
        ],
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.tsx', '.jsx', 'spec.js'] }, //확장자 설정
    ],
    'react/function-component-definition': 'off',
    'import/no-duplicates': 'off', // 중복 가져오기 허용여부
    'import/extensions': [
      // import text from './text/text.js
      // 이럴 때 뒤에 js같은 확장자 붙일지 말지 결정
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/order': [
      // 입력 순서 검사
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '[@]common/**',
            group: 'external',
            position: 'after',
          },
        ],
        //pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', 'spec.js'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
    },
    'import/resolver': {
      //ESLint 를 적용하지 않을 폴더나 파일을 명시
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
