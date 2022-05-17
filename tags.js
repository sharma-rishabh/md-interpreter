const wrapWithTag = (string, tag) =>
  '<' + tag + '>' + string + '</' + tag + '>';

const generateHeadings = (string, captor) => {
  const heading = string.match(captor).slice(1, 3);
  const headingNumber = heading[0].length;
  return wrapWithTag(heading[1], 'h' + headingNumber);
};

const insertStrongAndItalic = (string, captor) => {
  const captures = string.match(captor).slice(1, 4);
  const emphasizedText = wrapWithTag(wrapWithTag(captures[1], 'em'), 'strong');
  return captures[0] + emphasizedText + captures[2];
};

const generateCodeBlocks = (string) => {
  const code = string.replace(/^```/, '<code>');
  return code.replace(/```$/, '</code>');
};

const insertItalics = (string, captor) => {
  const captures = string.match(captor).slice(1, 4);
  return captures[0] + wrapWithTag(captures[1], 'em') + captures[2];
};

const insertStrong = (string, captor) => {
  const captures = string.match(captor).slice(1, 4);
  return captures[0] + wrapWithTag(captures[1], 'strong') + captures[2];
};

const generateBlockQuote = (string, captor) => {
  const captures = string.match(captor).slice(1, 2);
  return wrapWithTag(captures[0], 'blockquote');
};

const insertCodeSnippet = (string, captor) => {
  const captures = string.match(captor).slice(1, 4);
  return captures[0] + wrapWithTag(captures[1], 'code') + captures[2];
};

const generateImageTag = (string, captor) => {
  const captures = string.match(captor).slice(1, 3);
  return '<img src="' + captures[1] + '" alt="' + captures[0] + '" >';
};

const generateLinkTag = (string, captor) => {
  const captures = string.match(captor).slice(1, 3);
  return '<a href="' + captures[1] + '" >' + captures[0] + '</a>';
};

const extractData = (string) => string.split('|').filter((x) => /\w.*/.test(x));

const generateRow = (headers, tag) => {
  const tableData = headers.map((data) => wrapWithTag(data, tag)).join('');
  return wrapWithTag(tableData, 'tr');
};

const generateTableHead = (headingString) => {
  const headers = extractData(headingString);
  return wrapWithTag(generateRow(headers, 'th'), 'thead');
};

const generateTableBody = (bodyString) => {
  const bodyData = bodyString.match(/\|.*\|\n/g).map(extractData);
  const rows = bodyData.map(data => generateRow(data, 'td'));
  return wrapWithTag(rows.join(''), 'tbody');
};

const generateTable = (string) => {
  const tableContents = string.split(/\|-.*\|/);
  const header = tableContents[0];
  const bodyContent = tableContents[1];
  const tableHead = generateTableHead(header);
  const tableBody = generateTableBody(bodyContent);
  return wrapWithTag(tableHead + tableBody, 'table');
};

const tags = [
  {
    tag: /^#/,
    replacer: generateHeadings,
    captor: /^(#+) (.*)/
  },
  {
    tag: /^```/,
    replacer: generateCodeBlocks
  },
  {
    tag: /\*{3,3}.+\*{3,3}/,
    replacer: insertStrongAndItalic,
    captor: /(.*)\*{3,3}(.+)\*{3,3}(.*)/
  },
  {
    tag: /\*\*.+\*\*/,
    replacer: insertStrong,
    captor: /(.*)\*{2,2}(.+)\*{2,2}(.*)/
  },
  {
    tag: /\*.+\*/,
    replacer: insertItalics,
    captor: /(.*)\*(.+)\*(.*)/
  },
  {
    tag: /^>.*/,
    replacer: generateBlockQuote,
    captor: /^>(.*)/
  },
  {
    tag: /.*`[^`].*`[^`].*/,
    replacer: insertCodeSnippet,
    captor: /(.*)`(.+)`(.*)/
  },
  {
    tag: /!\[.*\]\(.*\)/,
    replacer: generateImageTag,
    captor: /!\[(.*)\]\((.*)\)/
  },
  {
    tag: /\[.*\]\(.*\)/,
    replacer: generateLinkTag,
    captor: /\[(.*)\]\((.*)\)/
  },
  {
    tag: /^\|.*\|\n/,
    replacer: generateTable
  }
];

exports.tags = tags;
exports.wrapWithTag = wrapWithTag;
