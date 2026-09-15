import { defineConfig } from 'vite';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const base = process.env.GITHUB_ACTIONS ? `/${repository}/` : '/';

export default defineConfig({
  base
});
