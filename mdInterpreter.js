const { log } = require('console');
const fs = require('fs');
const { tags, wrapWithTag } = require('./tags.js')

const lineToHTML = (string) => {
  const tag = tags.find((regEx) => regEx.tag.test(string));
  if (!tag) {
    return wrapWithTag(string, 'div');
  }
  return lineToHTML(tag.replacer(string, tag.captor));
};

const generateBody = (htmlArray) => {
  const bodyString = htmlArray.join('');
  return wrapWithTag(bodyString, 'body');
};

const generateHead = (cssFile, fileName) => {
  const title = wrapWithTag(fileName, 'title');
  const link = '<link rel="stylesheet" href="' + cssFile + '">';
  return wrapWithTag(title + link, 'head');
};

const createPage = (fileAsString, cssFile, fileName) => {
  const fileArray = fileAsString.split('\n\n');
  const htmlArray = fileArray.map(lineToHTML);
  const body = generateBody(htmlArray);
  const head = generateHead(cssFile, fileName);
  return wrapWithTag(head + body, 'html');
};

const main = (cmdArgs) => {
  const file = cmdArgs[2];
  const fileName = file.slice(0, -3);
  const cssFile = cmdArgs[3];
  const fileAsString = fs.readFileSync(file, 'utf8');
  console.log(fileAsString);
  const htmlFile = createPage(fileAsString, cssFile, fileName);
  fs.writeFileSync(fileName + '.html', htmlFile, 'utf-8');
  return fileName + '.html Created';
};

log(main(process.argv));
