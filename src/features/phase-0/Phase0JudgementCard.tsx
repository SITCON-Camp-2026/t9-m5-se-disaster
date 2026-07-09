import { StatusBadge } from "../../components/StatusBadge";
import type {
  Phase0Details,
  Phase0JudgementDraft,
  Phase0MessyRecord,
} from "./phase0-types";

const kindLabels: Record<Phase0JudgementDraft["possibleKind"], string> = {
  help_request_candidate: "求助候選",
  site_status_candidate: "地點狀態候選",
  task_candidate: "任務候選",
  assignment_candidate: "人員指派候選",
  announcement_candidate: "公告候選",
  unknown: "候選類型待判斷",
};

const kindOptions: Array<Phase0JudgementDraft["possibleKind"]> = [
  "help_request_candidate",
  "site_status_candidate",
  "task_candidate",
  "assignment_candidate",
  "announcement_candidate",
  "unknown",
];

const confidenceLabels: Record<Phase0JudgementDraft["confidence"], string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const confidenceOptions: Array<Phase0JudgementDraft["confidence"]> = [
  "low",
  "medium",
  "high",
];

const nextStepLabels: Record<
  Phase0JudgementDraft["suggestedNextStep"],
  string
> = {
  keep_raw: "先保留原始資訊",
  ask_for_more_info: "補問來源或現場資訊",
  send_to_human_review: "交給人工確認",
  create_candidate_report: "建立候選通報",
  create_site_update_suggestion: "建立地點更新建議",
  do_not_use_yet: "暫時不要使用",
};

const nextStepOptions: Array<Phase0JudgementDraft["suggestedNextStep"]> = [
  "keep_raw",
  "ask_for_more_info",
  "send_to_human_review",
  "create_candidate_report",
  "create_site_update_suggestion",
  "do_not_use_yet",
];

const detailFields: Array<{
  key: keyof Phase0Details;
  label: string;
  placeholder: string;
}> = [
  {
    key: "須協助者",
    label: "須協助者",
    placeholder: "原文中的當事人或可能需要協助的人；不明確就寫不明確",
  },
  {
    key: "通報者",
    label: "通報者",
    placeholder: "誰通報、轉述或發布這筆資訊",
  },
  {
    key: "需要資源",
    label: "需要資源",
    placeholder: "人力、物資、服務或其他需求",
  },
  {
    key: "通報時間",
    label: "通報時間",
    placeholder: "原文時間、資料更新時間或不明確的時間線索",
  },
  {
    key: "須協助地點",
    label: "須協助地點",
    placeholder: "地點、區域、地址線索；不完整就標示不完整",
  },
];

