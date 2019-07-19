const PrizmdocRestClient = require('@accusoft/prizmdoc-rest-client');
const fs = require('fs');

class DocumentProcessingHelper {
  constructor(options) {
    this._prizmdocServer = new PrizmdocRestClient({
      baseUrl: options.prizmDocServerBaseUrl,
      headers: {
        'Acs-Api-Key': options.apiKey
      }
    });
  }

  async convert(params) {
    const prizmdocServer = this._prizmdocServer;
    const session = prizmdocServer.createAffinitySession();

    let res;

    let input = params.input;

    if (typeof input === 'string') {
      try {
        input = fs.readFileSync(input);
      } catch (err) {
        throw err;
      }
    }
    res = await session.post('/PCCIS/V1/WorkFile', {
      body: input
    });
    const inputWorkFile = await res.json();

    let processInput = {
      sources: [
        {
          fileId: inputWorkFile.fileId
        }
      ],
      dest: {
        format: params.outputFormat
      }
    };

    if (params.outputFormat === 'docx') {
      processInput._features = {
        pdfToDocx: {
          enabled: true
        }
      };
    }

    res = await session.post('/v2/contentConverters', {
      body: JSON.stringify({input: processInput})
    });
    let process = await res.json();

    process = await session.getFinalProcessStatus(`/v2/contentConverters/${process.processId}`);

    if (process.state !== 'complete') {
      throw new Error(`The process failed to complete: ${JSON.stringify(process, null, 2)}`);
    }

    return process.output.results.map((result) => {

      return {
        fileId: result.fileId,
        affinityToken: result.affinityToken,
        saveToFile: function (filepath) {
          return new Promise(async (resolve, reject) => {
            let filedata = await session.get(`/PCCIS/V1/WorkFile/${result.fileId}`);
            let writeableStream = filedata.body.pipe(fs.createWriteStream(filepath));
            writeableStream.once('close', resolve);
            writeableStream.once('error', reject);
          });
        }
      };
    });
  }
}

module.exports = DocumentProcessingHelper;
