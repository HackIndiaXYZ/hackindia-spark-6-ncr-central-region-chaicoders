export function quickExtract(text: string) {
  const nameMatch = text.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/m);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  const orgMatch = text.match(
    /(?:at|@|–|-)\s*([A-Z][a-zA-Z\s&.]+(?:Inc|Ltd|LLC|Corp|Google|Microsoft|Amazon)?)/
  );

  return {
    name: nameMatch?.[1] ?? "",
    email: emailMatch?.[0] ?? "",
    org: orgMatch?.[1]?.trim() ?? "",
  };
}
