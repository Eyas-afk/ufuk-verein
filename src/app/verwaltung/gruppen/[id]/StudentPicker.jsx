"use client";

import { useState } from "react";

export default function StudentPicker({ options, initialSelectedIds, t }) {
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = options.filter((o) => selectedIds.includes(o.id));
  const available = options.filter(
    (o) => !selectedIds.includes(o.id) && o.name.toLowerCase().includes(query.toLowerCase())
  );

  function add(id) {
    setSelectedIds((prev) => [...prev, id]);
    setQuery("");
  }

  function remove(id) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  return (
    <div>
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="studentIds" value={id} />
      ))}

      <div className="mb-2 flex flex-wrap gap-2">
        {selected.length === 0 && (
          <span className="text-sm text-neutral-500">{t.noStudentsYet}</span>
        )}
        {selected.map((s) => (
          <span
            key={s.id}
            className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm"
          >
            {s.name}
            {s.otherGroup && <span className="text-neutral-400"> {t.otherGroup}</span>}
            <button
              type="button"
              onClick={() => remove(s.id)}
              className="text-neutral-500 hover:text-red-600"
              aria-label={s.name}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-orange-600 underline"
        >
          {t.addStudent}
        </button>
      )}

      {open && (
        <div>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.typeToSearch}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
          <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white">
            {available.length === 0 && (
              <p className="p-2 text-sm text-neutral-500">{t.noResults}</p>
            )}
            {available.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => add(o.id)}
                className="block w-full px-3 py-2 text-start text-sm hover:bg-orange-50"
              >
                {o.name}
                {o.otherGroup && <span className="text-neutral-400"> {t.otherGroup}</span>}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-1 text-sm text-neutral-500 underline"
          >
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
}
