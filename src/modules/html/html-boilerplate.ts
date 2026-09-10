import {SwerrScheme} from "@swerr/core";
import {HtmlConverterConfig} from "./html-converter-config.js";

const escapeHtml = (value: unknown): string => String(value ?? "")
	.replace(/[&<>"']/g, character => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;"
	}[character] ?? character));

export const htmlBoilerplate = (config: HtmlConverterConfig, scheme: SwerrScheme) => {
	const schemeName = escapeHtml(scheme.name || "Untitled scheme");
	const schemeVersion = escapeHtml(scheme.version || "0.0.0");
	const schemeDescription = escapeHtml(scheme.description || "A curated catalog of application errors.");
	const errors = scheme.errors ?? [];
	const errorRows = errors.map((error, index) => {
		const name = escapeHtml(error.name);
		const description = escapeHtml(error.description);
		const searchValue = escapeHtml(`${error.name} ${error.description}`.toLowerCase());

		return `
					<tr class="error-row" data-search="${searchValue}">
						<td>
							<div class="error-name">
								<span class="error-index">${String(index + 1).padStart(2, "0")}</span>
								<code>${name}</code>
							</div>
						</td>
						<td class="description">${description}</td>
					</tr>`;
	}).join("");

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="theme-color" content="#0f1117">
	<meta name="description" content="${schemeDescription}">
	<title>${schemeName} · Error catalog</title>
	<style>
		:root {
			color-scheme: dark;
			--bg: #0f1117;
			--panel: #171a22;
			--panel-light: #1d222d;
			--table-head: #1c2029;
			--input-bg: #10131a;
			--line: #2a3040;
			--text: #f5f7ff;
			--muted: #9aa3b5;
			--description: #c5cbe0;
			--accent: #d24747;
			--accent-bright: #ff8d8d;
			--selection: rgba(210, 71, 71, .35);
		}

		:root[data-theme="light"] {
			color-scheme: light;
			--bg: #f4f5f7;
			--panel: #ffffff;
			--panel-light: #f0f1f4;
			--table-head: #f7f7f8;
			--input-bg: #ffffff;
			--line: #dfe2e8;
			--text: #1c1e24;
			--muted: #687080;
			--description: #4b5563;
			--accent: #bf3636;
			--accent-bright: #a32626;
			--selection: rgba(191, 54, 54, .2);
		}

		* { box-sizing: border-box; }

		::selection {
			background: var(--selection);
			color: #fff;
		}

		body {
			margin: 0;
			min-width: 320px;
			background: var(--bg);
			color: var(--text);
			font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			line-height: 1.6;
		}

		.container {
			width: min(1040px, calc(100% - 40px));
			margin: 0 auto;
		}

		header {
			padding: 42px 0 30px;
		}

		.hero {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: end;
			gap: 20px;
		}

		.eyebrow {
			margin: 0 0 10px;
			color: var(--muted);
			font-size: .78rem;
			font-weight: 800;
			letter-spacing: .08em;
			text-transform: uppercase;
		}

		h1 {
			max-width: 780px;
			margin: 0;
			font-size: clamp(2rem, 4vw, 3.1rem);
			font-weight: 700;
			letter-spacing: -.04em;
			line-height: 1.08;
		}

		.hero-copy {
			max-width: 680px;
			margin: 14px 0 0;
			color: var(--muted);
			font-size: 1rem;
		}

		.sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}

		.version {
			display: inline-flex;
			align-items: center;
			gap: 9px;
			padding: 8px 11px;
			border: 1px solid var(--line);
			border-radius: 8px;
			background: transparent;
			color: var(--accent-bright);
			font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
			font-size: .82rem;
			white-space: nowrap;
		}

		.version::before {
			width: 7px;
			height: 7px;
			border-radius: 50%;
			background: var(--accent);
			content: "";
		}

		.hero-actions {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.theme-toggle {
			padding: 8px 11px;
			border: 1px solid var(--line);
			border-radius: 8px;
			background: transparent;
			color: var(--muted);
			cursor: pointer;
			font: inherit;
			font-size: .78rem;
			white-space: nowrap;
		}

		.theme-toggle:hover,
		.theme-toggle:focus-visible {
			border-color: var(--accent);
			color: var(--accent-bright);
			outline: none;
		}

		main { padding-bottom: 40px; }

		.catalog {
			border: 1px solid var(--line);
			background: var(--panel);
			overflow: hidden;
			border-radius: 12px;
		}

		.catalog-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			padding: 22px 24px;
			border-bottom: 1px solid var(--line);
		}

		.catalog-title {
			margin: 0;
			font-size: 1.2rem;
			letter-spacing: -.02em;
		}

		.catalog-subtitle {
			margin: 4px 0 0;
			color: var(--muted);
			font-size: .9rem;
		}

		.search {
			width: min(300px, 100%);
			padding: 10px 13px 10px 38px;
			border: 1px solid var(--line);
			border-radius: 8px;
			outline: none;
			background: var(--input-bg);
			color: var(--text);
			font: inherit;
			font-size: .88rem;
			transition: border-color .2s;
		}

		.search-wrap { position: relative; }

		.search-wrap::before {
			position: absolute;
			top: 50%;
			left: 15px;
			color: var(--muted);
			content: "⌕";
			font-size: 1.35rem;
			line-height: 1;
			transform: translateY(-54%);
		}

		.search:focus {
			border-color: var(--accent);
			box-shadow: 0 0 0 2px rgba(210, 71, 71, .18);
		}

		.table-wrap { overflow-x: auto; }

		table {
			width: 100%;
			border-collapse: collapse;
			min-width: 640px;
		}

		th {
			padding: 15px 30px;
			background: var(--table-head);
			color: var(--muted);
			font-size: .72rem;
			font-weight: 800;
			letter-spacing: .12em;
			text-align: left;
			text-transform: uppercase;
		}

		td {
			padding: 21px 30px;
			border-top: 1px solid var(--line);
			vertical-align: middle;
		}

		.error-row {
			transition: background .2s;
		}

		.error-row:hover { background: var(--panel-light); }

		.error-name {
			display: flex;
			align-items: center;
			gap: 14px;
		}

		.error-index {
			color: var(--muted);
			font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
			font-size: .72rem;
		}

		code {
			padding: 7px 10px;
			border: 1px solid rgba(210, 71, 71, .3);
			border-radius: 6px;
			background: rgba(210, 71, 71, .1);
			color: var(--accent-bright);
			font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
			font-size: .86rem;
			font-weight: 700;
		}

		.description { color: var(--description); }

		.empty-state {
			display: none;
			padding: 58px 30px;
			color: var(--muted);
			text-align: center;
		}

		.empty-state strong {
			display: block;
			margin-bottom: 5px;
			color: var(--text);
			font-size: 1.05rem;
		}

		footer {
			padding: 24px 0 48px;
			color: var(--muted);
			font-size: .78rem;
			text-align: center;
		}

		@media (max-width: 720px) {
			.container { width: min(100% - 28px, 1180px); }
			header { padding-top: 34px; }
			.hero { display: block; }
			.hero-actions { margin-top: 24px; }
			.catalog-header { align-items: stretch; flex-direction: column; padding: 22px; }
			.search { width: 100%; }
			th, td { padding-right: 22px; padding-left: 22px; }
		}

	</style>
