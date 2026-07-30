export function downloadFile(
  fileUrl: string,
  fileName?: string,
) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL!.replace("/api", "");

  let path = fileUrl;

  if (fileUrl.startsWith("http")) {
    path = new URL(fileUrl).pathname;
  }

  const parts = path.split("/");

  const folder = parts[2];
  const filename = parts[3];

  const downloadUrl =
    `${API_URL}/upload/download/${folder}/${filename}`;

  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = fileName || filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}