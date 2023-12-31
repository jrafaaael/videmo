module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	globals: {
		CanvasImageSource: 'readonly',
		AudioDecoder: 'readonly',
		VideoDecoder: 'readonly',
		AudioEncoder: 'readonly',
		VideoEncoder: 'readonly',
		EncodedAudioChunk: 'readonly',
		EncodedVideoChunk: 'readonly',
		AudioData: 'readonly',
		VideoFrame: 'readonly',
		VideoColorSpace: 'readonly',
		ImageDecoder: 'readonly',
		ImageTrackList: 'readonly',
		ImageTrack: 'readonly'
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		'@typescript-eslint/no-non-null-assertion': 'error'
	}
};
