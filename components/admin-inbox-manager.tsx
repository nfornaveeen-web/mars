"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AdminMessageTemplateRecord } from "@/lib/admin-message-templates";
import type { ContactSubmissionListItem } from "@/lib/contact-records";

type Option = {
  value: string;
  label: string;
  description?: string;
  badgeClassName?: string;
};

type ChannelOption = {
  value: string;
  label: string;
};

type AdminInboxManagerProps = {
  submissions: ContactSubmissionListItem[];
  returnToHref: string;
  templatesHref: string;
  previousHref: string;
  nextHref: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  offset: number;
  templates: AdminMessageTemplateRecord[];
  templateErrorMessage?: string;
  statusOptions: readonly Option[];
  followUpStageOptions: readonly Option[];
  channelOptions: readonly ChannelOption[];
};

type TemplateChannel = "email" | "whatsapp";

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatWorkflowUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatTemplateTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatProductLabel(product?: string | null, sku?: string | null) {
  if (product || sku) {
    return `${product || "Unknown product"}${sku ? ` (${sku})` : ""}`;
  }

  return "General inquiry";
}

function formatMessagePreview(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= 120) {
    return normalized;
  }

  return `${normalized.slice(0, 117)}...`;
}

function buildLeadHref(id: number, returnToHref: string) {
  return `/admin/leads/${id}?returnTo=${encodeURIComponent(returnToHref)}`;
}

function normalizePhoneForWhatsapp(value?: string | null) {
  return value?.replace(/\D/g, "") ?? "";
}

function renderTemplateValue(
  templateText: string,
  submission: ContactSubmissionListItem,
) {
  const replacements: Record<string, string> = {
    name: submission.name,
    first_name: submission.name.split(/\s+/)[0] ?? submission.name,
    company: submission.company ?? "",
    email: submission.email,
    phone: submission.phone ?? "",
    source: submission.source,
    product: submission.product ?? "",
    sku: submission.sku ?? "",
    product_label: formatProductLabel(submission.product, submission.sku),
  };

  return templateText.replace(/{{\s*([a-z_]+)\s*}}/gi, (_, key) => {
    return replacements[key.toLowerCase()] ?? "";
  });
}

function buildCustomMailtoHref(
  submission: ContactSubmissionListItem,
  subject: string,
  body: string,
) {
  const params = new URLSearchParams();

  if (subject.trim()) {
    params.set("subject", renderTemplateValue(subject, submission));
  }

  if (body.trim()) {
    params.set("body", renderTemplateValue(body, submission));
  }

  return `mailto:${submission.email}?${params.toString()}`;
}

function buildCustomWhatsappHref(
  submission: ContactSubmissionListItem,
  body: string,
) {
  const phone = normalizePhoneForWhatsapp(submission.phone);

  if (!phone || !body.trim()) {
    return null;
  }

  const params = new URLSearchParams({
    text: renderTemplateValue(body, submission),
  });
  return `https://wa.me/${phone}?${params.toString()}`;
}

function getWorkflowBadgeClassName(value?: string) {
  switch (value) {
    case "new":
    case "first-reachout":
      return "border-border bg-muted text-foreground";
    case "working":
    case "awaiting-reply":
      return "border-warning/20 bg-warning/10 text-warning";
    case "qualified":
    case "scheduled-follow-up":
      return "border-success/20 bg-success/10 text-success";
    case "quote-sent":
      return "border-info/20 bg-info/10 text-info";
    case "won":
    case "decision-pending":
      return "border-accent/20 bg-accent/10 text-accent";
    case "lost":
    case "new-inquiry":
    default:
      return "border-border bg-muted/75 text-foreground";
  }
}

