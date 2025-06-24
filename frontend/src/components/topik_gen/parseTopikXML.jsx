import { XMLParser } from "fast-xml-parser";

export function parseTopikXML(xmlString) {
  if (!xmlString) return null;
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
      parseTagValue: true,
      parseAttributeValue: true,
      allowBooleanAttributes: true,
      parseTrueNumberOnly: false,
      cdataPropName: "__cdata",
    });
    const parsed = parser.parse(xmlString);
    return normalizeTopikData(parsed);
  } catch (error) {
    console.error("Error parsing TOPIK XML:", error);
    return null;
  }
}

function extractText(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (data.__cdata) return data.__cdata;
  if (data["#text"]) return data["#text"];
  return data.toString();
}

export function normalizeTopikData(data) {
  const topicQuestion = data?.topic_question || {};
  const metadata = topicQuestion.metadata || {};
  const info = {
    level: metadata.level || "",
    type: metadata.type || "",
    subtype: metadata.subtype || "",
    topic: metadata.topic || "",
    skill: metadata.skill || "",
  };
  const passage = extractText(topicQuestion.passage);
  const question = extractText(topicQuestion.question);

  // Choices
  const choicesData = topicQuestion.choices?.choice || [];
  const choices = Array.isArray(choicesData)
    ? choicesData.map(choice => ({
        id: choice["@_id"] || choice.id,
        text: extractText(choice)
      }))
    : choicesData
    ? [{
        id: choicesData["@_id"] || choicesData.id,
        text: extractText(choicesData)
      }]
    : [];

  // Answer
  const answerData = topicQuestion.answer || {};
  const answer = answerData.id || "";
  const explanation = extractText(answerData.explanation?.rationale);

  // Wrong analysis
  const distractorItems = answerData.explanation?.distractor_analysis?.item || [];
  const wrong = Array.isArray(distractorItems)
    ? distractorItems.map(item => ({
        id: item["@_choice_id"] || item.choice_id,
        reason: extractText(item)
      }))
    : distractorItems
    ? [{
        id: distractorItems["@_choice_id"] || distractorItems.choice_id,
        reason: extractText(distractorItems)
      }]
    : [];

  return {
    info,
    passage,
    question,
    choices,
    answer,
    explanation,
    wrong,
  };
}