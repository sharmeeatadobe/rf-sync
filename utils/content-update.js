const { JSDOM } = require("jsdom");

const META_REG = /\{\{(.*?)\}\}/g;

function isHTMLString(str) {
const dom = new JSDOM(str);
const doc = dom.window.document;
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
}

function updateTextNode(child, matchCallback, html) {
  const originalText = child.nodeValue;
  const replacedText = originalText.replaceAll(META_REG, (_match, p1) =>
    matchCallback(_match, p1, child)
  );

  if (replacedText === originalText) return;

  if (isHTMLString(replacedText)) {
    child.parentElement.innerHTML = replacedText;
  } else {
    const lines = replacedText.split("\\n");
    lines.forEach((line, index) => {
      const textNode = html.createTextNode(line);
      child.parentElement.appendChild(textNode);
      if (index < lines.length - 1) {
        child.parentElement.appendChild(html.createElement("br"));
      }
    });
    child.remove();
  }
}

function autoUpdateContent(html, payload) {
  const getContent = (_match, p1, n) => {
    let content = payload?.[p1];

    // if (preserveFormatKeys.includes(p1)) {
    //   n.parentNode?.classList.add("preserve-format");
    // }

    // if (p1 === "start-date" || p1 === "end-date") {
    //   const date = new Date(content);
    //   const localeString = getConfig().locale?.ietf || "en-US";
    //   content = date.toLocaleDateString(localeString, {
    //     month: "long",
    //     day: "numeric",
    //     year: "numeric",
    //   });
    // }

    return content;
  };

  //   const isImage = (n) => n.tagName === "IMG" && n.nodeType === 1;
  const isPlainTextNode = (n) => n.nodeType === 3;
  //   const isStyledTextTag = (n) => n.tagName === "STRONG" || n.tagName === "EM";
  //   const mightContainIcon = (n) => n.tagName === "P" || n.tagName === "A";

  const allElements = html.querySelectorAll("*");
  allElements.forEach((element) => {
    if (element.childNodes.length) {
      element.childNodes.forEach((n) => {
        // if (isImage(n)) {
        //   updateImgTag(n, getImgData, element);
        // }

        if (isPlainTextNode(n)) {
          updateTextNode(n, getContent, html);
        }

        // if (isStyledTextTag(n)) {
        //   updateTextContent(n, getContent);
        // }

        // if (mightContainIcon(n)) {
        //   n.innerHTML = convertEccIcon(n);
        // }
      });
    }
  });

  return html

  // handle link replacement. To keep when switching to metadata based rendering
  //   autoUpdateLinks(parent, miloLibs);
  //   injectFragments(parent);
  //   decorateProfileCardsZPattern(parent);
  //   if (getEventServiceEnv() !== "prod") updateExtraMetaTags(parent);
}

module.exports = autoUpdateContent;
