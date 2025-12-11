export function buildMediaObject(
  type: MediaType,
  mediaUrl: string,
  caption?: string,
) {
  switch (type) {
    case 'image':
      return { image: { link: mediaUrl, caption } };

    case 'audio':
      return { audio: { link: mediaUrl } };

    case 'video':
      return { video: { link: mediaUrl, caption } };

    case 'document':
      return {
        document: {
          link: mediaUrl,
          caption,
          filename: 'medpet.pdf',
        },
      };
  }
}
