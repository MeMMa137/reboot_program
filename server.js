import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';

const hostname = '127.0.0.1';
const port = 3000;

const projectRoot = process.cwd();
const publicDirectory = path.join(projectRoot, 'frontend');

const contentTypeByExtension = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp',
	'.txt': 'text/plain; charset=utf-8',
};

function resolveFilePath(requestUrl) {
	const { pathname } = url.parse(requestUrl);
	const rawPath = pathname === '/' ? '/index.html' : pathname;
	const normalizedPath = path.normalize(rawPath).replace(/^(\.\.[/\\])+/, '');
	const absolutePath = path.join(publicDirectory, normalizedPath);
	return absolutePath;
}

async function fileExists(filePath) {
	try {
		const stats = await fs.stat(filePath);
		return stats.isFile();
	} catch {
		return false;
	}
}

const server = http.createServer(async (req, res) => {
	try {
		const absolutePath = resolveFilePath(req.url || '/');
		if (!absolutePath.startsWith(publicDirectory)) {
			res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
			res.end('Forbidden');
			return;
		}

		const exists = await fileExists(absolutePath);
		if (!exists) {
			res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
			res.end('Not Found');
			return;
		}

		const ext = path.extname(absolutePath).toLowerCase();
		const contentType = contentTypeByExtension[ext] || 'application/octet-stream';

		const data = await fs.readFile(absolutePath);
		res.writeHead(200, {
			'Content-Type': contentType,
			'Cache-Control': 'no-store',
		});
		res.end(data);
	} catch (error) {
		res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
		res.end('Internal Server Error');
	}
});

server.listen(port, hostname, () => {
	console.log(`Dev server running at http://${hostname}:${port}`);
	console.log(`Serving static files from: ${publicDirectory}`);
});


