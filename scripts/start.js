import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const nodeCmd = process.execPath;
const vitePath = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

const isProd = process.env.NODE_ENV === 'production';

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once('error', () => resolve(false));
    s.once('listening', () => {
      s.close(() => resolve(true));
    });
    s.listen(port);
  });
}

function killProcess(child) {
  if (!child || child.killed || !child.pid) return;
  if (isWindows) {
    try {
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } catch {
      try { child.kill('SIGKILL'); } catch {}
    }
  } else {
    try { child.kill('SIGINT'); } catch {}
  }
}

if (isProd) {
  const distHtml = path.join(rootDir, 'dist', 'index.html');
  if (!fs.existsSync(distHtml)) {
    console.log('[GM7] Production build not found. Building with Vite...');
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    const build = spawn(npmCmd, ['run', 'build'], { cwd: rootDir, stdio: 'inherit' });
    build.on('exit', (code) => {
      if (code !== 0) {
        console.error(`[GM7] Build failed with exit code ${code}`);
        process.exit(code || 1);
      }
      startServer();
    });
  } else {
    startServer();
  }
} else {
  startDev();
}

function startServer() {
  console.log('[GM7] Starting production server...');
  const server = spawn(nodeCmd, ['server/index.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });

  const cleanup = () => {
    killProcess(server);
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  server.on('exit', (code) => process.exit(code ?? 0));
}

async function startDev() {
  console.log('\n======================================================');
  console.log('  GM7 Platform — Starting Development Environment');
  console.log('  ➜ Frontend: http://localhost:3000');
  console.log('  ➜ Backend:  http://localhost:3001');
  console.log('======================================================\n');

  const port3001Free = await checkPortAvailable(3001);
  if (!port3001Free) {
    console.warn('[GM7 Warning] Port 3001 is already in use by another process.');
    console.warn('  If the server fails to start, free the port in PowerShell with:');
    console.warn('  Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force\n');
  }

  const server = spawn(nodeCmd, ['server/index.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env },
  });

  const vite = spawn(nodeCmd, [vitePath, '--port=3000', '--host=0.0.0.0'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env },
  });

  let shuttingDown = false;
  const cleanup = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    killProcess(server);
    killProcess(vite);
    setTimeout(() => process.exit(0), 300);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);

  server.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) {
      console.error(`[GM7 Backend] Exited with code ${code}`);
    }
  });

  vite.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) {
      console.error(`[GM7 Frontend] Vite exited with code ${code}`);
    }
  });
}
