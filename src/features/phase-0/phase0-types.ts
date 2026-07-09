// Phase 0 only. This is not the formal data contract.
export type Phase0PossibleKind =
  | "help_request_candidate"
  | "site_status_candidate"
  | "task_candidate"
  | "assignment_candidate"
  | "announcement_candidate"
  | "unknown";

export type Phase0Confidence = "low" | "medium" | "high";

export type Phase0SuggestedNextStep =
  | "keep_raw"
  | "ask_for_more_info"
  | "send_to_human_review"
  | "create_candidate_report"
  | "create_site_update_suggestion"
  | "do_not_use_yet";

export type Phase0MessyRecord = {
  id: string;
  rawText: string;
  sourceType: string;
  verificationStatus: string;
  updatedAt: string;
};

export type Phase0Details = {
  須協助者?: string; // 原文中的當事人或可能需要協助的人
  通報者?: string; // 誰通報或代為轉述
  需要資源?: string; // 原文提到的人力、物資、服務或其他需求
  通報時間?: string; // 原文或資料欄位中的通報 / 更新時間
  須協助地點?: string; // 原文提到的位置，未必可直接定位
};

export type Phase0JudgementDraft = {
  messyRecordId: string;
  possibleKind: Phase0PossibleKind;
  confidence: Phase0Confidence;
  evidence: string[];
  blockers: string[];
  suggestedNextStep: Phase0SuggestedNextStep;
  unsafeToActDirectly: boolean;
  humanReviewNote?: string;
  details?: Phase0Details;
};
