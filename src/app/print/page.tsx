"use client";

import { useEffect, useState } from "react";
import { frequencyLabel } from "@/lib/frequency";
import { loadHousehold, toBoardView, type BoardView } from "@/lib/local-board";

export default function PrintPage() {
  const [board, setBoard] = useState<BoardView | null>(null);

  useEffect(() => {
    void (async () => {
      const h = await loadHousehold();
      setBoard(toBoardView(h));
      setTimeout(() => window.print(), 400);
    })();
  }, []);

  if (!board) {
    return <main style={{ padding: "1.5rem" }}>Preparing printable plan…</main>;
  }

  const roomName = (id: string) =>
    board.rooms.find((r) => r.id === id)?.name ?? "";

  return (
    <main style={{ padding: "1.5rem", fontFamily: "Georgia, serif", color: "#1c2428" }}>
      <h1 style={{ marginBottom: 4 }}>Tileboard plan — {board.household.name}</h1>
      <p style={{ color: "#6b787e", marginTop: 0 }}>
        Printed {board.today} · invite {board.household.invite_code}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Chore", "Room", "Frequency", "Due", "Status"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  borderBottom: "2px solid #1c2428",
                  padding: "0.4rem 0.3rem",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {board.due.map((d) => (
            <tr key={d.choreId}>
              <td style={{ borderBottom: "1px solid #d6cec0", padding: "0.45rem 0.3rem" }}>
                {d.title}
              </td>
              <td style={{ borderBottom: "1px solid #d6cec0", padding: "0.45rem 0.3rem" }}>
                {roomName(d.roomId)}
              </td>
              <td style={{ borderBottom: "1px solid #d6cec0", padding: "0.45rem 0.3rem" }}>
                {frequencyLabel(d.frequency)}
              </td>
              <td style={{ borderBottom: "1px solid #d6cec0", padding: "0.45rem 0.3rem" }}>
                {d.dueAt}
              </td>
              <td style={{ borderBottom: "1px solid #d6cec0", padding: "0.45rem 0.3rem" }}>
                {d.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
