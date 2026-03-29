import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import { presetWind3, presetAttributify, presetTypography } from "unocss"; // 🌟 新增引入
import autoImport from "unplugin-auto-import/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss({
      // 🌟 在这里注入 UnoCSS 的预设配置
      presets: [
        presetWind3(), 
        presetAttributify(), 
        presetTypography() // 🌟 开启这个，Typora 的 prose 样式才会生效
      ],
      // 可选：如果你想让样式更像 Typora，可以在这里加一些快捷类
      shortcuts: {
        'typora-bg': 'bg-[#f9f9f9] dark:bg-[#282c34]',
      }
    }),
    react(),
    autoImport({
      imports: ["react"],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/hooks", "src/stores", "src/components/**"]
    })
  ],
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`
    }
  },
  build: {
    minify: true,
    reportCompressedSize: false
  }
});