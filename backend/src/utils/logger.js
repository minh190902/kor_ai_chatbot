// src/utils/logger.js
const chalk = require('chalk');

module.exports = {
  info: (...args) => {
    console.log(chalk.blue('[INFO]'), ...args);
  },
  warn: (...args) => {
    console.warn(chalk.yellow('[WARN]'), ...args);
  },
  error: (...args) => {
    console.error(chalk.red('[ERROR]'), ...args);
  }
};
