"use client";

import { useState } from "react";

export default function TeacherPicker({ options, initialId }) {
  const [selectedId, setSelectedId] = useState(initialId ?? "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.id === selectedId);
  const available = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  function select(id) {
    setSelectedId(id);
    setQuery("");
    setOpen(false);
  }

  return (
    <div>
      <input type="hidden" name="teacherId" value={selectedId} />

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-left"
        >
          {selected ? selected.name : "Kein Lehrer zugewiesen"}
        </button>
      )}

      {open && (
        <div>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Namen eingeben …"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
          <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => select("")}
              className="block w-full px-3 py-2 text-left text-sm text-neutral-500 hover:bg-orange-50"
            >
              Kein Lehrer zugewiesen
            </button>
            {available.length === 0 && (
              <p className="p-2 text-sm text-neutral-500">Keine Treffer.</p>
            )}
            {available.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => select(o.id)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-orange-50"
              >
                {o.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-1 text-sm text-neutral-500 underline"
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}
