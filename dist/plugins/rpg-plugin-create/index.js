import chalk from 'chalk';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { PackageManager } from '../../core/PackageManager.js';
// Шаблоны проектов
const templates = {
    'react-app': {
        name: 'React + TypeScript + Vite',
        dependencies: {
            'react': '^18.2.0',
            'react-dom': '^18.2.0'
        },
        devDependencies: {
            '@types/react': '^18.2.43',
            '@types/react-dom': '^18.2.17',
            '@typescript-eslint/eslint-plugin': '^6.14.0',
            '@typescript-eslint/parser': '^6.14.0',
            '@vitejs/plugin-react': '^4.2.1',
            'eslint': '^8.55.0',
            'eslint-plugin-react-hooks': '^4.6.0',
            'eslint-plugin-react-refresh': '^0.4.5',
            'typescript': '^5.2.2',
            'vite': '^5.0.8'
        },
        files: {
            'package.json': (name) => ({
                name,
                private: true,
                version: '0.0.0',
                type: 'module',
                scripts: {
                    'dev': 'vite',
                    'build': 'tsc && vite build',
                    'lint': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
                    'preview': 'vite preview'
                }
            }),
            'tsconfig.json': {
                compilerOptions: {
                    target: 'ES2020',
                    useDefineForClassFields: true,
                    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                    module: 'ESNext',
                    skipLibCheck: true,
                    moduleResolution: 'bundler',
                    allowImportingTsExtensions: true,
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    jsx: 'react-jsx',
                    strict: true,
                    noUnusedLocals: true,
                    noUnusedParameters: true,
                    noFallthrough: true
                },
                include: ['src'],
                references: [{ path: './tsconfig.node.json' }]
            },
            'tsconfig.node.json': {
                compilerOptions: {
                    composite: true,
                    skipLibCheck: true,
                    module: 'ESNext',
                    moduleResolution: 'bundler',
                    allowSyntheticDefaultImports: true
                },
                include: ['vite.config.ts']
            },
            'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
            '.eslintrc.cjs': `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}`,
            'src/App.tsx': `import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App`,
            'src/index.css': `
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}`,
            'src/App.css': `
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}`,
            'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
            'src/vite-env.d.ts': `/// <reference types="vite/client" />`,
            'public/vite.svg': `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="410" height="404" viewBox="0 0 410 404" fill="none">
<path d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8904 208.776 77.6763L389.119 44.8058C397.439 43.2894 403.768 52.1434 399.641 59.5246Z" fill="url(#paint0_linear)"/>
<path d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 173.055 194.443 176.622L183.18 231.775C182.422 235.487 185.907 238.661 189.532 237.56L212.947 230.446C216.577 229.344 220.065 232.527 219.297 236.242L201.398 322.875C200.278 328.294 207.486 331.249 210.492 326.603L212.5 323.5L323.454 102.072C325.312 98.3645 322.108 94.137 318.036 94.9228L279.014 102.454C275.347 103.161 272.227 99.746 273.262 96.1583L298.731 7.86689C299.767 4.27314 296.636 0.855181 292.965 1.5744Z" fill="url(#paint1_linear)"/>
<defs>
<linearGradient id="paint0_linear" x1="6.00017" y1="32.9999" x2="235" y2="344" gradientUnits="userSpaceOnUse">
<stop stop-color="#41D1FF"/>
<stop offset="1" stop-color="#BD34FE"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="194.651" y1="8.81818" x2="236.076" y2="292.989" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFEA83"/>
<stop offset="0.0833333" stop-color="#FFDD35"/>
<stop offset="1" stop-color="#FFA800"/>
</linearGradient>
</defs>
</svg>`,
            'src/assets/react.svg': `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="-10.5 -9.45 21 18.9" fill="none">
<circle cx="0" cy="0" r="2" fill="currentColor"></circle>
<g stroke="currentColor" stroke-width="1" fill="none">
<ellipse rx="10" ry="4.5"></ellipse>
<ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
<ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
</g>
</svg>`,
            '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`
        }
    },
    'next-app': {
        name: 'Next.js + TypeScript + Tailwind CSS',
        dependencies: {
            'next': '^14.0.4',
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            '@heroicons/react': '^2.1.1',
            'clsx': '^2.0.0'
        },
        devDependencies: {
            '@types/node': '^20.10.5',
            '@types/react': '^18.2.45',
            '@types/react-dom': '^18.2.18',
            'autoprefixer': '^10.4.16',
            'postcss': '^8.4.32',
            'tailwindcss': '^3.4.0',
            'typescript': '^5.3.3',
            'eslint': '^8.56.0',
            'eslint-config-next': '^14.0.4'
        },
        files: {
            'package.json': (name) => ({
                name,
                version: '0.1.0',
                private: true,
                scripts: {
                    'dev': 'next dev',
                    'build': 'next build',
                    'start': 'next start',
                    'lint': 'next lint'
                }
            }),
            'tsconfig.json': {
                compilerOptions: {
                    target: 'es5',
                    lib: ['dom', 'dom.iterable', 'esnext'],
                    allowJs: true,
                    skipLibCheck: true,
                    strict: true,
                    noEmit: true,
                    esModuleInterop: true,
                    module: 'esnext',
                    moduleResolution: 'bundler',
                    resolveJsonModule: true,
                    isolatedModules: true,
                    jsx: 'preserve',
                    incremental: true,
                    plugins: [
                        {
                            name: 'next'
                        }
                    ],
                    paths: {
                        '@/*': ['./src/*']
                    }
                },
                include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
                exclude: ['node_modules']
            },
            'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`,
            'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
            'tailwind.config.ts': `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config`,
            'src/app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Created with RPG',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
            'src/app/page.tsx': `import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-6xl font-bold">Welcome to Next.js</h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>
      </div>
    </main>
  )
}`,
            'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`
        }
    },
    'express-api': {
        name: 'Express.js + TypeScript + Prisma + JWT',
        dependencies: {
            'express': '^4.18.2',
            '@prisma/client': '^5.7.1',
            'jsonwebtoken': '^9.0.2',
            'bcryptjs': '^2.4.3',
            'cors': '^2.8.5',
            'dotenv': '^16.3.1',
            'helmet': '^7.1.0',
            'zod': '^3.22.4'
        },
        devDependencies: {
            '@types/node': '^20.10.5',
            '@types/express': '^4.17.21',
            '@types/cors': '^2.8.17',
            '@types/jsonwebtoken': '^9.0.5',
            '@types/bcryptjs': '^2.4.6',
            'prisma': '^5.7.1',
            'typescript': '^5.3.3',
            'ts-node-dev': '^2.0.0',
            'eslint': '^8.56.0',
            '@typescript-eslint/parser': '^6.15.0',
            '@typescript-eslint/eslint-plugin': '^6.15.0'
        },
        files: {
            'package.json': (name) => ({
                name,
                version: '1.0.0',
                private: true,
                scripts: {
                    'dev': 'ts-node-dev --respawn --transpile-only src/index.ts',
                    'build': 'tsc',
                    'start': 'node dist/index.js',
                    'prisma:generate': 'prisma generate',
                    'prisma:migrate': 'prisma migrate dev'
                }
            }),
            'tsconfig.json': {
                compilerOptions: {
                    target: 'es2020',
                    module: 'commonjs',
                    outDir: './dist',
                    rootDir: './src',
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true
                },
                include: ['src/**/*'],
                exclude: ['node_modules']
            },
            'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
            'src/index.ts': `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Роуты
app.use('/auth', authRouter);

// Обработка ошибок
app.use(errorHandler);

app.listen(port, () => {
  console.log(\`🚀 Сервер запущен на порту \${port}\`);
});`,
            'src/routes/auth.ts': `import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };`,
            'src/middleware/error.ts': `import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Ошибка валидации',
      details: error.errors
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Этот email уже используется'
      });
    }
  }

  res.status(500).json({
    error: 'Внутренняя ошибка сервера'
  });
}`,
            '.env': `DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET="your-secret-key"`,
            '.gitignore': `node_modules
dist
.env
*.log
prisma/*.db`
        }
    },
    'vue-app': {
        name: 'Vue 3 + TypeScript + Pinia',
        dependencies: {
            'vue': '^3.3.11',
            'vue-router': '^4.2.5',
            'pinia': '^2.1.7',
            '@vueuse/core': '^10.7.0'
        },
        devDependencies: {
            '@vitejs/plugin-vue': '^4.5.2',
            'typescript': '^5.3.3',
            '@types/node': '^20.10.5',
            '@vue/tsconfig': '^0.5.1',
            '@typescript-eslint/parser': '^6.15.0',
            '@typescript-eslint/eslint-plugin': '^6.15.0',
            'eslint': '^8.56.0',
            'eslint-plugin-vue': '^9.19.2',
            'vite': '^5.0.10'
        },
        files: {
            'package.json': (name) => ({
                name,
                version: '0.0.0',
                private: true,
                type: 'module',
                scripts: {
                    'dev': 'vite',
                    'build': 'vue-tsc && vite build',
                    'preview': 'vite preview',
                    'lint': 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix'
                }
            }),
            'tsconfig.json': {
                extends: '@vue/tsconfig/tsconfig.dom.json',
                include: ['env.d.ts', 'src/**/*', 'src/**/*.vue'],
                compilerOptions: {
                    baseUrl: '.',
                    paths: {
                        '@/*': ['./src/*']
                    },
                    target: 'ESNext',
                    useDefineForClassFields: true,
                    module: 'ESNext',
                    moduleResolution: 'bundler',
                    strict: true,
                    jsx: 'preserve',
                    resolveJsonModule: true,
                    isolatedModules: true,
                    esModuleInterop: true,
                    lib: ['ESNext', 'DOM'],
                    skipLibCheck: true,
                    noEmit: true
                }
            },
            'vite.config.ts': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})`,
            'src/App.vue': `<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style>
nav {
  padding: 2rem;
  display: flex;
  gap: 1rem;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

nav a:hover {
  background: #f1f1f1;
}

nav a.router-link-active {
  color: #42b983;
}
</style>`,
            'src/main.ts': `import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')`,
            'src/router/index.ts': `import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router`,
            'src/stores/counter.ts': `import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})`,
            'src/views/HomeView.vue': `<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <main>
    <h1>Welcome to Vue 3</h1>
    
    <div class="card">
      <button type="button" @click="counter.increment">
        count is {{ counter.count }}
      </button>
      <p>Double count is {{ counter.doubleCount }}</p>
    </div>

    <p>
      Edit <code>src/views/HomeView.vue</code> to test hot module replacement.
    </p>
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

button {
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: 500;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #42b983;
}
</style>`,
            'src/views/AboutView.vue': `<template>
  <div class="about">
    <h1>About</h1>
    <p>This is a Vue 3 application created with RPG.</p>
  </div>
</template>

<style scoped>
.about {
  padding: 2rem;
  text-align: center;
}
</style>`,
            'src/assets/main.css': `body {
  margin: 0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
}`,
            'env.d.ts': `/// <reference types="vite/client" />`,
            '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
.DS_Store
dist
dist-ssr
coverage
*.local

/cypress/videos/
/cypress/screenshots/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`
        }
    },
    'nest-api': {
        name: 'Nest.js + TypeScript + TypeORM + Swagger',
        dependencies: {
            '@nestjs/common': '^10.0.0',
            '@nestjs/core': '^10.0.0',
            '@nestjs/platform-express': '^10.0.0',
            '@nestjs/swagger': '^7.1.17',
            '@nestjs/typeorm': '^10.0.1',
            '@nestjs/jwt': '^10.2.0',
            '@nestjs/passport': '^10.0.3',
            'passport': '^0.7.0',
            'passport-jwt': '^4.0.1',
            'typeorm': '^0.3.17',
            'sqlite3': '^5.1.6',
            'class-validator': '^0.14.0',
            'class-transformer': '^0.5.1',
            'bcrypt': '^5.1.1',
            'reflect-metadata': '^0.1.13',
            'rxjs': '^7.8.1'
        },
        devDependencies: {
            '@nestjs/cli': '^10.0.0',
            '@nestjs/schematics': '^10.0.0',
            '@nestjs/testing': '^10.0.0',
            '@types/express': '^4.17.21',
            '@types/node': '^20.10.5',
            '@types/passport-jwt': '^4.0.0',
            '@types/bcrypt': '^5.0.2',
            '@typescript-eslint/eslint-plugin': '^6.15.0',
            '@typescript-eslint/parser': '^6.15.0',
            'eslint': '^8.56.0',
            'typescript': '^5.3.3',
            'ts-node': '^10.9.2',
            'ts-loader': '^9.5.1'
        },
        files: {
            'package.json': (name) => ({
                name,
                version: '0.0.1',
                description: 'Nest.js API with TypeORM and Swagger',
                private: true,
                scripts: {
                    'build': 'nest build',
                    'format': 'prettier --write "src/**/*.ts"',
                    'start': 'nest start',
                    'dev': 'nest start --watch',
                    'debug': 'nest start --debug --watch',
                    'prod': 'node dist/main'
                }
            }),
            'tsconfig.json': {
                compilerOptions: {
                    module: 'commonjs',
                    declaration: true,
                    removeComments: true,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                    allowSyntheticDefaultImports: true,
                    target: 'ES2021',
                    sourceMap: true,
                    outDir: './dist',
                    baseUrl: './',
                    incremental: true,
                    skipLibCheck: true,
                    strictNullChecks: true,
                    noImplicitAny: true,
                    strictBindCallApply: true,
                    forceConsistentCasingInFileNames: true,
                    noFallthroughCasesInSwitch: true,
                    paths: {
                        '@/*': ['src/*']
                    }
                }
            },
            'nest-cli.json': {
                '$schema': 'https://json.schemastore.org/nest-cli',
                'collection': '@nestjs/schematics',
                'sourceRoot': 'src',
                'compilerOptions': {
                    'deleteOutDir': true
                }
            },
            'src/main.ts': `import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем валидацию
  app.useGlobalPipes(new ValidationPipe());

  // Настраиваем Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for your Nest.js application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(\`Application is running on: \${await app.getUrl()}\`);
}
bootstrap();`,
            'src/app.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}`,
            'src/users/entities/user.entity.ts': `import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  name?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}`,
            'src/users/users.service.ts': `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string, name?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    return this.usersRepository.save(user);
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}`,
            'src/users/users.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`,
            'src/auth/auth.module.ts': `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}`,
            'src/auth/auth.service.ts': `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.usersService.validatePassword(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, password: string, name?: string) {
    const user = await this.usersService.create(email, password, name);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}`,
            'src/auth/auth.controller.ts': `import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'Returns JWT token' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 201, description: 'Returns JWT token' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
    );
  }
}`,
            'src/auth/dto/auth.dto.ts': `import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class SignUpDto extends SignInDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;
}`,
            'src/auth/jwt.strategy.ts': `import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}`,
            '.env': `JWT_SECRET=your-secret-key
PORT=3000`,
            '.gitignore': `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# Database
*.sqlite`
        },
    },
    'electron-app': {
        name: 'Electron + React + TypeScript',
        dependencies: {
            'electron-updater': '^6.1.7',
            'electron-store': '^8.1.0'
        },
        devDependencies: {
            'electron': '^28.0.0',
            'electron-builder': '^24.9.1',
            '@types/electron': '^1.6.10',
            'concurrently': '^8.2.2',
            'wait-on': '^7.2.0'
        },
        files: {
            'package.json': (name) => ({
                name,
                version: '1.0.0',
                private: true,
                main: 'dist/electron/main.js',
                scripts: {
                    'dev': 'concurrently "vite" "npm run start:electron"',
                    'build': 'tsc && vite build && electron-builder',
                    'start:electron': 'wait-on tcp:3000 && tsc -p electron && electron .',
                    'preview': 'vite preview'
                },
                build: {
                    appId: `com.electron.${name}`,
                    productName: name,
                    directories: {
                        output: 'release'
                    },
                    files: [
                        'dist/**/*',
                        'electron/**/*'
                    ],
                    win: {
                        target: ['nsis']
                    },
                    mac: {
                        target: ['dmg']
                    },
                    linux: {
                        target: ['AppImage']
                    }
                }
            }),
            'electron/main.ts': `import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';

const store = new Store();
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Проверяем обновления
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC обработчики
ipcMain.handle('store:get', (_, key: string) => {
  return store.get(key);
});

ipcMain.handle('store:set', (_, key: string, value: any) => {
  store.set(key, value);
});`,
            'electron/tsconfig.json': {
                compilerOptions: {
                    target: 'ES2020',
                    module: 'commonjs',
                    outDir: '../dist/electron',
                    rootDir: './',
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true
                },
                include: ['./**/*']
            },
            'src/App.tsx': `import { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Загружаем сохраненное значение счетчика
    ipcRenderer.invoke('store:get', 'count').then((savedCount) => {
      if (savedCount !== undefined) {
        setCount(savedCount)
      }
    })
  }, [])

  const handleIncrement = () => {
    const newCount = count + 1
    setCount(newCount)
    // Сохраняем значение в store
    ipcRenderer.invoke('store:set', 'count', newCount)
  }

  return (
    <div className="container">
      <h1>Electron + React + TypeScript</h1>
      <div className="card">
        <button onClick={handleIncrement}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App`,
            '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-electron
release
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`
        }
    },
    'react-native-app': {
        name: 'React Native + TypeScript + Navigation',
        dependencies: {
            'react-native': '^0.73.1',
            'react': '^18.2.0',
            '@react-navigation/native': '^6.1.9',
            '@react-navigation/native-stack': '^6.9.17',
            'react-native-safe-area-context': '^4.8.2',
            'react-native-screens': '^3.29.0'
        },
        devDependencies: {
            '@babel/core': '^7.23.6',
            '@babel/preset-env': '^7.23.6',
            '@babel/runtime': '^7.23.6',
            '@react-native/babel-preset': '^0.73.18',
            '@react-native/eslint-config': '^0.73.1',
            '@react-native/metro-config': '^0.73.2',
            '@react-native/typescript-config': '^0.73.1',
            '@types/react': '^18.2.45',
            '@types/react-test-renderer': '^18.0.7',
            'typescript': '^5.3.3'
        },
        files: {
            'package.json': (name) => ({
                name,
                version: '0.0.1',
                private: true,
                scripts: {
                    'android': 'react-native run-android',
                    'ios': 'react-native run-ios',
                    'lint': 'eslint .',
                    'start': 'react-native start',
                    'test': 'jest'
                }
            }),
            'App.tsx': `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{ title: 'Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;`,
            'src/screens/HomeScreen.tsx': `import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', { itemId: 86 })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;`,
            'src/screens/DetailsScreen.tsx': `import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

function DetailsScreen({ route, navigation }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Text>itemId: {route.params.itemId}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default DetailsScreen;`,
            'index.js': `import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);`,
            'app.json': (name) => ({
                name,
                displayName: name
            }),
            'tsconfig.json': {
                extends: '@react-native/typescript-config/tsconfig.json'
            },
            '.gitignore': `# OSX
#
.DS_Store

# Xcode
#
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
ios/.xcode.env.local

# Android/IntelliJ
#
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore

# node.js
#
node_modules/
npm-debug.log
yarn-error.log

# fastlane
#
**/fastlane/report.xml
**/fastlane/Preview.html
**/fastlane/screenshots
**/fastlane/test_output

# Bundle artifact
*.jsbundle

# Ruby / CocoaPods
/ios/Pods/
/vendor/bundle/

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

# testing
/coverage`
        }
    }
};
const plugin = {
    name: 'rpg-plugin-create',
    version: '1.0.0',
    description: 'Создание проектов из шаблонов',
    hooks: {},
    async init(context) {
        if (!context.program)
            return;
        context.program
            .command('create <template> [name]')
            .description('Создать новый проект из шаблона')
            .option('-f, --force', 'Перезаписать существующую директорию')
            .action(async (templateName, projectName = '.', options) => {
            try {
                const template = templates[templateName];
                if (!template) {
                    console.error(chalk.red(`❌ Шаблон "${templateName}" не найден`));
                    console.log('\nДоступные шаблоны:');
                    for (const [name, { name: desc }] of Object.entries(templates)) {
                        console.log(`  ${chalk.hex('#4B5320')(name)}\t${chalk.hex('#515744')(desc)}`);
                    }
                    return;
                }
                console.log(chalk.hex('#4B5320')(`🚀 Создание проекта ${projectName} из шаблона ${templateName}...`));
                // Проверяем существование директории
                const projectPath = join(process.cwd(), projectName);
                if (existsSync(projectPath)) {
                    if (!options.force) {
                        console.error(chalk.red(`❌ Директория ${projectName} уже существует. Используйте флаг --force для перезаписи.`));
                        return;
                    }
                }
                // Создаем директорию проекта
                await mkdir(projectPath, { recursive: true });
                // Создаем файлы из шаблона
                for (const [filename, content] of Object.entries(template.files)) {
                    const filePath = join(projectPath, filename);
                    // Создаем поддиректории если нужно
                    const dir = filename.split('/').slice(0, -1).join('/');
                    if (dir) {
                        await mkdir(join(projectPath, dir), { recursive: true });
                    }
                    // Записываем содержимое файла
                    const fileContent = typeof content === 'function'
                        ? JSON.stringify(content(projectName), null, 2)
                        : typeof content === 'object'
                            ? JSON.stringify(content, null, 2)
                            : content;
                    await writeFile(filePath, fileContent);
                }
                // Создаем deps.json
                const depsJson = {
                    dependencies: template.dependencies || {},
                    devDependencies: template.devDependencies || {}
                };
                await writeFile(join(projectPath, 'deps.json'), JSON.stringify(depsJson, null, 2));
                console.log(chalk.green(`✨ Проект ${projectName} успешно создан!`));
                // Устанавливаем зависимости если есть packageManager
                if (context.packageManager) {
                    console.log(chalk.hex('#4B5320')('📦 Установка зависимостей...'));
                    try {
                        // Создаем новый PackageManager для директории проекта
                        const projectPackageManager = new PackageManager(projectPath);
                        // Читаем deps.json
                        const depsContent = await readFile(join(projectPath, 'deps.json'), 'utf-8');
                        const deps = JSON.parse(depsContent);
                        // Читаем package.json если он существует
                        let packageJson = {};
                        try {
                            const packageJsonContent = await readFile(join(projectPath, 'package.json'), 'utf-8');
                            packageJson = JSON.parse(packageJsonContent);
                        }
                        catch (err) {
                            // Если package.json не существует, игнорируем ошибку
                        }
                        // Объединяем зависимости из обоих файлов
                        const allDependencies = {
                            dependencies: { ...deps.dependencies, ...packageJson.dependencies },
                            devDependencies: { ...deps.devDependencies, ...packageJson.devDependencies }
                        };
                        // Устанавливаем обычные зависимости
                        if (Object.keys(allDependencies.dependencies).length > 0) {
                            await projectPackageManager.installDependencies(Object.entries(allDependencies.dependencies).map(([name, version]) => `${name}@${version}`));
                        }
                        // Устанавливаем dev-зависимости
                        if (Object.keys(allDependencies.devDependencies).length > 0) {
                            await projectPackageManager.installDependencies(Object.entries(allDependencies.devDependencies).map(([name, version]) => `${name}@${version}`), true // устанавливаем как devDependencies
                            );
                        }
                        console.log(chalk.green('✨ Зависимости успешно установлены!'));
                    }
                    catch (error) {
                        console.error(chalk.red(`❌ Ошибка при установке зависимостей: ${error.message}`));
                    }
                }
                // Выводим инструкции
                console.log('\nДля запуска проекта выполните:');
                if (projectName !== '.') {
                    console.log(chalk.hex('#4A5D23')(`  cd ${projectName}`));
                }
                console.log(chalk.hex('#4A5D23')('  rpg run dev'));
            }
            catch (error) {
                console.error(chalk.red(`❌ Ошибка: ${error.message}`));
            }
        });
    }
};
export default plugin;
