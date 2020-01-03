const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const { resolve } = require('path');
const ENTRY_NAME = 'serviceworker';

class ServiceWorkerPlugin {
  constructor(options) {
    this.options = {
      sw: options.entry.sw,
      register: options.entry.register,
      include: []
    };
  }

  apply(compiler) {
    if (compiler.hooks) {
      // webpack4.x API
      compiler.hooks.make.tapAsync('ServiceWorkerPlugin', async (compilation, cb) => {
        await this.handleStaticSWFiles(compiler, compilation);
        cb();
      });
    } else {
      throw new Error('service-worker-plugins requires webpack >=4.x. Please upgrade your webpack version.');
    }
  }

  handleDiffFile(compiler, compilation, option) {
    const childCompiler = compilation.createChildCompiler(ENTRY_NAME, {
      filename: option.filename
    });
    const swFilePath = resolve(__dirname, `${option.path}${option.filename}`);
    const childEntryCompiler = new SingleEntryPlugin(compiler.context, swFilePath);
    childEntryCompiler.apply(childCompiler);

    return new Promise((resolve, reject) => {
      childCompiler.runAsChild(err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async handleStaticSWFiles(compiler, compilation) {
    this.options.sw && (await this.handleDiffFile(compiler, compilation, this.options.sw));
    this.options.register && (await this.handleDiffFile(compiler, compilation, this.options.register));
  }
}

module.exports = ServiceWorkerPlugin;