import postcss from "rollup-plugin-postcss";
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import svelte from 'rollup-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import { circularDependencies } from 'rollup-plugin-circular-dependencies';

export default {
  input: 'src/global.ts', // 기존 진입점
  output: {
    file: 'dist/global.js',
    format: 'iife',
    name: 'app',
  },
  plugins: [
    // 순환 의존성 검사
    circularDependencies(),

    // Svelte 처리
    svelte({
      include: 'src/**/*.svelte',
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !process.env.ROLLUP_WATCH,
      },
    }),

    // PostCSS 처리
    postcss({
      minimize: true,
      extract: true,
    }),

    // CommonJS 모듈 처리
    commonjs(),

    // Babel 처리
    babel({
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
    }),

    // Node 모듈 로드
    nodeResolve({
      browser: true, // 브라우저 환경을 대상으로 함
      dedupe: ['svelte'], // 중복 로드 방지
    }),

    // 코드 압축
    terser(),
  ],
};