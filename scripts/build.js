import * as esbuild from "esbuild";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const watch = process.argv.includes("--watch");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bin = (name) => resolve(root, "node_modules/.bin", name);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function typecheck() {
  run(bin("tsc"), ["--noEmit"]);
}

const esbuildOptions = {
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  format: "iife",
  globalName: "NoiaUI",
  platform: "browser",
  target: "es2023",
  minify: !watch,
};

function compileCss(watchMode) {
  const args = [
    "src/styles/style.scss",
    "dist/style.css",
    "--no-source-map",
    `--style=${watchMode ? "expanded" : "compressed"}`,
  ];
  if (watchMode) args.push("--watch");
  return spawn(bin("sass"), args, { stdio: "inherit" });
}

function bundleTypes() {
  run(bin("dts-bundle-generator"), [
    "-o",
    "dist/index.d.ts",
    "src/index.ts",
    "--no-banner",
  ]);
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
typecheck();

if (watch) {
  const ctx = await esbuild.context(esbuildOptions);
  await ctx.watch();
  compileCss(true);
  console.log("Watching for changes…");
} else {
  await esbuild.build(esbuildOptions);
  await new Promise((resolve, reject) => {
    const child = compileCss(false);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`sass exited ${code}`));
    });
  });
  bundleTypes();
}
