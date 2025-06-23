export function parseTopicXML(xmlString) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");

  const getText = (tag) => xml.getElementsByTagName(tag)[0]?.textContent || "";

  const metadata = {};
  ["level", "type", "subtype", "topic", "skill"].forEach((k) => {
    metadata[k] = getText(k);
  });

  const passage = getText("passage");
  const question = getText("question");

  // Choices
  const choiceNodes = xml.getElementsByTagName("choice");
  const choices = [];
  for (let i = 0; i < choiceNodes.length; i++) {
    choices.push({
      id: choiceNodes[i].getAttribute("id"),
      text: choiceNodes[i].textContent,
    });
  }

  // Answer
  const answerId = getText("id");
  const rationale = xml.getElementsByTagName("rationale")[0]?.textContent || "";
  const distractorNodes = xml.getElementsByTagName("item");
  const wrong = [];
  for (let i = 0; i < distractorNodes.length; i++) {
    wrong.push({
      id: distractorNodes[i].getAttribute("choice_id"),
      reason: distractorNodes[i].textContent,
    });
  }

  return {
    info: metadata,
    passage,
    question,
    choices,
    answer: answerId,
    explanation: rationale,
    wrong,
  };
}