import { XMLParser } from "fast-xml-parser";

export function parseVocabXML(xml) {
  if (!xml) return {};
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
      parseTagValue: true,
      parseAttributeValue: true,
      allowBooleanAttributes: true,
    });
    return parser.parse(xml);
  } catch {
    return {};
  }
}

export function normalizeVocabData(data) {
  if (typeof data === "string") {
    data = parseVocabXML(data);
  }
  const wi =
    data?.vocabulary_expansion?.word_info ||
    data?.word_info ||
    {};

  let definitions = [];
  if (wi.definition) {
    if (Array.isArray(wi.definition)) {
      definitions = wi.definition.map(def =>
        typeof def === "object"
          ? { lang: def["@_lang"] || def.lang, value: def["#text"] || def.value || def }
          : { lang: "ko", value: def }
      );
    } else if (typeof wi.definition === "object") {
      definitions = [
        {
          lang: wi.definition["@_lang"] || wi.definition.lang,
          value: wi.definition["#text"] || wi.definition.value || wi.definition,
        },
      ];
    } else {
      definitions = [{ lang: "ko", value: wi.definition }];
    }
  }

  let synonyms = [];
  if (wi.synonyms?.item) {
    synonyms = Array.isArray(wi.synonyms.item)
      ? wi.synonyms.item
      : [wi.synonyms.item];
  } else if (Array.isArray(wi.synonyms)) {
    synonyms = wi.synonyms;
  } else if (wi.synonyms) {
    synonyms = [wi.synonyms];
  }

  let antonyms = [];
  if (wi.antonyms?.item) {
    antonyms = Array.isArray(wi.antonyms.item)
      ? wi.antonyms.item
      : [wi.antonyms.item];
  } else if (Array.isArray(wi.antonyms)) {
    antonyms = wi.antonyms;
  } else if (wi.antonyms) {
    antonyms = [wi.antonyms];
  }

  let examples = [];
  if (wi.examples?.example) {
    if (Array.isArray(wi.examples.example)) {
      examples = wi.examples.example.map(ex => ({
        ko: ex.ko || "",
        en:
          (typeof ex.translation === "object"
            ? ex.translation["#text"]
            : ex.translation) || "",
      }));
    } else if (wi.examples.example) {
      const ex = wi.examples.example;
      examples = [
        {
          ko: ex.ko || "",
          en:
            (typeof ex.translation === "object"
              ? ex.translation["#text"]
              : ex.translation) || "",
        },
      ];
    }
  }

  const etymology = wi.etymology || "";

  let related = [];
  if (wi.related_expressions?.item) {
    related = Array.isArray(wi.related_expressions.item)
      ? wi.related_expressions.item
      : [wi.related_expressions.item];
  } else if (Array.isArray(wi.related_expressions)) {
    related = wi.related_expressions;
  } else if (wi.related_expressions) {
    related = [wi.related_expressions];
  }

  return {
    word: wi.word || "",
    pronunciation: wi.pronunciation || "",
    level: wi.level || "",
    type: wi.type || "",
    definitions,
    synonyms,
    antonyms,
    examples,
    etymology,
    related,
  };
}