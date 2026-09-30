"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, CalendarDays, Plus, X, Upload, Download } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import ReportStatusPill from "@/components/admin-components/reports/ReportStatusPill";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatDate, formatDateTime, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { toast } from "sonner";

const PAGE_SIZE = 100;

interface AuditRow {
  id: string;
  title: string;
  auditor_name: string;
  auditor_type: "INTERNAL" | "EXTERNAL";
  date_conducted: string;
  created_at: string;
  status: string;
}

export default function AuditsSection() {
  const { can } = useAdminAccess();
  const canCreate = can("REPORTS", "create");

  const { fetchAuditSummary, fetchAudits, fetchAuditDetail, createAudit } = ReportsDetails();

  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);

  const [page, setPage] = useState(1);
  const [audits, setAudits] = useState<{ count: number; results: AuditRow[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = () => {
    setSummaryLoading(true);
    setSummaryError(false);
    fetchAuditSummary({ period: "month" }, (d) => { setSummary(d); setSummaryLoading(false); }, () => { setSummaryError(true); setSummaryLoading(false); });
  };

  const loadAudits = () => {
    setTableLoading(true);
    fetchAudits({ page, page_size: PAGE_SIZE }, (d: any) => {
      setAudits({ count: d?.count ?? 0, results: d?.results ?? [] });
      setTableLoading(false);
    }, () => setTableLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(loadAudits, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: FinanceColumn<AuditRow>[] = [
    { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + audits.results.indexOf(r) + 1 },
    { header: "Title/Scope", cell: (r) => r.title },
    { header: "Auditor", cell: (r) => r.auditor_name },
    { header: "Auditor Type", cell: (r) => (r.auditor_type === "INTERNAL" ? "Internal" : "External") },
    { header: "Date Conducted", cell: (r) => formatDate(r.date_conducted) },
    { header: "Date Logged", cell: (r) => formatDateTime(r.created_at) },
    { header: "Status", cell: (r) => <ReportStatusPill status={r.status} /> },
  ];

  const exportHeaders = ["S/N", "Title/Scope", "Auditor", "Auditor Type", "Date Conducted", "Date Logged", "Status"];
  const exportRows = () =>
    audits.results.map((r, i) => [
      (page - 1) * PAGE_SIZE + i + 1,
      r.title, r.auditor_name, r.auditor_type === "INTERNAL" ? "Internal" : "External",
      formatDate(r.date_conducted), formatDateTime(r.created_at), r.status,
    ]);
  const handleExportCsv = () => downloadCsv("audits.csv", exportHeaders, exportRows());
  const handleExportPdf = () => downloadPdf("Audits Report", "audits.pdf", exportHeaders, exportRows());

  return (
    <div className="space-y-6">
      {summaryLoading ? (
        <ReportLoadingSkeleton />
      ) : summaryError || !summary ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusFrame title="Total Audits Conducted" quantity={summary.total_audits_conducted} icon={<StatIcon tone="neutral"><FileText className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Audits This Period" quantity={summary.audits_this_period} icon={<StatIcon tone="positive"><FileText className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Last Audit Date" quantity={summary.last_audit_date ? formatDate(summary.last_audit_date) : "—"} icon={<StatIcon tone="neutral"><CalendarDays className="w-4 h-4" /></StatIcon>} />
        </div>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-MontserratNormal text-000000/68">Audit history</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 text-c12 font-MontserratSemiBold px-3 py-2.5 rounded-c8 bg-gray-100 text-000000/68 hover:bg-gray-200 transition-all cursor-pointer"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 text-c12 font-MontserratSemiBold px-3 py-2.5 rounded-c8 bg-gray-100 text-000000/68 hover:bg-gray-200 transition-all cursor-pointer"
              title="Export PDF"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            {canCreate && (
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 text-c12 font-MontserratSemiBold px-4 py-2.5 rounded-c8 bg-[#ff715b] text-white hover:bg-opacity-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Audit
              </button>
            )}
          </div>
        </div>
        <FinanceTable
          rows={audits.results}
          columns={columns}
          loading={tableLoading}
          rowKey={(r) => r.id}
          emptyMessage="No audits logged yet."
          actions={[{ label: "View Details", onSelect: (r) => fetchAuditDetail(r.id, (d) => setSelected(d)) }]}
        />
        {audits.count > PAGE_SIZE && <Pagination currentPage={page} totalPages={Math.ceil(audits.count / PAGE_SIZE)} onPageChange={setPage} />}
      </div>

      <DataAsOf at={new Date()} />

      {selected && <AuditDetailModal audit={selected} onClose={() => setSelected(null)} />}
      {createOpen && (
        <NewAuditModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => { setCreateOpen(false); load(); loadAudits(); }}
          createAudit={createAudit}
        />
      )}
    </div>
  );
}

function AuditDetailModal({ audit, onClose }: { audit: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-c18 font-MontserratSemiBold">{audit.title}</h2>
          <button onClick={onClose} className="cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3 text-c12 font-MontserratNormal">
          <p><span className="text-000000/44">Auditor:</span> {audit.auditor_name} ({audit.auditor_role ?? "—"}, {audit.auditor_type === "INTERNAL" ? "Internal" : "External"})</p>
          <p><span className="text-000000/44">Date conducted:</span> {formatDate(audit.date_conducted)}</p>
          <p><span className="text-000000/44">Date logged:</span> {formatDateTime(audit.created_at)}</p>
          <div>
            <p className="text-000000/44 mb-1">Scope & purpose:</p>
            <p className="whitespace-pre-wrap">{audit.description}</p>
          </div>
          {audit.notes && (
            <div>
              <p className="text-000000/44 mb-1">Notes:</p>
              <p className="whitespace-pre-wrap">{audit.notes}</p>
            </div>
          )}
          <div>
            <p className="text-000000/44 mb-2">Result file(s):</p>
            <div className="space-y-2">
              {(audit.result_files ?? []).map((f: any) => (
                <a
                  key={f.id}
                  href={f.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#ff715b] hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" /> {f.original_filename || "Download file"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewAuditModal({
  onClose, onCreated, createAudit,
}: {
  onClose: () => void;
  onCreated: () => void;
  createAudit: (formData: FormData, onSuccess: (d: any) => void, onError?: (err: any) => void) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateConducted, setDateConducted] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = title.trim() && description.trim() && dateConducted && files.length > 0 && acknowledged && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("date_conducted", dateConducted);
    fd.append("notes", notes);
    files.forEach((f) => fd.append("files", f));

    createAudit(
      fd,
      () => { setSubmitting(false); toast.success("Audit logged. This record is now permanent and read-only."); onCreated(); },
      () => { setSubmitting(false); toast.error("Could not log this audit. Please check the form and try again."); },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-c18 font-MontserratSemiBold">New Audit</h2>
          <button onClick={onClose} className="cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-c12 font-MontserratSemiBold block mb-1.5">Title / scope</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-000000/12 rounded-c8 px-3 py-2.5 text-c12 outline-none focus:border-[#ff715b]"
              placeholder="e.g. Q3 KYC Compliance Review"
            />
          </div>
          <div>
            <label className="text-c12 font-MontserratSemiBold block mb-1.5">Date conducted</label>
            <input
              type="date"
              value={dateConducted}
              onChange={(e) => setDateConducted(e.target.value)}
              className="w-full border border-000000/12 rounded-c8 px-3 py-2.5 text-c12 outline-none focus:border-[#ff715b]"
            />
          </div>
          <div>
            <label className="text-c12 font-MontserratSemiBold block mb-1.5">Description of scope and purpose</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-000000/12 rounded-c8 px-3 py-2.5 text-c12 outline-none focus:border-[#ff715b] resize-none"
            />
          </div>
          <div>
            <label className="text-c12 font-MontserratSemiBold block mb-1.5">Notes (findings, methodology, caveats) -- optional</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-000000/12 rounded-c8 px-3 py-2.5 text-c12 outline-none focus:border-[#ff715b] resize-none"
            />
          </div>
          <div>
            <label className="text-c12 font-MontserratSemiBold block mb-1.5">Result file(s)</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-000000/20 rounded-c8 py-4 flex flex-col items-center gap-1.5 text-c12 text-000000/44 hover:border-[#ff715b] transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Click to upload (PDF, Word, Excel, CSV, or images -- up to 25MB each)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li key={i} className="text-c12 text-000000/68 flex items-center justify-between">
                    <span>{f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
                    <button onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="flex items-start gap-2.5 text-c12 text-000000/68 cursor-pointer">
            <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-0.5" />
            I understand this audit record cannot be edited or deleted once submitted, by any role, including Super Admin.
          </label>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-c8 bg-[#ff715b] text-white font-MontserratSemiBold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? <LoadingSpinner size={16} color="border-white" /> : "Submit audit"}
          </button>
        </div>
      </div>
    </div>
  );
}