</head>
<body>
	<header class="container">
		<div class="hero">
			<div>
				<p class="eyebrow">Error catalog</p>
				<h1>${schemeName} Error Catalog</h1>
				<p class="hero-copy">${schemeDescription}</p>
			</div>
			<div class="hero-actions">
				<button class="theme-toggle" id="theme-toggle" type="button" aria-pressed="false">Light theme</button>
				<div class="version">v${schemeVersion}</div>
			</div>
		</div>
	</header>

	<main class="container">
		<section class="catalog" aria-labelledby="catalog-title">
			<div class="catalog-header">
				<div>
					<h2 id="catalog-title" class="catalog-title">Error catalog</h2>
					<p class="catalog-subtitle"><span id="visible-count">${errors.length}</span> entries</p>
				</div>
				<label class="search-wrap">
					<span class="sr-only">Search errors</span>
					<input class="search" id="error-search" type="search" placeholder="Search errors..." autocomplete="off">
				</label>
			</div>
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th scope="col">Error</th>
							<th scope="col">Description</th>
						</tr>
					</thead>
					<tbody id="error-list">${errorRows}</tbody>
				</table>
				<div class="empty-state" id="empty-state">
					<strong>No matching errors</strong>
					Try a different name or description.
				</div>
			</div>
		</section>
	</main>

	<footer class="container">Built with <strong>Swerr</strong> · ${schemeName}</footer>

	<script>
		const themeToggle = document.getElementById('theme-toggle');
		const themeMeta = document.querySelector('meta[name="theme-color"]');
		const root = document.documentElement;

		const applyTheme = theme => {
			root.dataset.theme = theme;
			const isDark = theme === 'dark';
			themeToggle.textContent = isDark ? 'Light theme' : 'Dark theme';
			themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
			themeToggle.setAttribute('aria-pressed', String(!isDark));
			themeMeta.setAttribute('content', isDark ? '#0f1117' : '#f4f5f7');
		};

		applyTheme('dark');
		themeToggle.addEventListener('click', () => {
			applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
		});

		const search = document.getElementById('error-search');
		const rows = Array.from(document.querySelectorAll('.error-row'));
		const emptyState = document.getElementById('empty-state');
		const visibleCount = document.getElementById('visible-count');

		search.addEventListener('input', () => {
			const query = search.value.trim().toLowerCase();
			let visible = 0;

			rows.forEach(row => {
				const matches = row.dataset.search.includes(query);
				row.hidden = !matches;
				if (matches) visible += 1;
			});

			visibleCount.textContent = visible;
			emptyState.style.display = visible === 0 ? 'block' : 'none';
		});
	</script>
</body>
</html>
`;
};
