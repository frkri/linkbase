import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	...svelte.configs['flat/prettier'],
	perfectionist.configs['recommended-alphabetical'],
	prettier,
	{
		rules: {
			'perfectionist/sort-svelte-attributes': ['off'],
			'svelte/sort-attributes': ['error'],
			'perfectionist/sort-enums': ['off'],
			'perfectionist/sort-classes': ['off'],
			'perfectionist/sort-object-types': ['off'],
			'perfectionist/sort-objects': ['off'],
			'perfectionist/sort-interfaces': ['off']
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
];
