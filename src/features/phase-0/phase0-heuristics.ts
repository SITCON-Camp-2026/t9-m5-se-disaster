import type {
  Phase0Details,
  Phase0JudgementDraft,
  Phase0MessyRecord,
} from "./phase0-types";

// ponytail: this is a safety-boundary scaffold, not an answer engine.
export function createPhase0Judgement(
  record: Phase0MessyRecord,
): Phase0JudgementDraft {
  const isVerified = record.verificationStatus === "verified";

  return {
    messyRecordId: record.id,
    possibleKind: "unknown",
    confidence: "low",
    evidence: ["尚未建立整理草稿：請由小組從原文標出判斷依據。"],
    blockers: isVerified
      ? ["仍需確認這筆資訊適合進入哪個後續流程。"]
      : ["目前不是已確認資訊，不能直接行動或當成事實發布。"],
    suggestedNextStep: isVerified ? "keep_raw" : "send_to_human_review",
    unsafeToActDirectly: true,
  };
}

// 提供預設整理草稿讓學員參考與編輯
export function getInitialDrafts(): Record<
  string,
  Phase0JudgementDraft | null
> {
  return {
    "M-001": {
      messyRecordId: "M-001",
      possibleKind: "help_request_candidate",
      confidence: "medium",
      evidence: [
        "原文提到『需要十幾個人清泥』，是明確的勞動需求",
        "sourceType 為 social_post，可能是現場志工貼文",
      ],
      blockers: [
        "地址資訊不完整：『老雜貨店後面』不夠精確，無法直接派人",
        "尚未確認是否有人已在處理此任務",
        "未知道清泥規模和預期完成時間",
      ],
      suggestedNextStep: "ask_for_more_info",
      unsafeToActDirectly: true,
      humanReviewNote:
        "需要補問：(1)老雜貨店的確切位置 (2)現在還在清泥嗎 (3)需要多少人",
      details: {
        須協助者: "原文未明確說明",
        通報者: "社群貼文來源者（身份未確認）",
        需要資源: "人力需求（約 10-15 人）、清泥作業",
        通報時間: "2026-07-20 09:10",
        須協助地點: "光復車站後方、老雜貨店後面（位置模糊）",
      },
    },
    "M-002": {
      messyRecordId: "M-002",
      possibleKind: "site_status_candidate",
      confidence: "low",
      evidence: [
        "志工報告溪畔活動中心有雨鞋",
        "sourceType 為 volunteer_update",
      ],
      blockers: [
        "時間戳是早上，但本身說『不知道下午還有沒有』，資訊已過期",
        "尺寸和數量不詳",
        "與 M-004 相衝：社群貼文說『還有很多雨鞋』，但確實數量未知",
      ],
      suggestedNextStep: "send_to_human_review",
      unsafeToActDirectly: true,
      details: {
        須協助者: "原文未明確說明",
        通報者: "志工",
        需要資源: "雨鞋（數量未詳、尺寸未詳）",
        通報時間: "2026-07-20 早上（09:25 回報），下午狀態未知",
        須協助地點: "溪畔活動中心",
      },
    },
    "M-009": {
      messyRecordId: "M-009",
      possibleKind: "site_status_candidate",
      confidence: "high",
      evidence: [
        "來自現場志工實時回報（14:20）",
        "明確說明集合點的開放狀態和限制條件",
        "指出官方公告尚未同步，有信息透明度問題",
        "包含具體時間戳和操作者身份",
      ],
      blockers: [
        "公告位置在『站前遮雨棚』，尚未看到官方正式公告同步更新",
        "如果依賴此資訊安排志工，需確認官方最新狀態",
      ],
      suggestedNextStep: "create_site_update_suggestion",
      unsafeToActDirectly: false,
      humanReviewNote:
        "這筆資訊品質相對較高，現場志工有時間戳和身份標示。可以作為候選地點狀態更新。",
      details: {
        須協助者: "已完成報到的清淤志工（集合點使用限制）",
        通報者: "現場志工",
        需要資源: "臨時集合點資訊；一般物資請勿送達",
        通報時間: "2026-07-20 14:20 回報（14:25 更新）",
        須協助地點: "光復車站東側出口（公告在站前遮雨棚）",
      },
    },
    "M-010": {
      messyRecordId: "M-010",
      possibleKind: "site_status_candidate",
      confidence: "high",
      evidence: [
        "明確的現場盤點資訊：雨鞋剩 12 雙、尺寸 26-28",
        "清楚的需求狀態：飲用水暫不缺、不再收二手衣物",
        "明確指示後續需求往大進路口服務台登記",
        "有具體的下次盤點時間（16:30）",
        "來自現場值守志工（14:35）",
      ],
      blockers: [],
      suggestedNextStep: "create_site_update_suggestion",
      unsafeToActDirectly: false,
      humanReviewNote:
        "最高品質的整理草稿範例。明確的時間、數字、狀態、下一步。適合作為模板。",
      details: {
        須協助者: "需要登記水電檢修需求者",
        通報者: "溪畔活動中心值守志工",
        需要資源:
          "雨鞋 12 雙（尺寸 26-28）、飲用水、二手衣物（已停收）、水電檢修登記",
        通報時間: "2026-07-20 14:35 盤點，下次盤點 16:30",
        須協助地點: "溪畔活動中心（登記服務轉往大進路口服務台）",
      },
    },
    "M-011": {
      messyRecordId: "M-011",
      possibleKind: "help_request_candidate",
      confidence: "medium",
      evidence: [
        "明確的需求：協助搬動大型家具",
        "指出操作者不是當事人（由志工代轉述）",
        "有大致位置（大進路口往溪邊方向第二排住家）",
      ],
      blockers: [
        "操作者（長者）不能直接溝通，無法確認需求的完整內容",
        "地址不完整，尚未確認長者是否同意公開完整地址",
        "無法確認長者的可接受時間或其他限制條件",
      ],
      suggestedNextStep: "send_to_human_review",
      unsafeToActDirectly: true,
      humanReviewNote:
        "需要標示『操作者不是當事人』。需要人工確認長者同意後才能建立任務。",
      details: {
        須協助者: "不方便使用手機的長者（尚未由本人確認）",
        通報者: "現場志工代轉述",
        需要資源: "協助搬移大型家具",
        通報時間: "2026-07-20 14:50 回報",
        須協助地點: "大進路口往溪邊方向第二排住家（完整地址未確認）",
      },
    },
    "M-012": {
      messyRecordId: "M-012",
      possibleKind: "help_request_candidate",
      confidence: "low",
      evidence: ["外地家屬提報親友可能需要藥品"],
      blockers: [
        "家屬不在現場，無法確認親友的確切位置",
        "無法確認親友是否同意建立任務或透露位置",
        "藥品具體需求不明",
        "沒有直接聯絡方式",
      ],
      suggestedNextStep: "do_not_use_yet",
      unsafeToActDirectly: true,
      humanReviewNote:
        "不能直接變成任務。需要先由現場志工確認親友位置和意願，再由親友本人確認藥品需求。",
      details: {
        須協助者: "親友本人未確認",
        通報者: "外地家屬代轉述",
        需要資源: "藥品（種類、數量、規格均未詳）",
        通報時間: "2026-07-20 15:05 來電",
        須協助地點: "光復老街附近（確切位置未確認）",
      },
    },
  };
}

