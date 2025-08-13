#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 检查 Vercel 部署准备状态...\n');

const checks = [
  {
    name: 'vercel.json 配置文件',
    check: () => fs.existsSync('vercel.json'),
    fix: '请确保项目根目录存在 vercel.json 文件'
  },
  {
    name: '.vercelignore 文件',
    check: () => fs.existsSync('.vercelignore'),
    fix: '请确保项目根目录存在 .vercelignore 文件'
  },
  {
    name: 'package.json 构建脚本',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts && pkg.scripts.build && pkg.scripts['build:vercel'];
    },
    fix: '请确保 package.json 包含 build 和 build:vercel 脚本'
  },
  {
    name: 'Next.js 配置兼容性',
    check: () => {
      const config = fs.readFileSync('next.config.js', 'utf8');
      return config.includes('process.env.VERCEL') && config.includes('vercel.app');
    },
    fix: 'Next.js 配置需要包含 Vercel 特定设置'
  },
  {
    name: 'Prisma 生成脚本',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts && pkg.scripts.postinstall && pkg.scripts.postinstall.includes('prisma generate');
    },
    fix: '请确保 package.json 包含 postinstall 脚本用于 Prisma 生成'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   💡 ${check.fix}\n`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 所有检查通过！项目已准备好部署到 Vercel');
  console.log('\n📋 下一步：');
  console.log('1. git add . && git commit -m "Ready for Vercel deployment"');
  console.log('2. git push origin main');
  console.log('3. 在 Vercel 上导入项目');
  console.log('4. 设置环境变量：NEXT_PUBLIC_STORAGE_TYPE=indexeddb');
  console.log('5. 部署！');
} else {
  console.log('⚠️  发现问题，请修复后重新运行检查');
  process.exit(1);
}

console.log('\n📖 详细部署指南请查看 VERCEL_DEPLOYMENT.md');