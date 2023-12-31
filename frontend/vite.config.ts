import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  // Checking environement files
  const envFile = loadEnv(mode, process.cwd());
  const envs = { ...process.env, ...envFile };
  const hasEnvFile = Object.keys(envFile).length;

  // Proxy variables
  const headers = {
    cookie: `oneSessionId=${envs.VITE_ONE_SESSION_ID};authenticated=true; XSRF-TOKEN=${envs.VITE_XSRF_TOKEN}`,
  };
  const resHeaders = hasEnvFile
    ? {
        "set-cookie": [
          `oneSessionId=${envs.VITE_ONE_SESSION_ID}`,
          `XSRF-TOKEN=${envs.VITE_XSRF_TOKEN}`,
        ],
        "Cache-Control": "public, max-age=300",
      }
    : {};

  const proxyObj = hasEnvFile
    ? {
        target: envs.VITE_RECETTE,
        changeOrigin: true,
        headers,
      }
    : {
        target: envs.VITE_LOCALHOST || "http://localhost:8090",
        changeOrigin: false,
      };

  const proxy = {
    "/applications-list": proxyObj,
    "/resources-applications": proxyObj,
    "/conf/public": proxyObj,
    "^/(?=help-1d|help-2d)": proxyObj,
    "^/(?=assets)": proxyObj,
    "^/(?=theme|locale|i18n|skin)": proxyObj,
    "^/(?=auth|appregistry|cas|userbook|directory|communication|conversation|portal|session|timeline|workspace|infra)":
      proxyObj,
    "/blog": proxyObj,
    "/explorer": proxyObj,
    "/mindmap": proxyObj,
    "/pocediteur": proxyObj,
    "/video": proxyObj,
    // needed for linker (behaviours)
    "/actualites/linker/infos": proxyObj,
    "/collaborativewall/list/all": proxyObj,
    "/community/listallpages": proxyObj,
    "/exercizer/subjects-scheduled": proxyObj,
    "/formulaire/forms/linker": proxyObj,
    "/forum/categories": proxyObj,
    "/homeworks/list": proxyObj,
    "/magneto/boards/editable": proxyObj,
    "/mindmap/list/all": proxyObj,
    "/pages/list/all": proxyObj,
    "/poll/list/all": proxyObj,
    "/scrapbook/list/all": proxyObj,
    "/timelinegenerator/timelines": proxyObj,
    "/wiki/listallpages": proxyObj,
  };

  const base = mode === "production" ? "/tiptap" : "";

  const build = {
    assetsDir: "public",
    /* rollupOptions: {
      external: ["edifice-ts-client"],
      output: {
        paths: {
          "edifice-ts-client": "/assets/js/edifice-ts-client/index.js",
        },
      },
    }, */
  };

  const plugins = [react(), tsconfigPaths()];

  const server = {
    proxy,
    host: "0.0.0.0",
    port: 3000,
    headers: resHeaders,
    open: true,
  };

  return defineConfig({
    base,
    build,
    plugins,
    server,
  });
};
