"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "@/components/ui/forms/Label";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";

interface MaintenanceCardProps {
  /** The active general-settings row (holds maintenance_mode + maintenance_message). */
  data: Record<string, any> | null;
  canModify: boolean;
  /** Flip maintenance mode through the dedicated toggle endpoint (emails buyers/sellers). */
  onToggle: (next: boolean, done: () => void) => void;
  /** Persist the maintenance message via the plain general PATCH. */
  onSaveMessage: (message: string, done: () => void) => void;
  /** Flush section (no card chrome) inside the shared white container. */
  flush?: boolean;
}

/**
 * Maintenance-mode card. The toggle never flips silently: switching it
 * opens a confirm dialog spelling out that buyers/sellers get locked out
 * (on) or let back in (off) and are emailed either way. The message box is
 * a normal editable field saved with the rest of general settings.
 */
export default function MaintenanceCard({
  data,
  canModify,
  onToggle,
  onSaveMessage,
  flush,
}: MaintenanceCardProps) {
  const isOn = !!data?.maintenance_mode;

  // Confirm dialog for the pending toggle (null = closed).
  const [pending, setPending] = useState<boolean | null>(null);
  const [toggling, setToggling] = useState(false);

  // Inline edit of the maintenance message.
  const [editingMsg, setEditingMsg] = useState(false);
  const [draftMsg, setDraftMsg] = useState("");
  const [savingMsg, setSavingMsg] = useState(false);

  useEffect(() => {
    setDraftMsg(data?.maintenance_message ?? "");
  }, [data?.maintenance_message]);

  const requestToggle = () => {
    if (!canModify) return;
    setPending(!isOn);
  };

  const confirmToggle = () => {
    if (pending === null) return;
    setToggling(true);
    onToggle(pending, () => {
      setToggling(false);
      setPending(null);
    });
  };

  const saveMessage = () => {
    setSavingMsg(true);
    onSaveMessage(draftMsg, () => {
      setSavingMsg(false);
      setEditingMsg(false);
    });
  };

  return (
    <div
      className={
        flush
          ? "py-7 border-b border-000000/6 last:border-b-0"
          : "bg-white rounded-2xl p-6 border border-000000/4"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-c16 font-MontserratSemiBold text-161616">Maintenance mode</h3>
          <p className="text-c12 text-000000/50 mt-1 max-w-xl">
            When on, buyers and sellers are locked out and shown the maintenance
            message. Staff and admins keep full access. Turning it on or off
            emails every buyer and seller.
          </p>
        </div>
        <ToggleSwitch
          checked={isOn}
          disabled={!canModify || toggling}
          onChange={requestToggle}
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-c12 text-000000/60 block">Maintenance message</Label>
          {canModify && !editingMsg && (
            <button
              onClick={() => {
                setDraftMsg(data?.maintenance_message ?? "");
                setEditingMsg(true);
              }}
              className="flex items-center gap-1.5 text-c12 font-MontserratMedium text-ff715b hover:underline"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        {!editingMsg && (
          <p className="text-c14 text-161616 whitespace-pre-wrap">
            {data?.maintenance_message?.trim()
              ? data.maintenance_message
              : "No custom message set — a default maintenance message is shown to buyers and sellers."}
          </p>
        )}

        {editingMsg && (
          <>
            <textarea
              value={draftMsg}
              onChange={(e) => setDraftMsg(e.target.value)}
              rows={4}
              placeholder="The platform will be going on maintenance for 3-4 hours"
              className="w-full rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none p-3.5 text-sm text-gray-700"
            />
            <div className="flex justify-end gap-3 mt-3">
              <Button
                variant="secondary"
                className="!w-auto px-6"
                onClick={() => {
                  setDraftMsg(data?.maintenance_message ?? "");
                  setEditingMsg(false);
                }}
                disabled={savingMsg}
              >
                Cancel
              </Button>
              <Button className="!w-auto px-6" onClick={saveMessage} loading={savingMsg}>
                Save changes
              </Button>
            </div>
          </>
        )}
      </div>

      {pending !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-ff715b/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-ff715b" />
              </div>
              <div>
                <h4 className="text-c16 font-MontserratSemiBold text-161616">
                  {pending ? "Turn on maintenance mode?" : "Turn off maintenance mode?"}
                </h4>
                <p className="text-c13 text-000000/60 mt-2 leading-relaxed">
                  {pending ? (
                    <>
                      Buyers and sellers will be <b>locked out</b> of the platform
                      and emailed that maintenance has started. Staff and admins
                      keep access. This affects everyone immediately.
                    </>
                  ) : (
                    <>
                      Buyers and sellers will be let back in and emailed that
                      maintenance is <b>over</b> and they can sign in again.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                className="!w-auto px-6"
                onClick={() => setPending(null)}
                disabled={toggling}
              >
                Cancel
              </Button>
              <Button className="!w-auto px-6" onClick={confirmToggle} loading={toggling}>
                {pending ? "Yes, turn on" : "Yes, turn off"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
