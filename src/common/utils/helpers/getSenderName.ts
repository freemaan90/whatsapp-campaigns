import { SenderInfo } from "src/interfaces/SenderInfo.interfaces";

  export function getSenderName(senderInfo:SenderInfo) {
    return senderInfo.profile.name || senderInfo.wa_id || "";
  }