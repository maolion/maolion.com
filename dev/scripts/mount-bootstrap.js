const FS = require('fs');
const Path = require('path');

var UglifyJS = require("uglify-js");

const {
  CLIENT_SOURCE_DIR,
  WWW_PUBLIC_APP_DIR,
  SHARED_SOURCE_DIR,
} = require('../constants');

const styleRegEx = /<link[^>]*href="([^"]+)"[^>]*stylesheet[^>]*\/?>/ig;
const scriptsRegEx = /<script[^>]*src="([^"]+)"[^>]*><\/script>/ig;
const styleLinkTagsContentSectionRegEx = /<style id="styles-begin"><\/style>([^]*?)<\/head>/i;
const scriptTagsContentSectionRegEx = /<script id="scripts-begin"><\/script>([^]*?)<\/body>/i;

const CWD = process.cwd();
const projectDir = Path.join(CWD, process.argv[process.argv.indexOf('--project') + 1]);
const entryHTMLFilePath = Path.join(CWD, process.argv[process.argv.indexOf('--entry-html') + 1]);
const isProd = process.argv.indexOf('--prod') > -1;


let entryHTMLFileContent = readFile(entryHTMLFilePath, 'utf8');

if (entryHTMLFileContent.indexOf('<!--BOOTSTRAP_MOUNTED-->') > -1) {
  return;
}

let entryResources = parseEntryHTMLResources(entryHTMLFileContent);

let bootstrapLibCode = readFile(Path.join(SHARED_SOURCE_DIR, 'bootstrap', 'index.js'));

let projectBootJS = readFile(Path.join(projectDir, 'boot.js'));
let projectBootCSS = undefined;

try {
  projectBootCSS = readFile(Path.join(projectDir, 'boot.css'));
} catch(e) { }

let bootstrapMountJS = `
(function() {
  // bootstrap lib
  ${bootstrapLibCode}

  // project boot
  AppBootstrap.start(
    ${JSON.stringify([].concat(entryResources.styles, entryResources.scripts))},
    function (onReady, onProgress, onError, onDone) {
      ${projectBootJS}
    }
  );
})();
`;

entryHTMLFileContent = entryHTMLFileContent
  .replace(/<!--don't remove this element-->/g, '')
  .replace(
    styleLinkTagsContentSectionRegEx,
    `<style>${isProd ? minifyCSS(projectBootCSS) : projectBootCSS}</style></head>`
  )
  .replace(
    scriptTagsContentSectionRegEx,
    `<script>${isProd ? minifyJS(bootstrapMountJS) : bootstrapMountJS}</script><!--BOOTSTRAP_MOUNTED--></body>`
  );

// output

FS.writeFileSync(entryHTMLFilePath, entryHTMLFileContent, 'utf8');

/////////////
// Helpers //
/////////////

function parseEntryHTMLResources(entryHTMLFileContent) {
  let styles = [];
  let scripts = [];
  let match = undefined;

  let styleLinkTagsContentSection = entryHTMLFileContent.match(styleLinkTagsContentSectionRegEx)[1];

  styleRegEx.lastIndex = 0;

  while (match = styleRegEx.exec(styleLinkTagsContentSection)) {
    styles.push(match[1]);
  }

  let scriptTagsContentSection = entryHTMLFileContent.match(scriptTagsContentSectionRegEx)[1];

  scriptsRegEx.lastIndex = 0;

  while (match = scriptsRegEx.exec(scriptTagsContentSection)) {
    scripts.push(match[1]);
  }

  return {
    styles,
    scripts,
  }
}

function readFile(path) {
  return FS.readFileSync(path, 'utf8')
}

function minifyJS(code) {
  let result = UglifyJS.minify(code, {
    output: {
        quote_style: 1
    }
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return result.code;
}

function minifyCSS(code) {
  return code.replace(/(?:^\s+|[\r\n]+\s*|[\s\r\n]*$)/g, '');
}
