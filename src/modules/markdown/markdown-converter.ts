import {MarkdownConverterConfig} from "./markdown-converter-config.js";
import {LogUtils, SwerrScheme} from "@swerr/core";
import * as fs from "node:fs";

export const markdownConverter = async (config: MarkdownConverterConfig, scheme: SwerrScheme) => {
	LogUtils.info("Starting markdown conversion")
	
	if (!config.outputPath) {
		LogUtils.error("No output path specified in the markdown converter configuration.")
		return;
	}
	
	const content = createMarkdownContent(scheme);
	const fileName = config.fileName || "README.md";
	const outputFilePath = `${config.outputPath}/${fileName}`;
	
	if (!fs.existsSync(config.outputPath)) {
		try {
			await fs.promises.mkdir(config.outputPath, {recursive: true});
			LogUtils.info(`Created output directory at ${config.outputPath}`);
		} catch (err) {
			LogUtils.error(`Failed to create output directory at ${config.outputPath}: ${err}`);
			return;
		}
	}
	
	try {
		await fs.promises.writeFile(outputFilePath, content);
		LogUtils.success(`Markdown documentation saved to ${outputFilePath}`);
	} catch (err) {
		LogUtils.error(`Failed to save markdown documentation: ${err}`);
	}
}

function createMarkdownContent(scheme: SwerrScheme): string {
	let content = `# Error Documentation / Catalog`;
	
	if (scheme.name) content += ` (${scheme.name}`;
	if (scheme.version) content += ` v${scheme.version}`;
	if (scheme.name) content += `)`;
	
	content += `\n\n`;
	content += scheme.description + `\n\n`;
	content += `## Error Catalog\n\n`;
	content += createErrorTable(scheme);
	
	return content;
}

function createErrorTable(scheme: SwerrScheme): string {
	let table = `| Error | Description |\n|------------|-------------|\n`;
	for (const error of scheme.errors) {
		table += `| ${error.name} | ${error.description} |\n`;
	}
	return table;
}