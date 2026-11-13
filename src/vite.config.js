import { copyFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const sourceRoot = dirname(fileURLToPath(import.meta.url));
const pagesDirectory = resolve(sourceRoot, 'pages');
const htmlPages = readdirSync(pagesDirectory).filter((file) => file.endsWith('.html'));
const input = Object.fromEntries(
	htmlPages.map((file) => [`pages/${file.slice(0, -5)}`, resolve(pagesDirectory, file)]),
);

function rewritePublicRoutes(server) {
	server.middlewares.use((request, _response, next) => {
		if (!request.url) return next();
		const [pathname, query] = request.url.split('?');
		const aliases = {
			'/': '/pages/index.html',
			'/index.html': '/pages/index.html',
			'/login.html': '/pages/login.html',
		};
		if (aliases[pathname]) request.url = `${aliases[pathname]}${query ? `?${query}` : ''}`;
		next();
	});
}

function publicRouteAliases() {
	return {
		name: 'public-route-aliases',
		configureServer: rewritePublicRoutes,
		writeBundle(options) {
			const outputDirectory = options.dir || resolve(sourceRoot, 'dist');
			copyFileSync(resolve(outputDirectory, 'pages/index.html'), resolve(outputDirectory, 'index.html'));
			copyFileSync(resolve(outputDirectory, 'pages/login.html'), resolve(outputDirectory, 'login.html'));
		},
	};
}

export default defineConfig({
	root: sourceRoot,
	plugins: [react(), publicRouteAliases()],
	build: {
		rollupOptions: { input },
	},
});
