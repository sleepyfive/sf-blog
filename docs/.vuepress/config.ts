import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { resolve } from "path";
import dirTree from "directory-tree";


const toSidebarOption= (tree = []) => {
    if (!Array.isArray(tree)) return [];

    const isDirectory = (v) => v.children !== undefined

    let t = tree.map((v) => {
        if (isDirectory(v)) {
            return {
                text: v.name,
                collapsible: true,
                children: toSidebarOption(v.children),
            };
        } else {
            const link = v.path.split('docs')[1]
            const text = link === '/README.md' ? "首页" : v.name.replace(/\.md$/, "")
            return {
               text,
               link 
            }
        }
    });
    const idx = t.findIndex(v => v.text === '首页')
    if(idx!==-1) {
        t = [t[idx], ...t.filter((_,i) => i !== idx )]
    }
    return t
}

const autoGetSidebarOptionBySrcDir = (srcPath) => {
    const srcDir = dirTree(srcPath, {
        extensions: /\.md$/,
        normalizePath: true,
        exclude: [/\.vuepress/]
    });
    const sidebar = toSidebarOption(srcDir.children);
    return sidebar
}

const BASE = '/sf-blog/'

export default defineUserConfig<DefaultThemeOptions>({
  // 站点配置
  lang: 'zh-CN',
  title: 'sf',
  description: '博客',
  dest: resolve(__dirname, '..','..','dist'),
  base: BASE,
  head: [
      ['link', { rel: 'icon', href: BASE+'favicon.ico' }],
  ],

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/logo.jpg',
    sidebar: autoGetSidebarOptionBySrcDir(resolve(__dirname, "..",)),
  },
  bundler: '@vuepress/bundler-vite',
});