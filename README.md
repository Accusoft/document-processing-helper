# document-processing-helper (BETA)

Simple node.js helper for document processing, powered by PrizmDoc Server. You can use this helper with either [PrizmDoc Cloud](https://cloud.accusoft.com) or your own self-hosted PrizmDoc Server.

If you don't have your own PrizmDoc Server instance, the easiest way to get started is with [PrizmDoc Cloud](https://cloud.accusoft.com). Sign up for a free trial account to get an API key at https://cloud.accusoft.com/.

**Requires node 8 or higher.**

## Installation

```bash
npm install @accusoft/document-processing-helper
```

## Example Usage

### Converting a JPEG to PDF

```js
const Helper = require('@accusoft/document-processing-helper');

async function main() {
  const documentProcessingHelper = new Helper({
    prizmDocServerBaseUrl: 'https://api.accusoft.com',
    apiKey: 'YOUR_API_KEY'
  });

  // Initialize a conversion
  const output = await documentProcessingHelper.convert({
      input: 'input.jpeg',
      outputFormat: 'pdf'
    });

  // Download the output and save the file
    await output[0].saveToFile('output.pdf');
}

main();
```

### Converting a multipage PDF to PNG files (one PNG per page)

```js
const Helper = require('@accusoft/document-processing-helper');

async function main() {
  const documentProcessingHelper = new Helper({
    prizmDocServerBaseUrl: 'https://api.accusoft.com',
    apiKey: 'YOUR_API_KEY'
  });

  // Initialize a conversion
  const output = await documentProcessingHelper.convert({
      input: 'input.pdf',
      outputFormat: 'png'
    });

  // Save each ouput PNG file
  for (let i = 0; i < output.length; i++) {
    await output[i].saveToFile('page-' + i + '.png');
  }
}

main();
```

## API Reference

### Class: `Helper`

#### Constructor

- `argumentsObject` (object)
  - `prizmDocServerBaseUrl` (string) **Required.** Location of your PrizmDoc Server.
  - `apiKey` (string)  **Required for PrizmDoc Cloud.** Your [PrizmDoc Cloud](https://cloud.accusoft.com) API key.

#### `convert(argumentsObject)`

Converts a document from one file type to another.

- `argumentsObject` (object)
  - `input` (string, buffer, stream) **Required.** File path, buffer, or stream of the input file to convert
  - `outputFormat` (string) **Required.** Output format. Must be one of the following values:
    - `"pdf"`
    - `"docx"` - Input must be a PDF.
    - `"tiff"`
    - `"jpeg"` - Produces multiple output files, one per page.
    - `"png"` - Produces multiple output files, one per page.

- Returns: Output[] - Array of [Output](#output) instances.

### Class: `Output`

#### `saveToFile(filepath)`

Saves the result of a conversion to a file.

- `filepath` (string) **Required.** Path, including filename, where the output should be saved.
