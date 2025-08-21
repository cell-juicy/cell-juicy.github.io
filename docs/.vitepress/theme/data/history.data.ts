import { normalizePath } from 'vite'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

import type { SiteConfig } from 'vitepress';


interface CommitInfo {
    time: Date,
    hash: string,
    author: string,
    message: string,
    status: string
}

export default {
    watch: ['**/*.md'],

    load(watchFiles: string[]) {
        const config: SiteConfig = (global as any).VITEPRESS_CONFIG
        if (!config) {
            throw new Error("content loader invoked without an active vitepress process, or before vitepress config is resolved.")
        };

        if (!config.lastUpdated) return [];

        let logOutput = "";
        try {
            logOutput = execFileSync(
                "git",
                ["log", "--name-status", "-z", "--format=%n%x00%x00%x00%ct%x00%x00%h%x00%x00%an%x00%x00%s%x00%x00%n", "--", "*.md"],
                { encoding: "utf-8" }
            );
        } catch (e) {
            if (e.code === "ENOENT") {
                console.warn("[Juicy Theme] Error: Git is not installed or not available in PATH. Please install Git to use this feature.");
                return [];
            }
            console.error("[Juicy Theme] Error: Data loader failed to fetch Git commit history. Throw error:", e);
            return [];
        };

        const rawCommit = logOutput.split("\x00\x00\x00");
        rawCommit.shift();

        const commits = rawCommit.map((raw) => {
            const parts = raw.split("\x00\x00");
            const time = new Date(Number(parts[0]) * 1000);
            const hash = parts[1];
            const author = parts[2];
            const message = parts.slice(3, -1).join("\x00\x00");
            const filesRaw = parts[parts.length - 1].trim().split("\x00").filter(Boolean);
            const files: { status: string, path: string }[] = [];
            for (let i=0; i<filesRaw.length; i+=2) {
                const status = filesRaw[i].trim();
                const path = filesRaw[i+1];
                files.push({ status, path });
            }
            return { time, hash, author, message, files };
        });

        const fileCommitMap = new Map<string, CommitInfo[]>();
        for (const commit of commits) {
            for (const f of commit.files) {
                if (!fileCommitMap.has(f.path)) fileCommitMap.set(f.path, []);
                fileCommitMap.get(f.path)!.push({
                    time: commit.time,
                    hash: commit.hash,
                    author: commit.author,
                    message: commit.message,
                    status: f.status
                });
            };
        };

        return watchFiles.map((file) => {
            const url =
                '/' +
                normalizePath(path.relative(config.srcDir, file))
                    .replace(/(^|\/)index\.md$/, '$1')
                    .replace(/\.md$/, config.cleanUrls ? '' : '.html');

            const history = fileCommitMap.get(file) ?? [];
            return { path: file, url, history };
        });
    }
};
