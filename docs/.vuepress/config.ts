import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { resolve } from "path";
import dirTree from "directory-tree";


const toSidebarOption= (tree = []) => {
    if (!Array.isArray(tree)) return [];

    const isDirectory = (v) => v.children !== undefined

    const t = tree.map((v) => {
        if (isDirectory(v)) {
            return {
                text: v.name,
                collapsable: false,
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


export default defineUserConfig<DefaultThemeOptions>({
  // 站点配置
  lang: 'zh-CN',
  title: 'sf',
  description: '博客',

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/logo.jpg',
    sidebar: autoGetSidebarOptionBySrcDir(resolve(__dirname, "..",)),
  },
  bundler: '@vuepress/bundler-vite',
});