export function Phase0JudgementCard({
  judgement,
  record,
  isEditing = false,
  onUpdateJudgement,
  onSave,
  onDelete,
  onCancel,
  hasDraft = false,
}: {
  judgement: Phase0JudgementDraft;
  record: Phase0MessyRecord;
  isEditing?: boolean;
  onUpdateJudgement?: (draft: Phase0JudgementDraft) => void;
  onSave?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  hasDraft?: boolean;
}) {
  if (isEditing && onUpdateJudgement && onSave && onDelete && onCancel) {
    return (
      <article className="judgement-card judgement-card--editing">
        <div className="judgement-card__header">
          <div>
            <p className="eyebrow">編輯整理草稿</p>
            <h3>{record.id}</h3>
          </div>
          <StatusBadge status={record.verificationStatus} />
        </div>

        <div className="form-group">
          <label htmlFor={`kind-${record.id}`}>候選類型</label>
          <select
            id={`kind-${record.id}`}
            value={judgement.possibleKind}
            onChange={(e) =>
              onUpdateJudgement({
                ...judgement,
                possibleKind: e.target
                  .value as Phase0JudgementDraft["possibleKind"],
              })
            }
          >
            {kindOptions.map((kind) => (
              <option key={kind} value={kind}>
                {kindLabels[kind]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`confidence-${record.id}`}>信心程度</label>
          <select
            id={`confidence-${record.id}`}
            value={judgement.confidence}
            onChange={(e) =>
              onUpdateJudgement({
                ...judgement,
                confidence: e.target
                  .value as Phase0JudgementDraft["confidence"],
              })
            }
          >
            {confidenceOptions.map((conf) => (
              <option key={conf} value={conf}>
                {confidenceLabels[conf]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`evidence-${record.id}`}>判斷依據</label>
          <textarea
            id={`evidence-${record.id}`}
            value={judgement.evidence.join("\n")}
            onChange={(e) =>
              onUpdateJudgement({
                ...judgement,
                evidence: e.target.value
                  .split("\n")
                  .filter((line) => line.trim().length > 0),
              })
            }
            placeholder="每行一筆判斷依據"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`blockers-${record.id}`}>卡住的地方</label>
          <textarea
            id={`blockers-${record.id}`}
            value={judgement.blockers.join("\n")}
            onChange={(e) =>
              onUpdateJudgement({
                ...judgement,
                blockers: e.target.value
                  .split("\n")
                  .filter((line) => line.trim().length > 0),
              })
            }
            placeholder="每行一個不能判斷或不能直接行動的原因"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`nextstep-${record.id}`}>下一步建議</label>
          <select
            id={`nextstep-${record.id}`}
            value={judgement.suggestedNextStep}
            onChange={(e) =>
              onUpdateJudgement({
                ...judgement,
                suggestedNextStep: e.target
                  .value as Phase0JudgementDraft["suggestedNextStep"],
              })
            }
          >
            {nextStepOptions.map((step) => (
              <option key={step} value={step}>
                {nextStepLabels[step]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={judgement.unsafeToActDirectly}
              onChange={(e) =>
                onUpdateJudgement({
                  ...judgement,
                  unsafeToActDirectly: e.target.checked,
                })
              }
            />
            不能直接行動
          </label>
        </div>

        <div className="form-group">
          <label htmlFor={`review-${record.id}`}>人工審視備註</label>
          <textarea
            id={`review-${record.id}`}
            value={judgement.humanReviewNote ?? ""}
            onChange={(e) =>
              onUpdateJudgement({
                ...judgement,
                humanReviewNote: e.target.value || undefined,
              })
            }
            placeholder="人類修正、質疑或補充說明"
            rows={2}
          />
        </div>

        <div className="details-edit-section">
          <h4>原始資訊分類</h4>
          {detailFields.map((field) => (
            <div className="form-group" key={field.key}>
              <label htmlFor={`detail-${field.key}-${record.id}`}>
                {field.label}
              </label>
              <textarea
                id={`detail-${field.key}-${record.id}`}
                value={judgement.details?.[field.key] ?? ""}
                onChange={(e) =>
                  onUpdateJudgement({
                    ...judgement,
                    details: {
                      ...judgement.details,
                      [field.key]: e.target.value || undefined,
                    },
                  })
                }
                placeholder={field.placeholder}
                rows={2}
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={onSave}>
            保存整理草稿
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            取消編輯
          </button>
          <button type="button" className="btn-danger" onClick={onDelete}>
            刪除整理草稿
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="judgement-card">
      <div className="judgement-card__header">
        <div>
          <p className="eyebrow">
            {hasDraft ? "整理草稿" : "Starter 安全預設"}
          </p>
          <h3>{hasDraft ? "已建立草稿" : "尚未建立整理草稿"}</h3>
        </div>
        <StatusBadge status={record.verificationStatus} />
      </div>

      {!hasDraft && (
        <p>
          這張卡只保留保守的安全邊界，不是 agent
          對這筆資料的整理答案。請建立整理草稿。
        </p>
      )}

      <dl className="judgement-summary">
        <div>
          <dt>候選類型</dt>
          <dd>{kindLabels[judgement.possibleKind]}</dd>
        </div>
        <div>
          <dt>信心程度</dt>
          <dd>{confidenceLabels[judgement.confidence]}</dd>
        </div>
        <div>
          <dt>下一步</dt>
          <dd>{nextStepLabels[judgement.suggestedNextStep]}</dd>
        </div>
      </dl>

      <p>
        能否直接行動：
        <strong>
          {judgement.unsafeToActDirectly ? "不可直接行動" : "仍需確認情境"}
        </strong>
      </p>

      <section>
        <h4>判斷依據</h4>
        <ul>
          {judgement.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>卡住的地方</h4>
        <ul>
          {judgement.blockers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {judgement.humanReviewNote && (
        <section className="human-review">
          <h4>人工審視</h4>
          <p>{judgement.humanReviewNote}</p>
        </section>
      )}

      {judgement.details && (
        <section className="details-section">
          <h4>原始資訊分類</h4>
          <dl className="details-grid">
            {detailFields.map((field) =>
              judgement.details?.[field.key] ? (
                <div className="detail-item" key={field.key}>
                  <dt>{field.label}</dt>
                  <dd>{judgement.details[field.key]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </section>
      )}
    </article>
  );
}
