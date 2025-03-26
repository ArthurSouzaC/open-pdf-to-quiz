import axios from "axios";

enum Roles {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

interface Message {
  role: Roles;
  content: string;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const extractPDFContent = async (file: File) => {
  const form = new FormData();

  form.append("input", file);

  const response = await apiClient.post("/pdf", form);

  return response.data;
};

export const getQuestions = async (
  text: string,
  nQuestions: number,
  nOptions: number
) => {
  const parts = text.match(/[\s\S]{1,500}/g) || [];

  const messages: Message[] = [
    {
      role: Roles.SYSTEM,
      content: `Act like you are a teacher responsible for reading some specific content, learning it and creating questions to test your students' knowledge about this content.`,
    },
    {
      role: Roles.SYSTEM,
      content: `
        From now, you will receive various messages from the user, containing a myriad of texts about some specific knowledge.
        You should learn from that texts. After all texts are sent to you, generate ${nQuestions} questions about that content.
        Each question should have ${nOptions} options of answer, with just one being the right answer.
      `,
    },
    {
      role: Roles.SYSTEM,
      content: `
        You should always return your content according to the following pattern:

        {
          question: string,
          alternatives: {
            answer: string,
            correct: boolean
          }[]
        }[]
      `,
    },
    ...parts.map((part) => ({
      role: Roles.USER,
      content: part,
    })),
    {
      role: Roles.USER,
      content: "Now, you can generate the questions.",
    },
  ];

  const response = await apiClient.post("/prompt", {
    messages,
  });

  return response.data;
};
