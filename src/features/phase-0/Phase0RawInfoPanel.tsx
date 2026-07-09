import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/date";
import { extractRawDetails } from "./phase0-heuristics";
import type { Phase0Details, Phase0MessyRecord } from "./phase0-types";

const rawDetailFields: Array<{
  key: keyof Phase0Details;
  label: string;
}> = [
  { key: "須協助者", label: "須協助者" },
  { key: "通報者", label: "通報者" },
  { key: "需要資源", label: "需要資源" },
  { key: "通報時間", label: "通報時間" },
  { key: "須協助地點", label: "須協助地點" },
];

export function Phase0RawInfoPanel({
  records,
  selectedRecordId,
  onSelect,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
}) {
  return (
    <div className="phase0-raw">
      <div className="panel__header">
        <div>
          <h2>原始資訊</h2>
          <p>這些還不是整理後資料，不能直接當成行動依據。</p>
        </div>
        <p>{records.length} 筆資料</p>
      </div>

      <div className="grid">
        {records.map((record) => (
          <article
            className={`record-card ${record.id === selectedRecordId ? "record-card--selected" : ""}`}
            key={record.id}
          >
            <div className="record-card__header">
              <h3>{record.id}</h3>
              <StatusBadge status={record.verificationStatus} />
            </div>
            <p>{record.rawText}</p>
            <div className="record-card__meta">
              <SourceLabel sourceType={record.sourceType} />
              <span>更新：{formatDateTime(record.updatedAt)}</span>
            </div>

            <div className="raw-details-mini">
              {(() => {
                const details = extractRawDetails(record.rawText);
                const hasDetails = rawDetailFields.some(
                  (field) => details[field.key],
                );
                if (!hasDetails) return null;
                return (
                  <dl className="raw-details-grid">
                    {rawDetailFields.map((field) =>
                      details[field.key] ? (
                        <div className="raw-detail-item" key={field.key}>
                          <dt>{field.label}</dt>
                          <dd>{details[field.key]}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                );
              })()}
            </div>

            <button type="button" onClick={() => onSelect(record.id)}>
              送到整理工作台
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
