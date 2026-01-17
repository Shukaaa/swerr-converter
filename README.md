# Swerr Converter

This library contains multiple useful converters to transform error definitions into various formats such as Markdown, HTML, and more. <br>
Swerr is designed to be easily extendable, allowing developers to add custom converters as needed. <br>

## Installation

To install Swerr Converter, use npm:

```bash
npm install @swerr/converter
```

## Usage

First, ensure the Swerr cli is installed and you have a `swerr.config.js` file in your project root. You can create one manually or run:

```bash
npm install -g @swerr/cli
swerr init
```

Once you have your configuration file set up, you can run the swerr configuration with:

```bash
swerr run
```

This command will generate the error documentation based on your JSDoc comments and the settings in your `swerr.config.js` file.

## Documentation

https://swerr.apidocumentation.com