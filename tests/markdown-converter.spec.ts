import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:fs", () => {
	return {
		existsSync: vi.fn(),
		promises: {
			mkdir: vi.fn(),
			writeFile: vi.fn()
		}
	};
});

vi.mock("@swerr/core", () => ({
	LogUtils: {
		info: vi.fn(),
		error: vi.fn(),
		success: vi.fn()
	}
}));

import * as fs from "node:fs";
import { LogUtils } from "@swerr/core";
import { markdownConverter } from "../src/modules/markdown/markdown-converter.js";

const sampleScheme = {
	name: "MyScheme",
	version: "1.2.3",
	description: "Scheme description",
	errors: [
		{ name: "ERR_ONE", description: "First error" },
		{ name: "ERR_TWO", description: "Second error" }
	]
} as any;

beforeEach(() => {
	vi.clearAllMocks();
});

describe("markdownConverter", () => {
	it("logs error and returns when no outputPath provided", async () => {
		await markdownConverter({} as any, sampleScheme);
		expect((LogUtils as any).error).toHaveBeenCalled();
		expect((fs.promises.writeFile as any)).not.toHaveBeenCalled();
	});
	
	it("creates directory and writes file when directory does not exist", async () => {
		(fs.existsSync as any).mockReturnValue(false);
		(fs.promises.mkdir as any).mockResolvedValue(undefined);
		(fs.promises.writeFile as any).mockResolvedValue(undefined);
		
		await markdownConverter({ outputPath: "/out/path", fileName: "DOC.md" }, sampleScheme);
		
		expect(fs.existsSync).toHaveBeenCalledWith("/out/path");
		expect(fs.promises.mkdir).toHaveBeenCalledWith("/out/path", { recursive: true });
		expect(fs.promises.writeFile).toHaveBeenCalled();
		const writtenPath = (fs.promises.writeFile as any).mock.calls[0][0];
		const writtenContent = (fs.promises.writeFile as any).mock.calls[0][1];
		expect(writtenPath).toBe("/out/path/DOC.md");
		expect(writtenContent).toContain("# Error Documentation / Catalog");
		expect((LogUtils as any).success).toHaveBeenCalled();
	});
	
	it("writes file when directory exists", async () => {
		(fs.existsSync as any).mockReturnValue(true);
		(fs.promises.writeFile as any).mockResolvedValue(undefined);
		
		await markdownConverter({ outputPath: "/existing", fileName: "README.md" }, sampleScheme);
		
		expect(fs.existsSync).toHaveBeenCalledWith("/existing");
		expect(fs.promises.mkdir).not.toHaveBeenCalled();
		expect(fs.promises.writeFile).toHaveBeenCalledWith("/existing/README.md", expect.any(String));
		expect((LogUtils as any).success).toHaveBeenCalled();
	});
	
	it("logs error and does not write when mkdir fails", async () => {
		(fs.existsSync as any).mockReturnValue(false);
		(fs.promises.mkdir as any).mockRejectedValue(new Error("mkdir failed"));
		
		await markdownConverter({ outputPath: "/bad", fileName: "F.md" }, sampleScheme);
		
		expect(fs.promises.mkdir).toHaveBeenCalled();
		expect((LogUtils as any).error).toHaveBeenCalled();
		expect(fs.promises.writeFile).not.toHaveBeenCalled();
	});
});
