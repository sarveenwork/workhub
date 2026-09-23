import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { Alert, Card, EmptyState } from "@/src/components/ui";
import { FileText } from "lucide-react";

export default function EaFormPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="EA Form"
        description="Future-ready statutory year-end form generation."
      />
      <DemoBanner />
      <Alert tone="info" title="Coming soon">
        EA Form generation is not implemented in this frontend demo. Requirements
        for fields, PDF layout, and submission workflow are TO BE CONFIRMED and
        documented for the backend.
      </Alert>
      <Card>
        <EmptyState
          icon={FileText}
          title="EA Form preview"
          description="A statutory EA form preview will appear here once the backend payroll engine and form template are confirmed with the client."
        />
      </Card>
    </div>
  );
}
