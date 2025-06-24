export const DEFAULT_SETTINGS = {
  apiEndpoint: '',
  model: 'default',
  temperature: 0.7,
  maxTokens: 1000,
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export const ROLE = {
  ADMIN: 'admin',
  USER: 'user'
};

export const TOPIK_LEVELS = [
  { label: "초급", value: "초급" },
  { label: "중급", value: "중급" },
  { label: "고급", value: "고급" },
];

export const TOPIK_TYPES = [
  "Grammar & Vocabulary",
  "Detail Comprehension", 
  "Main Idea Comprehension",
  "Logical Inference & Structure",
];

export const TOPIK_SUBTYPES = {
  "Grammar & Vocabulary": [
    {
      label: "Choose the correct grammar/vocabulary for the blank",
      value: "Choose the correct grammar/vocabulary for the blank",
      applicable_levels: ["초급", "중급", "고급"],
    },
    {
      label: "Choose the expression with the same meaning as the underlined part",
      value: "Choose the expression with the same meaning as the underlined part",
      applicable_levels: ["고급"],
    },
  ],
  "Detail Comprehension": [
    {
      label: "Choose the statement that matches the content",
      value: "Choose the statement that matches the content",
      applicable_levels: ["초급", "중급", "고급"],
    },
    {
      label: "Understand information from notices/diagrams",
      value: "Understand information from notices/diagrams",
      applicable_levels: ["초급", "중급", "고급"],
    },
  ],
  "Main Idea Comprehension": [
    {
      label: "Identify the main idea",
      value: "Identify the main idea",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Choose the topic/title of the passage",
      value: "Choose the topic/title of the passage",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Understand the meaning of a newspaper headline",
      value: "Understand the meaning of a newspaper headline",
      applicable_levels: ["고급"],
    },
  ],
  "Logical Inference & Structure": [
    {
      label: "Arrange sentences in logical order",
      value: "Arrange sentences in logical order",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Find the correct position for a sentence",
      value: "Find the correct position for a sentence",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Infer the content to go inside the parentheses",
      value: "Infer the content to go inside the parentheses",
      applicable_levels: ["중급", "고급"],
    },
    {
      label: "Identify the writer's attitude or emotion",
      value: "Identify the writer's attitude or emotion",
      applicable_levels: ["고급"],
    },
  ],
};

export const TOPIK_LANGUAGES = [
  { label: "한국어", value: "Korean" },
  { label: "English", value: "English" },
  { label: "Tiếng Việt", value: "Vietnamese" },
];

export const LEVELS = [
  { label: "초급", value: "Beginner" },
  { label: "중급", value: "Intermediate" },
  { label: "고급", value: "Advanced" },
];