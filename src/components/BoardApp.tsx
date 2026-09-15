"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FrequencyKind } from "@/lib/frequency";
import {
  addChoreLocal,
  addMemberLocal,
  completeLocal,
  exportLocalJSON,
  importLocalJSON,
  loadHousehold,
  setActiveLocal,
  toBoardView,
  undoLocal,
  type BoardView,
  type LocalHousehold,
} from "@/lib/local-board";
import type { PlannedChore } from "@/lib/plan-chores";
import { useToast } from "./Toast";
import { SlidingTabs } from "./SlidingTabs";
import { SuccessCheck } from "./SuccessCheck";
import { NumberPop } from "./NumberPop";
import { ChoreTile } from "./ChoreTile";
import { PlanPanel } from "./PlanPanel";
import { StampMotion } from "./StampMotion";

type Board = BoardView;

const TABS = [
  { id: "today", label: "Today" },
  { id: "rooms", label: "Rooms" },
  { id: "history", label: "History" },
  { id: "stuff", label: "Stuff" },
];

export function BoardApp() {
  const [household, setHousehold] = useState<LocalHousehold | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("today");
  const [completing, setCompleting] = useState<string | null>(null);
  const [justDone, setJustDone] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addRoom, setAddRoom] = useState("");
  const [addFreq, setAddFreq] = useState<FrequencyKind>("weekly");
  const [addError, setAddError] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [exiting, setExiting] = useState<Set<string>>(new Set());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { toast, node: toastNode } = useToast();

  const refresh = useCallback((h: LocalHousehold) => {
    setHousehold(h);
    const view = toBoardView(h);
    setBoard(view);
    setAddRoom((prev) => prev || view.rooms[0]?.id || "");
  }, []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const h = await loadHousehold();
      refresh(h);
      try {
        await fetch("/api/board", { cache: "no-store" });
      } catch {
        /* ignore */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeMember = useMemo(() => {
    if (!board) return null;
    return (
      board.members.find((m) => m.id === board.activeMemberId) ??
      board.members[0] ??
      null
    );
  }, [board]);

  const roomName = useCallback(
    (id: string) => board?.rooms.find((r) => r.id === id)?.name ?? "Room",
    [board]
  );

  async function complete(choreId: string) {
    if (!household || !activeMember) return;
    setCompleting(choreId);
    setExiting((prev) => new Set(prev).add(choreId));
    try {
      const next = await completeLocal(household, choreId, activeMember.id);
      // brief hold so exit animation can finish feeling physical
      await new Promise((r) => setTimeout(r, 180));
      refresh(next);
      setJustDone(true);
      setTimeout(() => setJustDone(false), 1200);
      toast(`Checked — ${activeMember.name}`);
    } catch (e) {
      setExiting((prev) => {
        const n = new Set(prev);
        n.delete(choreId);
        return n;
      });
      toast(e instanceof Error ? e.message : "Could not complete");
    } finally {
      setCompleting(null);
      setExiting((prev) => {
        const n = new Set(prev);
        n.delete(choreId);
        return n;
      });
    }
  }

  async function undo() {
    if (!household) return;
    const next = await undoLocal(household);
    refresh(next);
    toast(
      next.undoStack.length < household.undoStack.length
        ? "Undone"
        : "Nothing to undo"
    );
  }

  async function setActive(memberId: string) {
    if (!household) return;
    refresh(await setActiveLocal(household, memberId));
  }

  async function addChore() {
    if (!household || !activeMember) return;
    if (!addTitle.trim() || !(addRoom || household.rooms[0]?.id)) {
      setAddError(true);
      return;
    }
    setAddError(false);
    const next = await addChoreLocal(household, {
      title: addTitle.trim(),
      roomId: addRoom || household.rooms[0]!.id,
      frequencyKind: addFreq,
      createdBy: activeMember.id,
    });
    refresh(next);
    setAddTitle("");
    setShowAdd(false);
    toast("On the list");
  }

  async function addMember() {
    if (!household || !memberName.trim()) return;
    refresh(await addMemberLocal(household, memberName.trim()));
    setMemberName("");
    toast("In the house");
  }

  async function acceptPlan(chores: PlannedChore[], plannedRoom: string) {
    if (!household || !activeMember) return;
    let h = household;
    // find or create room by name
    let room =
      h.rooms.find(
        (r) => r.name.toLowerCase() === plannedRoom.toLowerCase()
      ) ?? null;
    if (!room) {
      // reuse first room if names don't match closely — keep simple
      room = h.rooms[0] ?? null;
    }
    if (!room) {
      toast("Add a room first");
      return;
    }
    for (const c of chores) {
      h = await addChoreLocal(h, {
        title: c.title,
        roomId: room.id,
        frequencyKind: c.frequencyKind,
        frequencyN: c.frequencyN,
        createdBy: activeMember.id,
        notes: c.notes,
      });
    }
    refresh(h);
    toast(`Added ${chores.length} chores`);
  }

  async function exportJson() {
    if (!household) return;
    const data = exportLocalJSON(household);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tileboard-backup.json";
    a.click();
    toast("Backup saved");
  }

  async function importJson(file: File) {
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const next = await importLocalJSON(payload);
      refresh(next);
      toast("Restored");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Import failed");
    }
  }

  const todayDue = useMemo(() => {
    if (!board) return [];
    return board.due.filter(
      (d) =>
        (d.status === "due" || d.status === "overdue") && !exiting.has(d.choreId)
    );
  }, [board, exiting]);

  const later = useMemo(() => {
    if (!board) return [];
    return board.due.filter((d) => d.status === "ok" || d.status === "fresh");
  }, [board]);

  if (loading && !board) {
    return (
      <main className="shell" style={{ padding: "3rem 0" }}>
        <div className="t-skel tile" style={{ padding: "1.5rem", minHeight: 120 }}>
          <div className="t-skel-skeleton is-pulsing">
            <div
              style={{
                height: 18,
                width: "40%",
                background: "var(--chalk)",
                marginBottom: 12,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                height: 14,
                width: "70%",
                background: "var(--chalk)",
                marginBottom: 8,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                height: 14,
                width: "55%",
                background: "var(--chalk)",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
        <p className="eyebrow" style={{ marginTop: "1rem" }}>
          Opening the list…
        </p>
      </main>
    );
  }

  if (error && !board) {
    return (
      <main className="shell" style={{ padding: "3rem 0" }}>
        <div className="tile" style={{ padding: "1.5rem" }}>
          <h1 className="font-display" style={{ fontSize: "1.75rem" }}>
            Board unavailable
          </h1>
          <p style={{ color: "var(--ink-soft)" }}>{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => void load()}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!board) return null;

  return (
    <>
      {toastNode}
      <StampMotion play={justDone} />
      <header
        className="shell no-print"
        style={{ paddingTop: "1.5rem", paddingBottom: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div className="billboard-ledger">
            <p className="eyebrow">Tileboard</p>
            <div className="t-stagger is-shown">
              <h1 className="font-display t-stagger-line">
                {board.household.name}
              </h1>
              <p
                className="t-stagger-line t-stagger-line--2"
                style={{
                  color: "var(--ink-soft)",
                  margin: "0.55rem 0 0",
                  maxWidth: 480,
                  fontSize: "1.05rem",
                }}
              >
                What’s due in this house today.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div
              className="streak-ring"
              style={{ ["--p" as string]: Math.min(100, board.streak.current * 12) }}
              title="Completion streak"
            >
              <span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  <NumberPop value={board.streak.current} />
                </div>
                <div className="eyebrow" style={{ fontSize: "0.55rem" }}>
                  streak
                </div>
              </span>
            </div>
            <SuccessCheck show={justDone} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginTop: "1.25rem",
            alignItems: "center",
          }}
        >
          <SlidingTabs tabs={TABS} value={tab} onChange={setTab} />
          <div style={{ flex: 1 }} />
          <label className="eyebrow" htmlFor="who">
            Acting as
          </label>
          <select
            id="who"
            className="field"
            style={{ width: "auto", minHeight: 40, padding: "0.4rem 0.7rem" }}
            value={activeMember?.id ?? ""}
            onChange={(e) => void setActive(e.target.value)}
          >
            {board.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="shell" style={{ paddingBottom: "5rem" }}>
        <div className="t-page-slide" data-page={tab === "stuff" ? "2" : "1"}>
          <section
            className="t-page"
            data-page-id="1"
            style={{ display: tab === "stuff" ? "none" : "block" }}
          >
            {tab === "today" && (
              <div className="t-skel is-revealed">
                <div className="t-skel-content" style={{ opacity: 1, filter: "none" }}>
                  <div className="job-strip" role="status">
                    <div className="job-strip-main">
                      <p className="job-verb">Due today → ink check</p>
                      <p className="job-hint">
                        Press once. Clear the plate.
                      </p>
                    </div>
                    <span className="job-count" aria-label={`${todayDue.length} due`}>
                      <NumberPop value={todayDue.length} />
                      <small>due</small>
                    </span>
                  </div>
                  <div
                    className="today-grid"
                    style={{
                      display: "grid",
                      gap: "1rem",
                      gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 0.75fr)",
                    }}
                  >
                    <div className="today-list-col">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <h2 className="section-title">
                          Due today
                        </h2>
                      </div>
                      {todayDue.length === 0 ? (
                        <div className="tile empty-quiet">
                          <img
                            src="/art/empty-checklist.png"
                            alt="Empty letterpress checklist — nothing due"
                            width={280}
                            height={280}
                          />
                          <p
                            className="section-title"
                            style={{ fontSize: "1.35rem", margin: 0 }}
                          >
                            Nothing due.
                          </p>
                          <p style={{ color: "var(--ink-mute)", marginBottom: "1rem" }}>
                            List a chore, or plan a room.
                          </p>
                          <div className="empty-quiet-actions">
                            <button
                              type="button"
                              className="btn btn-clay"
                              onClick={() => setShowAdd(true)}
                            >
                              Add a chore
                            </button>
                            <PlanPanel onAccept={acceptPlan} />
                          </div>
                        </div>
                      ) : (
                        <ul className="today-list">
                          {todayDue.map((d) => {
                            const chore = board.chores.find((c) => c.id === d.choreId);
                            const assignee = board.members.find(
                              (m) => m.id === chore?.assignee_id
                            );
                            return (
                            <ChoreTile
                              key={d.choreId}
                              due={d}
                              roomName={roomName(d.roomId)}
                              assigneeName={assignee?.name ?? null}
                              busy={!!completing}
                              onComplete={complete}
                            />
                            );
                          })}
                        </ul>
                      )}

                      {later.length > 0 && (
                        <div style={{ marginTop: "1.75rem" }}>
                          <h3 className="eyebrow" style={{ marginBottom: "0.6rem" }}>
                            Later
                          </h3>
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                              display: "grid",
                              gap: "0.45rem",
                            }}
                          >
                            {later.slice(0, 4).map((d) => (
                              <li
                                key={d.choreId}
                                className="tile later-card"
                                style={{
                                  padding: "0.75rem 1rem",
                                  display: "grid",
                                  gap: "0.35rem",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <span className="later-title">{d.title}</span>
                                  <span className="eyebrow">{d.dueAt}</span>
                                </div>
                                <div
                                  className="dirt-meter dirt-ok"
                                  style={{ opacity: 0.85 }}
                                >
                                  <div className="dirt-meter-track">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                      <span
                                        key={i}
                                        className={`dirt-seg${
                                          i < Math.round(d.dirt * 6) ? " is-on" : ""
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <aside className="tile today-aside" style={{ padding: "1.15rem", alignSelf: "start" }}>
                      <h2 className="section-title" style={{ marginTop: 0, fontSize: "1.05rem" }}>
                        Shared house
                      </h2>
                      <p className="eyebrow" style={{ marginBottom: "0.45rem" }}>
                        Who’s checking · invite {board.household.invite_code}
                      </p>
                      <div className="house-share-row" aria-label="Household members">
                        {board.members.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            className={`house-chip${m.id === activeMember?.id ? " is-active" : ""}`}
                            onClick={() => void setActive(m.id)}
                            title={`Act as ${m.name}`}
                          >
                            <span className="house-chip-mark" aria-hidden />
                            <span className="house-chip-name">{m.name}</span>
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <input
                          className="field"
                          placeholder="Add member"
                          value={memberName}
                          onChange={(e) => setMemberName(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-compact"
                          onClick={() => void addMember()}
                        >
                          Add
                        </button>
                      </div>
                      <div className="aside-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-compact"
                          onClick={() => void undo()}
                        >
                          Undo
                        </button>
                        <button
                          type="button"
                          className="btn btn-clay btn-compact"
                          onClick={() => setShowAdd((s) => !s)}
                        >
                          New chore
                        </button>
                        <PlanPanel onAccept={acceptPlan} />
                      </div>
                      <details style={{ marginTop: "0.85rem" }}>
                        <summary className="eyebrow" style={{ cursor: "pointer" }}>
                          Backup & print
                        </summary>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            marginTop: "0.65rem",
                          }}
                        >
                          <a
                            className="btn btn-ghost"
                            href="/print"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Print plan
                          </a>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => void exportJson()}
                          >
                            Export
                          </button>
                          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
                            Import
                            <input
                              type="file"
                              accept="application/json"
                              hidden
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) void importJson(f);
                              }}
                            />
                          </label>
                        </div>
                      </details>
                      {showAdd && (
                        <div
                          className={`t-input-wrap${addError ? " is-error" : ""}`}
                          style={{ marginTop: "1rem" }}
                        >
                          <label className="label">Title</label>
                          <input
                            className={`field t-input${addError ? " t-error is-error is-shaking" : ""}`}
                            value={addTitle}
                            onChange={(e) => {
                              setAddTitle(e.target.value);
                              setAddError(false);
                            }}
                            placeholder="e.g. Wipe counters"
                          />
                          <label className="label" style={{ marginTop: "0.6rem" }}>
                            Room
                          </label>
                          <select
                            className="field"
                            value={addRoom || board.rooms[0]?.id || ""}
                            onChange={(e) => setAddRoom(e.target.value)}
                          >
                            {board.rooms.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                          <label className="label" style={{ marginTop: "0.6rem" }}>
                            Frequency
                          </label>
                          <select
                            className="field"
                            value={addFreq}
                            onChange={(e) =>
                              setAddFreq(e.target.value as FrequencyKind)
                            }
                          >
                            <option value="daily">Daily</option>
                            <option value="every_n_days">Every few days</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                          {addError && (
                            <p className="t-error-msg">Add a title and room.</p>
                          )}
                          <button
                            type="button"
                            className="btn btn-clay"
                            style={{ marginTop: "0.75rem", width: "100%" }}
                            onClick={() => void addChore()}
                          >
                            Add chore
                          </button>
                        </div>
                      )}
                    </aside>
                  </div>
                </div>
              </div>
            )}

            {tab === "rooms" && (
              <div className="rooms-elevate">
                <div className="job-strip rooms-job">
                  <div className="job-strip-main">
                    <p className="job-verb">House rooms</p>
                    <p className="job-hint">
                      Cleanliness at a glance. Shared house.
                    </p>
                  </div>
                  <span className="job-count" aria-label={`${board.rooms.length} rooms`}>
                    <NumberPop value={board.rooms.length} />
                    <small>rooms</small>
                  </span>
                </div>
                <ul className="room-tile-grid">
                  {board.rooms.map((room) => {
                    const items = board.due.filter((d) => d.roomId === room.id);
                    const overdueN = items.filter((d) => d.status === "overdue").length;
                    const dueN = items.filter((d) => d.status === "due").length;
                    const hotN = overdueN + dueN;
                    const avgDirt =
                      items.length === 0
                        ? 0
                        : items.reduce((s, d) => s + d.dirt, 0) / items.length;
                    const mark =
                      overdueN > 0 ? "overdue" : dueN > 0 ? "due" : items.length ? "ok" : "idle";
                    return (
                      <li
                        key={room.id}
                        className={`room-tile${hotN > 0 ? " is-hot" : ""}${selectedRoomId === room.id ? " is-selected" : ""}`}
                        data-mark={mark}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setSelectedRoomId((id) => (id === room.id ? null : room.id))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedRoomId((id) => (id === room.id ? null : room.id));
                          }
                        }}
                      >
                        <div className="room-tile-top">
                          <h2 className="room-tile-name">{room.name}</h2>
                          <span
                            className={`room-tile-mark${mark !== "idle" ? ` is-${mark}` : ""}`}
                            title={
                              overdueN
                                ? `${overdueN} overdue`
                                : dueN
                                  ? `${dueN} due`
                                  : "Clear"
                            }
                            aria-hidden
                          />
                        </div>
                        <p className="room-tile-meta">
                          {items.length === 0
                            ? "No chores yet"
                            : hotN > 0
                              ? `${hotN} need a check`
                              : `${items.length} on the list`}
                        </p>
                        <div className="room-tile-pressure">
                          <div
                            className={`dirt-meter dirt-${
                              overdueN ? "overdue" : dueN ? "due" : "ok"
                            }`}
                          >
                            <div className="dirt-meter-track">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`dirt-seg${
                                    i < Math.round(avgDirt * 6) ? " is-on" : ""
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="room-tile-due-count">
                            {overdueN > 0
                              ? `Overdue · ${overdueN}`
                              : dueN > 0
                                ? `Due · ${dueN}`
                                : "Clear"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {selectedRoomId && (() => {
                  const room = board.rooms.find((r) => r.id === selectedRoomId);
                  const items = board.due.filter((d) => d.roomId === selectedRoomId);
                  if (!room) return null;
                  return (
                    <div className="room-detail-plate tile" key={selectedRoomId}>
                      <div className="room-detail-head">
                        <h3 className="room-tile-name">{room.name}</h3>
                        <button
                          type="button"
                          className="btn btn-ghost btn-compact"
                          onClick={() => setSelectedRoomId(null)}
                        >
                          Close
                        </button>
                      </div>
                      <ul className="room-detail-list">
                        {items.map((d) => (
                          <li key={d.choreId}>
                            <span className="later-title">{d.title}</span>
                            <span className={`status-pill status-${d.status}`}>
                              {d.status === "overdue"
                                ? `Overdue · ${d.overdueDays}d`
                                : d.status === "due"
                                  ? "Due today"
                                  : d.status}
                            </span>
                            <div
                              className={`dirt-meter dirt-${
                                d.status === "overdue" || d.status === "due"
                                  ? d.status
                                  : "ok"
                              }`}
                            >
                              <div className="dirt-meter-track">
                                {Array.from({ length: 6 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`dirt-seg${
                                      i < Math.round(d.dirt * 6) ? " is-on" : ""
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </li>
                        ))}
                        {items.length === 0 && (
                          <li className="room-tile-meta">No chores in this room yet.</li>
                        )}
                      </ul>
                    </div>
                  );
                })()}
              </div>
            )}

            {tab === "history" && (
              <div className="tile" style={{ padding: "1.15rem" }}>
                <h2 className="section-title" style={{ marginTop: 0 }}>
                  Shared history
                </h2>
                <p style={{ color: "var(--ink-mute)", marginTop: 0 }}>
                  Who checked what.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {board.history.map((h) => (
                    <li
                      key={h.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "10px 1fr auto",
                        gap: "0.75rem",
                        alignItems: "start",
                        padding: "0.65rem 0",
                        borderTop: "1px solid var(--rule)",
                      }}
                    >
                      <span className="member-dot history-mark" aria-hidden />
                      <div>
                        <strong>{h.chore_title}</strong>
                        <div style={{ color: "var(--ink-mute)", fontSize: "0.9rem" }}>
                          {h.member_name}
                          {h.note ? ` — ${h.note}` : ""}
                        </div>
                      </div>
                      <time className="eyebrow" dateTime={h.completed_at}>
                        {h.completed_at.slice(0, 16).replace("T", " ")}
                      </time>
                    </li>
                  ))}
                  {board.history.length === 0 && (
                    <li style={{ color: "var(--ink-mute)" }}>
                      Empty log. Check something off to begin.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </section>

          <section
            className="t-page"
            data-page-id="2"
            style={{ display: tab === "stuff" ? "block" : "none" }}
          >
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              <div className="tile" style={{ padding: "1.15rem" }}>
                <h2 className="section-title" style={{ marginTop: 0 }}>
                  Inventory
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {board.inventory.map((i) => (
                    <li
                      key={i.id}
                      style={{
                        padding: "0.45rem 0",
                        borderTop: "1px solid var(--rule)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{i.name}</span>
                      <span className="eyebrow">{i.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tile" style={{ padding: "1.15rem" }}>
                <h2 className="section-title" style={{ marginTop: 0 }}>
                  Household notes
                </h2>
                {board.recipes.map((r) => (
                  <article
                    key={r.id}
                    style={{ borderTop: "1px solid var(--rule)", paddingTop: "0.75rem" }}
                  >
                    <h3 style={{ margin: "0 0 0.35rem" }}>{r.title}</h3>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--ink-soft)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {r.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

    </>
  );
}