// 從原文簡單提取通報分類欄位（用於原始資訊卡片顯示）
export function extractRawDetails(text: string): Partial<Phase0Details> {
  const details: Record<string, string | undefined> = {};

  // 簡單的啟發式提取：只標示原文可能看得到的線索，不代表已確認。
  if (text.includes("長者")) details.須協助者 = "長者";
  else if (text.includes("親友")) details.須協助者 = "親友";
  else if (text.includes("已完成報到的清淤志工"))
    details.須協助者 = "已完成報到的清淤志工";
  else if (text.includes("有人說需要")) details.須協助者 = "未明確說明";

  if (text.includes("值守志工")) details.通報者 = "值守志工";
  else if (text.includes("現場志工")) details.通報者 = "現場志工";
  else if (text.includes("志工")) details.通報者 = "志工";
  else if (text.includes("家屬")) details.通報者 = "家屬";
  else if (text.includes("來電者")) details.通報者 = "來電者";
  else if (text.includes("有人")) details.通報者 = "社群貼文或回報";

  const resources: string[] = [];
  if (text.includes("清泥")) resources.push("清泥人力");
  if (text.includes("雨鞋")) resources.push("雨鞋");
  if (text.includes("鏟子")) resources.push("鏟子");
  if (text.includes("水電")) resources.push("水電服務");
  if (text.includes("衣物")) resources.push("衣物");
  if (text.includes("藥品")) resources.push("藥品");
  if (text.includes("家具")) resources.push("家具搬運");
  if (text.includes("集合點")) resources.push("集合點資訊");
  if (resources.length > 0) details.需要資源 = resources.join("、");

  const timeMatch = text.match(
    /(\d{1,2}:\d{2})|(\d{4}-\d{2}-\d{2})|早上|中午|下午|今天|昨天|截圖|晚上/,
  );
  if (timeMatch) details.通報時間 = `原文提到：${timeMatch[0]}`;

  if (text.includes("光復車站東側出口"))
    details.須協助地點 = "光復車站東側出口";
  else if (text.includes("光復車站")) details.須協助地點 = "光復車站";
  else if (text.includes("溪畔活動中心")) details.須協助地點 = "溪畔活動中心";
  else if (text.includes("光復老街")) details.須協助地點 = "光復老街";
  else if (text.includes("老街")) details.須協助地點 = "老街";
  else if (text.includes("學校")) details.須協助地點 = "學校";
  else if (text.includes("集合點")) details.須協助地點 = "集合點";
  else if (text.includes("大進路口")) details.須協助地點 = "大進路口";
  else if (text.includes("A 區")) details.須協助地點 = "A 區";

  return details as Partial<Phase0Details>;
}
