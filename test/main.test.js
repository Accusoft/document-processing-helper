const joinPath = require('path').join;
const fs = require('fs');
const util = require('util');
const Helper = require('../lib/main');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rimraf = require('rimraf');
const expect = chai.expect;
const readFile = util.promisify(fs.readFile);

const documentProcessingHelper = new Helper({
  prizmDocServerBaseUrl: process.env.BASE_URL,
  apiKey: process.env.API_KEY
});

chai.use(chaiAsPromised);

describe('documentProcessingHelper', () => {
  before(() => {
    rimraf.sync(joinPath(__dirname, '../test-output'));
    fs.mkdirSync(joinPath(__dirname, '../test-output'));
  });

  it('converts a docx to a pdf', async () => {
    const output = await documentProcessingHelper.convert({
      input: joinPath(__dirname, 'documents/test.docx'),
      outputFormat: 'pdf'
    });
    await output[0].saveToFile(joinPath(__dirname, '../test-output/output.pdf'));
    expect(fs.existsSync(joinPath(__dirname, '../test-output/output.pdf'))).to.equal(true);
  });

  it('converts a pdf to a docx', async () => {
    const output = await documentProcessingHelper.convert({
      input: joinPath(__dirname, 'documents/test.pdf'),
      outputFormat: 'docx'
    });
    await output[0].saveToFile(joinPath(__dirname, '../test-output/output.docx'));
    expect(fs.existsSync(joinPath(__dirname, '../test-output/output.docx'))).to.equal(true);
  });

  it('converts a docx to a tiff', async () => {
    const output = await documentProcessingHelper.convert({
      input: joinPath(__dirname, 'documents/test.docx'),
      outputFormat: 'tiff'
    });
    await output[0].saveToFile(joinPath(__dirname, '../test-output/output.tiff'));
    expect(fs.existsSync(joinPath(__dirname, '../test-output/output.tiff'))).to.equal(true);
  });

  it('converts a docx to a jpeg', async () => {
    const output = await documentProcessingHelper.convert({
      input: joinPath(__dirname, 'documents/test.docx'),
      outputFormat: 'jpeg'
    });
    for (let i = 0; i < output.length; i++) {
      await output[i].saveToFile(joinPath(__dirname, '../test-output/output-page-' + i + '.jpeg'));
      expect(fs.existsSync(joinPath(__dirname, '../test-output/output-page-' + i + '.jpeg'))).to.equal(true);
    }
  });

  it('converts a docx to a png', async () => {
    const output = await documentProcessingHelper.convert({
      input: joinPath(__dirname, 'documents/test.docx'),
      outputFormat: 'png'
    });
    for (let i = 0; i < output.length; i++) {
      await output[i].saveToFile(joinPath(__dirname, '../test-output/output-page-' + i + '.png'));
      expect(fs.existsSync(joinPath(__dirname, '../test-output/output-page-' + i + '.png'))).to.equal(true);
    }
  });

  it('converts a docx buffer to a tiff', async () => {
    const file = await readFile(joinPath(__dirname, 'documents/test.docx'));
    const output = await documentProcessingHelper.convert({
      input: file,
      outputFormat: 'tiff'
    });
    await output[0].saveToFile(joinPath(__dirname, '../test-output/output-from-buffer.tiff'));
    expect(fs.existsSync(joinPath(__dirname, '../test-output/output-from-buffer.tiff'))).to.equal(true);
  });

  it('converts a docx stream to a tiff', async () => {
    const file = await fs.createReadStream(joinPath(__dirname, 'documents/test.docx'));
    const output = await documentProcessingHelper.convert({
      input: file,
      outputFormat: 'tiff'
    });
    await output[0].saveToFile(joinPath(__dirname, '../test-output/output-from-stream.tiff'));
    expect(fs.existsSync(joinPath(__dirname, '../test-output/output-from-stream.tiff'))).to.equal(true);
  });

  it('Fails to convert a docx stream to a tiff because of a bad save location', async () => {
    const file = await fs.createReadStream(joinPath(__dirname, 'documents/test.docx'));
    const output = await documentProcessingHelper.convert({
      input: file,
      outputFormat: 'tiff'
    });
    await expect(output[0].saveToFile(joinPath(__dirname, 'documents/tempBad/outputFromStream.tiff'))).to.eventually.be.rejectedWith('ENOENT: no such file or directory');
  });

  it('Fails to convert a docx to a pdf because of invalid filepath', async () => {
    await expect(documentProcessingHelper.convert({
      input: joinPath(__dirname, 'documents/test2.docx'),
      outputFormat: 'pdf'
    })).to.eventually.be.rejectedWith('ENOENT: no such file or directory');
  });
});
