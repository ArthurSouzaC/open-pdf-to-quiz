const pdf = require("pdf-parse");
const { Ollama } = require("ollama");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ollama = new Ollama();

const extractPDFContent = async (req, res) => {
  const buffer = req.file?.buffer;

  if (!buffer) {
    res.status(400).json({ error: "Incorrect request" });
    return;
  }

  try {
    const data = await pdf(buffer);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const Questions = z.array(
  z.object({
    question: z.string(),
    alternatives: z.array(
      z.object({
        answer: z.string(),
        correct: z.boolean(),
      })
    ),
  })
);

const promptAi = async (req, res) => {
  const { messages } = req.body;

  if (!messages) {
    res.status(400).json({ error: "Incorrect request" });
  }

  try {
    const response = await ollama.chat({
      model: "mistral-small",
      messages,
      format: zodToJsonSchema(Questions),
    });

    const message = JSON.parse(response.message.content);

    res.json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = {
  extractPDFContent,
  promptAi,
};
