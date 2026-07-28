import api from "./api";

export const getConversations = async () => {
  const res = await api.get("/conversations");
  return res.data;
};

export const getMessages = async (conversationId: number) => {
  const res = await api.get(`/messages/${conversationId}`);
  return res.data;
};

export const createConversation = async (userId: number) => {
  const res = await api.post("/conversations", {
    userId,
  });

  return res.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};