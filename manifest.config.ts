import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

const [major, minor, patch, label = "0"] = version
  .replace(/[^\d.-]+/g, "")
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: "BundleReplacer",
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  side_panel: {
    default_path: "index.html",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content-script.ts"],
      run_at: "document_start",
    },
  ],
  icons: {
    "16": "icons/16.png",
    "32": "icons/32.png",
    "48": "icons/48.png",
    "64": "icons/64.png",
    "128": "icons/128.png",
    "256": "icons/256.png",
  },
  permissions: ["storage", "sidePanel", "tabs"],
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
}));
