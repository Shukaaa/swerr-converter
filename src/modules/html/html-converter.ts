import {LogUtils, SwerrScheme} from "@swerr/core";
import {htmlBoilerplate} from "./html-boilerplate.js";
import fs from "node:fs";
import {HtmlConverterConfig} from "./html-converter-config.js";

export const htmlConverter = async (config: HtmlConverterConfig, scheme: SwerrScheme) => {
	if (!config.outputPath) {
		LogUtils.error("No output path specified in the markdown converter configuration.")
		return;
	}
	
	const html = htmlBoilerplate(config, scheme);
	const fileName = config.fileName || "swerr-docs.html";
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
		await fs.promises.writeFile(outputFilePath, html);
		LogUtils.success(`HTML documentation saved to ${outputFilePath}`);
	} catch (err) {
		LogUtils.error(`Failed to save HTML documentation: ${err}`);
	}
}
