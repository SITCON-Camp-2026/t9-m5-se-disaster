import { useState } from "react";
import { RecordCard } from "../../components/RecordCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Phase0JudgementCard } from "./Phase0JudgementCard";
import { createPhase0Judgement } from "./phase0-heuristics";
import type { Phase0MessyRecord, Phase0JudgementDraft } from "./phase0-types";

export function Phase0Workbench({
  records,
  selectedRecordId,
  onSelect,
  judgementDrafts,
  onUpdateDraft,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
  judgementDrafts: Record<string, Phase0JudgementDraft | null>;
  onUpdateDraft: (recordId: string, draft: Phase0JudgementDraft | null) => void;
}) {
  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ?? records[0];
  const existingDraft = judgementDrafts[selectedRecord.id];
  const defaultJudgement = createPhase0Judgement(selectedRecord);
  const currentJudgement = existingDraft ?? defaultJudgement;

  const [editMode, setEditMode] = useState(false);
  const [editingDraft, setEditingDraft] =
    useState<Phase0JudgementDraft>(currentJudgement);

  const handleStartEdit = () => {
    setEditingDraft(currentJudgement);
    setEditMode(true);
  };

  const handleSaveDraft = () => {
    onUpdateDraft(selectedRecord.id, editingDraft);
    setEditMode(false);
  };

  const handleDeleteDraft = () => {
    onUpdateDraft(selectedRecord.id, null);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <div className="workbench">
      <div className="workbench__intro">
        <p className="eyebrow">整理工作台</p>
        <h2>第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。</h2>
        <p>
          選擇一筆原始資訊，建立或編輯整理草稿。標示「候選類型」「信心程度」「卡住的地方」。
        </p>
      </div>

      <div className="workbench__layout">
        <aside className="workbench__queue" aria-label="選擇原始資訊">
          {records.map((record) => {
            const hasDraft =
              judgementDrafts[record.id] !== undefined &&
              judgementDrafts[record.id] !== null;
            return (
              <button
                className={`${record.id === selectedRecord.id ? "active" : ""} ${hasDraft ? "has-draft" : ""}`}
                key={record.id}
                type="button"
                onClick={() => onSelect(record.id)}
              >
                <span>{record.id}</span>
                {hasDraft && <span className="draft-indicator">✓</span>}
                <StatusBadge status={record.verificationStatus} />
              </button>
            );
          })}
        </aside>

        <div className="workbench__main">
          <RecordCard record={selectedRecord} />

          {editMode ? (
            <Phase0JudgementCard
              judgement={editingDraft}
              record={selectedRecord}
              isEditing
              onUpdateJudgement={setEditingDraft}
              onSave={handleSaveDraft}
              onDelete={handleDeleteDraft}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <Phase0JudgementCard
                judgement={currentJudgement}
                record={selectedRecord}
                isEditing={false}
                hasDraft={existingDraft !== null && existingDraft !== undefined}
              />
              <div className="workbench__actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleStartEdit}
                >
                  {existingDraft ? "編輯整理草稿" : "建立整理草稿"}
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="workbench__checklist">
          <h3>第一階段完成檢查</h3>
          <ul>
            <li>✓ Starter 已載入 {records.length} 筆原始資訊</li>
            <li>
              {
                Object.values(judgementDrafts).filter(
                  (d) => d !== null && d !== undefined,
                ).length
              }{" "}
              / 6 筆整理草稿
            </li>
            <li>原始資訊列表頁可見</li>
            <li>工作台能建立、編輯、刪除整理草稿</li>
            <li>把資料品質問題寫進 observations</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
