const copyToClipboard = (): void => {
  if (!navigator.clipboard) {
    console.error("Clipboard API not available");
    return;
  }

  navigator.clipboard
    .writeText(window.location.href)
    .then(() => alert("📋 URL copied to clipboard!"))
    .catch((err: unknown) => {
      console.error("Failed to copy:", err);
    });
};

export default copyToClipboard;