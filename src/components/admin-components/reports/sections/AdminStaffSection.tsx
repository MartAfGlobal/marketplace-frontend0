"use client";

import { useEffect, useState } from "react";
import { UserSquare2, UserCheck, Activity } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import ReportStatusPill from "@/components/admin-components/reports/ReportStatusPill";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatDateTime, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";

const PAGE_SIZE = 100;

interface StaffRow {
  id: string;
  name: string;
  role: string | null;
  status: string;
  last_active: string | null;
  actions_taken: number;
}

export default function AdminStaffSection() {
  const { fetchStaffSummary, fetchStaffActivity } = ReportsDetails();

  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [staff, setStaff] = useState<{ count: number; results: StaffRow[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const load = () => {
    setSummaryLoading(true);
    setSummaryError(false);
    fetchStaffSummary({ period: "month" }, (d) => { setSummary(d); setSummaryLoading(false); }, () => { setSummaryError(true); setSummaryLoading(false); });
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableLoading(true);
    fetchStaffActivity(
      { search, page, page_size: PAGE_SIZE },
      (d: any) => { setStaff({ count: d?.count ?? 0, results: d?.results ?? [] }); setTableLoading(false); },
      () => setTableLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const columns: FinanceColumn<StaffRow>[] = [
    { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + staff.results.indexOf(r) + 1 },
    { header: "Staff Name", cell: (r) => r.name },
    { header: "Role", cell: (r) => r.role ?? "—" },
    { header: "Status", cell: (r) => <ReportStatusPill status={r.status} /> },
    { header: "Last Active", cell: (r) => formatDateTime(r.last_active) },
    { header: "Actions Taken", cell: (r) => r.actions_taken },
  ];

  const exportHeaders = ["S/N", "Staff Name", "Role", "Status", "Last Active", "Actions Taken"];
  const exportRows = () =>
    staff.results.map((r, i) => [(page - 1) * PAGE_SIZE + i + 1, r.name, r.role ?? "", r.status, formatDateTime(r.last_active), r.actions_taken]);
  const handleExportCsv = () => downloadCsv("admin-staff.csv", exportHeaders, exportRows());
  const handleExportPdf = () => downloadPdf("Admin Staff Report", "admin-staff.pdf", exportHeaders, exportRows());

  return (
    <div className="space-y-6">
      {summaryLoading ? (
        <ReportLoadingSkeleton />
      ) : summaryError || !summary ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatusFrame title="Total Staff" quantity={summary.total_staff} icon={<StatIcon tone="neutral"><UserSquare2 className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Active Staff" quantity={summary.active_staff} icon={<StatIcon tone="positive"><UserCheck className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Actions (this month)" quantity={summary.staff_actions_this_period} icon={<StatIcon tone="neutral"><Activity className="w-4 h-4" /></StatIcon>} />
          </div>

          {summary.staff_by_role?.length > 0 && (
            <div className="rounded-2xl border border-000000/8 p-6">
              <h3 className="text-base font-MontserratNormal text-000000/68 mb-4">Staff by role</h3>
              <div className="flex flex-wrap gap-3">
                {summary.staff_by_role.map((r: any) => (
                  <span key={r.role_id} className="text-c12 font-MontserratSemiBold px-3 py-2 rounded-c8 bg-[#947FFF]/10 text-[#947FFF]">
                    {r.role_name}: {r.count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {summary.most_active_admins?.length > 0 && (
            <div className="rounded-2xl border border-000000/8 p-6">
              <h3 className="text-base font-MontserratNormal text-000000/68 mb-4">Most active admins (this month)</h3>
              <FinanceTable
                rows={summary.most_active_admins}
                columns={[
                  { header: "Admin", cell: (r: any) => r.name },
                  { header: "Actions", cell: (r: any) => r.actions_count },
                ]}
                loading={false}
                rowKey={(r: any) => r.id}
                emptyMessage="No activity yet."
                compact
              />
            </div>
          )}
        </>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <h3 className="text-base font-MontserratNormal text-000000/68 mb-6">Staff</h3>
        <AdminListHeader searchExpandable searchVal={search} setSearchVal={(v) => { setSearch(v); setPage(1); }} placeholder="Search staff..." hidePeriod onExportClick={handleExportCsv} onExportPdfClick={handleExportPdf} />
        <FinanceTable rows={staff.results} columns={columns} loading={tableLoading} rowKey={(r) => r.id} emptyMessage="No staff found." />
        {staff.count > PAGE_SIZE && <Pagination currentPage={page} totalPages={Math.ceil(staff.count / PAGE_SIZE)} onPageChange={setPage} />}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
