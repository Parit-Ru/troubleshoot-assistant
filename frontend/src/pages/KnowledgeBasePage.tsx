import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/features/analytics/StatCard";
import { KBTabSwitcher, type KBTab } from "@/features/knowledge-base/KBTabSwitcher";
import { ManualsTable } from "@/features/knowledge-base/ManualsTable";
import { KBRecordsList } from "@/features/knowledge-base/KBRecordsList";
import { knowledgeBaseService } from "@/services/knowledgeBase.service";

export function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<KBTab>("manuals");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ manualCount: 0, chunkCount: 0 });

  useEffect(() => {
    knowledgeBaseService.getStats().then(setStats);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Knowledge Base</h1>
          <p className="text-sm text-slate-400">Indexed manuals and troubleshooting records</p>
        </div>
        <Button variant="primary">+ Upload Manual</Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Manuals" value={String(stats.manualCount)} />
        <StatCard label="Knowledge Chunks" value={String(stats.chunkCount)} />
        <StatCard label="KB Records" value={String(stats.chunkCount)} />
      </div>
      <KBTabSwitcher value={activeTab} onChange={setActiveTab} />
      <Input
        placeholder={
          activeTab === "manuals" ? "Search by brand, model, or device..." : "Search records..."
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {activeTab === "manuals" ? (
        <ManualsTable searchTerm={searchTerm} />
      ) : (
        <KBRecordsList searchTerm={searchTerm} />
      )}
    </div>
  );
}