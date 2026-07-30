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

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void,
) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },

    onUploadProgress: (event) => {
      if (!event.total) return;

      const progress = Math.round(
        (event.loaded * 100) / event.total,
      );

      onProgress?.(progress);
    },
  });

  return res.data;
};

export const uploadAudio = async (
  file: File,
  onProgress?: (progress: number) => void,
) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post(
    "/upload/audio",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },

      onUploadProgress: (event) => {
        if (!event.total) return;

        const progress = Math.round(
          (event.loaded * 100) /
            event.total,
        );

        onProgress?.(progress);
      },
    },
  );

  return res.data;
};