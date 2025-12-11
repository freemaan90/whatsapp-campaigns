  export function getSenderName(senderInfo:any) {
    return senderInfo.profile.name || senderInfo.wa_id || "";
  }