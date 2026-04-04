import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MedicationHistory({ logs }) {
  const [sortField, setSortField] = useState("injection_date");
  const [sortDir, setSortDir] = useState(-1);
  const [expanded, setExpanded] = useState(true);

  const sorted = [...logs].sort((a, b) => {
    if (sortField === "injection_date") {
      return sortDir * (new Date(b.injection_date) - new Date(a.injection_date));
    }
    return sortDir * ((a[sortField] || 0) - (b[sortField] || 0));
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => d * -1);
    } else {
      setSortField(field);
      setSortDir(-1);
    }
  };

  if (logs.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
      <button
        className="w-full px-4 py-3 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-heading text-base text-pakistani-green">Injection History</h3>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body font-light">
            <thead>
              <tr className="border-t border-border bg-muted/50">
                <th
                  className="px-3 py-2 text-left cursor-pointer hover:text-foreground text-muted-foreground"
                  onClick={() => toggleSort("injection_date")}
                >
                  Date {sortField === "injection_date" && (sortDir > 0 ? "↑" : "↓")}
                </th>
                <th
                  className="px-3 py-2 text-left cursor-pointer hover:text-foreground text-muted-foreground"
                  onClick={() => toggleSort("clicks")}
                >
                  Clicks {sortField === "clicks" && (sortDir > 0 ? "↑" : "↓")}
                </th>
                <th className="px-3 py-2 text-left text-muted-foreground">mg</th>
                <th className="px-3 py-2 text-left text-muted-foreground">Site</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-3 py-2.5">
                    {new Date(log.injection_date).toLocaleDateString("en-AU", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2.5 font-medium">{log.clicks}</td>
                  <td className="px-3 py-2.5">{log.mg_dose}mg</td>
                  <td className="px-3 py-2.5">{log.injection_site}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}