export default function AdminInboxManager({
  submissions,
  returnToHref,
  templatesHref,
  previousHref,
  nextHref,
  hasPreviousPage,
  hasNextPage,
  offset,
  templates,
  templateErrorMessage,
  statusOptions,
  followUpStageOptions,
  channelOptions,
}: AdminInboxManagerProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkTab, setBulkTab] = useState("workflow");
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkFollowUpStage, setBulkFollowUpStage] = useState("");
  const [bulkInternalNote, setBulkInternalNote] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkErrorMessage, setBulkErrorMessage] = useState("");
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [outreachChannel, setOutreachChannel] =
    useState<TemplateChannel>("email");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [whatsappBody, setWhatsappBody] = useState("");

  useEffect(() => {
    const matchingTemplateIds = templates
      .filter((template) => template.channel === outreachChannel)
      .map((template) => template.id);

    if (
      selectedTemplateId !== null &&
      !matchingTemplateIds.includes(selectedTemplateId)
    ) {
      setSelectedTemplateId(null);
    }
  }, [outreachChannel, selectedTemplateId, templates]);

  useEffect(() => {
    const activeTemplate =
      selectedTemplateId === null
        ? null
        : (templates.find((template) => template.id === selectedTemplateId) ??
          null);

    if (!activeTemplate) {
      return;
    }

    if (activeTemplate.channel === "email") {
      setEmailSubject(activeTemplate.subject ?? "");
      setEmailBody(activeTemplate.body);
      return;
    }

    setWhatsappBody(activeTemplate.body);
  }, [selectedTemplateId, templates]);

  const selectedSubmissions = submissions.filter((submission) =>
    selectedIds.includes(submission.id),
  );
  const activeTemplate =
    selectedTemplateId === null
      ? null
      : (templates.find((template) => template.id === selectedTemplateId) ??
        null);
  const activeTemplates = templates.filter(
    (template) => template.channel === outreachChannel,
  );
  const outreachBody = outreachChannel === "email" ? emailBody : whatsappBody;
  const emailCanSend = Boolean(emailSubject.trim() && emailBody.trim());
  const whatsappCanSend = Boolean(whatsappBody.trim());

  function handleToggleSelection(submissionId: number) {
    setSelectedIds((currentSelection) => {
      if (currentSelection.includes(submissionId)) {
        return currentSelection.filter(
          (currentId) => currentId !== submissionId,
        );
      }

      return [...currentSelection, submissionId];
    });
  }

  function handleToggleAll(checked: boolean | "indeterminate") {
    if (checked) {
      setSelectedIds(submissions.map((submission) => submission.id));
      return;
    }

    setSelectedIds([]);
  }

  function handleOutreachChannelChange(event: ChangeEvent<HTMLSelectElement>) {
    setOutreachChannel(event.target.value as TemplateChannel);
  }

  function handleTemplateSelectionChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const templateId = Number(event.target.value) || null;
    setSelectedTemplateId(templateId);

    if (!templateId) {
      return;
    }

    const template = templates.find((item) => item.id === templateId);

    if (!template) {
      return;
    }

    if (template.channel === "email") {
      setEmailSubject(template.subject ?? "");
      setEmailBody(template.body);
      return;
    }

    setWhatsappBody(template.body);
  }

  function handleResetOutreachDraft() {
    setSelectedTemplateId(null);

    if (outreachChannel === "email") {
      setEmailSubject("");
      setEmailBody("");
      return;
    }

    setWhatsappBody("");
  }

  async function handleBulkWorkflowSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBulkMessage("");
    setBulkErrorMessage("");

    if (selectedIds.length === 0) {
      setBulkErrorMessage(
        "Select at least one lead before applying bulk actions.",
      );
      return;
    }

    if (!bulkStatus && !bulkFollowUpStage && !bulkInternalNote.trim()) {
      setBulkErrorMessage(
        "Choose a status, a follow-up stage, or add a note for the selected leads.",
      );
      return;
    }

    setIsBulkSubmitting(true);

    try {
      const response = await fetch("/api/admin/leads/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          submissionIds: selectedIds,
          status: bulkStatus || undefined,
          followUpStage: bulkFollowUpStage || undefined,
          internalNote: bulkInternalNote || undefined,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        updatedCount?: number;
      };

      if (!response.ok) {
        setBulkErrorMessage(
          payload.error || "Unable to update selected leads.",
        );
        return;
      }

      setBulkMessage(
        `Updated ${payload.updatedCount ?? selectedIds.length} selected lead${
          (payload.updatedCount ?? selectedIds.length) === 1 ? "" : "s"
        }.`,
      );
      setSelectedIds([]);
      setBulkStatus("");
      setBulkFollowUpStage("");
      setBulkInternalNote("");
      router.refresh();
    } catch (error) {
      setBulkErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update selected leads.",
      );
    } finally {
      setIsBulkSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-border bg-card px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Inbox tools</p>
            <p className="text-sm text-muted-foreground">
              {selectedIds.length > 0
                ? `${selectedIds.length} lead${selectedIds.length === 1 ? "" : "s"} selected for bulk actions.`
                : "Select leads to update workflow in bulk or preview outreach before forwarding it."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {selectedIds.length > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-border"
                onClick={() => setSelectedIds([])}
              >
                Clear selection
              </Button>
            ) : null}
            <Button
              asChild
              type="button"
              variant="outline"
              className="rounded-full border-border"
            >
              <Link href={templatesHref}>Open template library</Link>
            </Button>
          </div>
        </div>

        {bulkMessage ? (
          <div className="mt-4 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            {bulkMessage}
          </div>
        ) : null}

        {bulkErrorMessage ? (
          <div className="mt-4 rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {bulkErrorMessage}
          </div>
        ) : null}

        {selectedIds.length > 0 ? (
          <div className="mt-5 rounded-4xl border border-border bg-card px-5 py-5">
            <Tabs value={bulkTab} onValueChange={setBulkTab}>
              <TabsList>
                <TabsTrigger value="workflow">Bulk workflow</TabsTrigger>
                <TabsTrigger value="outreach">Bulk outreach</TabsTrigger>
              </TabsList>

              <TabsContent value="workflow">
                <form className="space-y-4" onSubmit={handleBulkWorkflowSubmit}>
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="bulk-status"
                      >
                        Status
                      </label>
                      <select
                        id="bulk-status"
                        value={bulkStatus}
                        onChange={(event) => setBulkStatus(event.target.value)}
                        className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="">Keep current status</option>
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="bulk-follow-up-stage"
                      >
                        Follow-up stage
                      </label>
                      <select
                        id="bulk-follow-up-stage"
                        value={bulkFollowUpStage}
                        onChange={(event) =>
                          setBulkFollowUpStage(event.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="">Keep current stage</option>
                        {followUpStageOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-foreground"
                      htmlFor="bulk-note"
                    >
                      Internal note
                    </label>
                    <Textarea
                      id="bulk-note"
                      value={bulkInternalNote}
                      onChange={(event) =>
                        setBulkInternalNote(event.target.value)
                      }
                      placeholder="Append the same workflow note to every selected lead."
                      className="min-h-32 border-border bg-card"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isBulkSubmitting}
                    className="rounded-full bg-primary text-background hover:bg-primary/90"
                  >
                    {isBulkSubmitting
                      ? "Applying bulk update..."
                      : "Apply bulk action"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="outreach" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                  <div className="space-y-4 rounded-3xl border border-border bg-muted px-4 py-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="outreach-channel"
                      >
                        Channel
                      </label>
                      <select
                        id="outreach-channel"
                        value={outreachChannel}
                        onChange={handleOutreachChannelChange}
                        className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        {channelOptions.map((channel) => (
                          <option key={channel.value} value={channel.value}>
                            {channel.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="outreach-template"
                      >
                        Start from template
                      </label>
                      <select
                        id="outreach-template"
                        value={selectedTemplateId ?? ""}
                        onChange={handleTemplateSelectionChange}
                        className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="">Write from scratch</option>
                        {activeTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {templateErrorMessage ? (
                      <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {templateErrorMessage}
                      </div>
                    ) : null}

                    {outreachChannel === "email" ? (
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="outreach-subject"
                        >
                          Subject
                        </label>
                        <Input
                          id="outreach-subject"
                          value={emailSubject}
                          onChange={(event) =>
                            setEmailSubject(event.target.value)
                          }
                          placeholder="Checking in on your {{product_label}} request"
                          className="border-border bg-card"
                        />
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="outreach-body"
                      >
                        {outreachChannel === "email"
                          ? "Email body"
                          : "Message body"}
                      </label>
                      <Textarea
                        id="outreach-body"
                        value={outreachBody}
                        onChange={(event) =>
                          outreachChannel === "email"
                            ? setEmailBody(event.target.value)
                            : setWhatsappBody(event.target.value)
                        }
                        placeholder={
                          outreachChannel === "email"
                            ? "Hi {{first_name}},\n\nI wanted to follow up on your interest in {{product_label}}..."
                            : "Hi {{first_name}}, thanks for reaching out about {{product_label}}..."
                        }
                        className="min-h-44 border-border bg-card"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-border"
                        onClick={handleResetOutreachDraft}
                      >
                        Reset draft
                      </Button>
                    </div>

                    <div className="rounded-2xl border border-border bg-card px-4 py-4 text-sm text-muted-foreground">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {activeTemplate
                              ? activeTemplate.name
                              : "Custom draft"}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {activeTemplate
                              ? `Updated ${formatTemplateTimestamp(activeTemplate.updated_at)}`
                              : "Write freely here or paste a template with placeholders."}
                          </p>
                        </div>
                      </div>

                      {activeTemplate?.subject ? (
                        <div className="mt-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Subject source
                          </div>
                          <div className="mt-2 whitespace-pre-wrap">
                            {activeTemplate.subject}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Placeholders
                      </div>
                      <div className="mt-2 leading-6">
                        {
                          "{{name}}, {{first_name}}, {{company}}, {{product_label}}, {{email}}, and {{phone}}"
                        }
                      </div>
                    </div>

                    {outreachChannel === "email" ? (
                      !emailCanSend ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-4 text-sm text-muted-foreground">
                          Write a subject and email body, or choose a saved
                          email template, before forwarding.
                        </div>
                      ) : null
                    ) : !whatsappCanSend ? (
                      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-4 text-sm text-muted-foreground">
                        Write a message body, or choose a saved WhatsApp
                        template, before forwarding.
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-4">
                    {selectedSubmissions.length > 0 &&
                    (outreachChannel === "email"
                      ? emailCanSend
                      : whatsappCanSend) ? (
                      selectedSubmissions.map((submission) => {
                        const mailtoHref = buildCustomMailtoHref(
                          submission,
                          emailSubject,
                          emailBody,
                        );
                        const whatsappHref = buildCustomWhatsappHref(
                          submission,
                          whatsappBody,
                        );

                        return (
                          <div
                            key={submission.id}
                            className="rounded-3xl border border-border bg-card px-5 py-5"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {submission.name}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {outreachChannel === "email"
                                    ? submission.email
                                    : submission.phone ||
                                      "No phone number available"}
                                </p>
                              </div>
                              {outreachChannel === "email" ? (
                                <Button
                                  asChild
                                  className="rounded-full bg-primary text-background hover:bg-primary/90"
                                >
                                  <a
                                    href={mailtoHref}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Forward email
                                  </a>
                                </Button>
                              ) : whatsappHref ? (
                                <Button
                                  asChild
                                  className="rounded-full bg-primary text-background hover:bg-primary/90"
                                >
                                  <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Forward message
                                  </a>
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled
                                  className="rounded-full border-border"
                                >
                                  No WhatsApp number
                                </Button>
                              )}
                            </div>

                            {outreachChannel === "email" &&
                            emailSubject.trim() ? (
                              <div className="mt-4 rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                  Subject preview
                                </div>
                                <div className="mt-2 whitespace-pre-wrap">
                                  {renderTemplateValue(
                                    emailSubject,
                                    submission,
                                  )}
                                </div>
                              </div>
                            ) : null}

                            <div className="mt-4 rounded-2xl border border-border bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground whitespace-pre-wrap">
                              {renderTemplateValue(outreachBody, submission)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
                        Select one or more leads, then write a message here or
                        start from a saved template to preview forwarding.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-4xl border border-border bg-card">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/80">
              <TableHead className="w-12 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Checkbox
                  checked={
                    submissions.length === 0
                      ? false
                      : selectedIds.length === submissions.length
                        ? true
                        : selectedIds.length > 0
                          ? "indeterminate"
                          : false
                  }
                  onCheckedChange={handleToggleAll}
                  aria-label="Select all leads on this page"
                />
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Submitted
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Lead
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Workflow
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Product
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Message
              </TableHead>
              <TableHead className="text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => {
              const leadStatus =
                statusOptions.find(
                  (option) => option.value === submission.workflow.status,
                ) ?? statusOptions[0];
              const followUpStage =
                followUpStageOptions.find(
                  (option) =>
                    option.value === submission.workflow.follow_up_stage,
                ) ?? followUpStageOptions[0];

              return (
                <TableRow key={submission.id}>
                  <TableCell className="align-top">
                    <Checkbox
                      checked={selectedIds.includes(submission.id)}
                      onCheckedChange={() =>
                        handleToggleSelection(submission.id)
                      }
                      aria-label={`Select ${submission.name}`}
                    />
                  </TableCell>
                  <TableCell className="align-top text-xs text-muted-foreground">
                    {formatSubmittedAt(submission.submitted_at)}
                  </TableCell>
                  <TableCell className="min-w-72 align-top whitespace-normal">
                    <Link
                      href={buildLeadHref(submission.id, returnToHref)}
                      className="font-medium text-foreground transition hover:text-accent"
                    >
                      {submission.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {submission.company || "No company"}
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-foreground">
                      <a
                        href={`mailto:${submission.email}`}
                        className="block font-medium text-accent hover:text-accent"
                      >
                        {submission.email}
                      </a>
                      <div className="text-xs text-muted-foreground">
                        {submission.phone || "No phone"}
                      </div>
                    </div>
                    <div className="mt-3 inline-flex rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {submission.source}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-56 align-top whitespace-normal">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getWorkflowBadgeClassName(leadStatus.value)}`}
                      >
                        {leadStatus.label}
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getWorkflowBadgeClassName(followUpStage.value)}`}
                      >
                        {followUpStage.label}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {submission.workflow.latest_activity_at
                        ? `Latest activity ${formatWorkflowUpdatedAt(submission.workflow.latest_activity_at)}`
                        : "No activity recorded yet"}
                    </div>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-sm text-muted-foreground">
                    {formatProductLabel(submission.product, submission.sku)}
                  </TableCell>
                  <TableCell className="max-w-[24rem] align-top whitespace-normal text-sm leading-6 text-muted-foreground">
                    {formatMessagePreview(submission.message)}
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-border"
                    >
                      <Link href={buildLeadHref(submission.id, returnToHref)}>
                        View details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          Page offset {offset}
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border"
          >
            <Link
              aria-disabled={!hasPreviousPage}
              className={
                !hasPreviousPage ? "pointer-events-none opacity-50" : undefined
              }
              href={previousHref}
            >
              Previous
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border"
          >
            <Link
              aria-disabled={!hasNextPage}
              className={
                !hasNextPage ? "pointer-events-none opacity-50" : undefined
              }
              href={nextHref}
            >
              Next
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
