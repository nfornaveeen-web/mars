import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Mail,
  MessageSquareText,
  Phone,
  Shield,
} from "lucide-react";
import AdminLogoutButton from "@/components/admin-logout-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminLoginPath,
  normalizeAdminRedirectPath,
  readAdminSession,
} from "@/lib/admin-auth";
import {
  getContactSubmissionById,
  getFollowUpStageOption,
  getContactSubmissionMeta,
  getContactSubmissionNeighbors,
  getLeadStatusOption,
  listContactSubmissionActivity,
  FOLLOW_UP_STAGE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  updateContactSubmissionWorkflow,
} from "@/lib/contact-records";

export const metadata: Metadata = {
  title: "Lead Details | Mars Technology Inc",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    returnTo?: string;
    saved?: string;
  }>;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeReturnPath(value?: string) {
  const normalized = normalizeAdminRedirectPath(value);
  return normalized.startsWith("/admin") ? normalized : "/admin";
}

function getSourceFilterFromReturnPath(value: string) {
  const url = new URL(value, "http://localhost");
  return url.searchParams.get("source")?.trim() ?? "";
}

function buildLeadDetailHref(id: number, returnTo: string) {
  return `/admin/leads/${id}?returnTo=${encodeURIComponent(returnTo)}`;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-2xl border border-border bg-muted px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-foreground">{value}</dd>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
  searchParams,
}: LeadDetailPageProps) {
  const resolvedParams = await params;
  const leadId = Number(resolvedParams.id);
  const loginRedirectPath =
    Number.isInteger(leadId) && leadId > 0
      ? `/admin/leads/${leadId}`
      : "/admin";
  const cookieStore = await cookies();
  const session = await readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? null,
  );

  if (!session) {
    redirect(getAdminLoginPath(loginRedirectPath));
  }

  if (!Number.isInteger(leadId) || leadId < 1) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const returnTo = normalizeReturnPath(resolvedSearchParams.returnTo);
  const sourceFilter = getSourceFilterFromReturnPath(returnTo);
  const showSavedState = resolvedSearchParams.saved === "1";
  const [submission, metadata, navigation] = await Promise.all([
    getContactSubmissionById(leadId),
    getContactSubmissionMeta(leadId),
    getContactSubmissionNeighbors(leadId, { source: sourceFilter }),
  ]);

  if (!submission) {
    notFound();
  }

  const productLabel =
    submission.product || submission.sku
      ? `${submission.product || "Unknown product"}${submission.sku ? ` (${submission.sku})` : ""}`
      : "General inquiry";
  const leadStatus = getLeadStatusOption(metadata?.status);
  const followUpStage = getFollowUpStageOption(metadata?.follow_up_stage);
  const activity = await listContactSubmissionActivity(leadId, metadata);
  const redirectParams = new URLSearchParams();
  redirectParams.set("returnTo", returnTo);

  async function updateLeadWorkflow(formData: FormData) {
    "use server";

    const actionCookies = await cookies();
    const actionSession = await readAdminSession(
      actionCookies.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? null,
    );

    if (!actionSession) {
      redirect(getAdminLoginPath(loginRedirectPath));
    }

    await updateContactSubmissionWorkflow({
      submissionId: leadId,
      status: String(formData.get("status") ?? ""),
      followUpStage: String(formData.get("followUpStage") ?? ""),
      internalNote: String(formData.get("internalNote") ?? ""),
      updatedByAdminUserId: actionSession.userId,
      updatedByEmail: actionSession.email,
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/leads/${leadId}`);

    const nextParams = new URLSearchParams(redirectParams);
    nextParams.set("saved", "1");
    redirect(`/admin/leads/${leadId}?${nextParams.toString()}`);
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-4xl border border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 bg-foreground px-8 py-10 text-background lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-4">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-background/20 bg-background/10 text-background hover:bg-background/15 hover:text-background"
              >
                <Link href={returnTo}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to inbox
                </Link>
              </Button>

              <div className="space-y-2">
                <p className="inline-flex rounded-full border border-background/15 bg-background/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-background/70">
                  Lead #{submission.id}
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {submission.name}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-background/70 sm:text-base">
                  Review the full inquiry, follow-up context, and request
                  metadata for this submission. Signed in as {session.email}.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-background/20 bg-background/10 text-background hover:bg-background/15 hover:text-background"
              >
                <a href={`mailto:${submission.email}`}>Reply by email</a>
              </Button>
              <AdminLogoutButton />
            </div>
          </div>

          <div className="grid gap-4 border-t border-border bg-muted/80 px-8 py-6 md:grid-cols-2 xl:grid-cols-5">
            <Card className="gap-3 border-border/80 bg-card py-5 shadow-none">
              <CardHeader className="px-5 pb-0">
                <CardDescription>Submitted</CardDescription>
                <CardTitle className="text-lg text-foreground">
                  {formatDateTime(submission.submitted_at)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="gap-3 border-border/80 bg-card py-5 shadow-none">
              <CardHeader className="px-5 pb-0">
                <CardDescription>Lead source</CardDescription>
                <CardTitle className="text-lg text-foreground">
                  {submission.source}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="gap-3 border-border/80 bg-card py-5 shadow-none">
              <CardHeader className="px-5 pb-0">
                <CardDescription>Requested product</CardDescription>
                <CardTitle className="text-lg text-foreground">
                  {productLabel}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="gap-3 border-border/80 bg-card py-5 shadow-none">
              <CardHeader className="px-5 pb-0">
                <CardDescription>Lead status</CardDescription>
                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${leadStatus.badgeClassName}`}
                  >
                    {leadStatus.label}
                  </span>
                </div>
              </CardHeader>
            </Card>
            <Card className="gap-3 border-border/80 bg-card py-5 shadow-none">
              <CardHeader className="px-5 pb-0">
                <CardDescription>Follow-up stage</CardDescription>
                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${followUpStage.badgeClassName}`}
                  >
                    {followUpStage.label}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </div>
        </section>
        {navigation.previous || navigation.next ? (
          <section className="rounded-3xl border border-border bg-card px-6 py-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Lead navigation
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse the next or previous lead in this filtered inbox view.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {navigation.previous ? (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-border"
                  >
                    <Link
                      href={buildLeadDetailHref(
                        navigation.previous.id,
                        returnTo,
                      )}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous lead
                    </Link>
                  </Button>
                ) : null}
                {navigation.next ? (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-border"
                  >
                    <Link
                      href={buildLeadDetailHref(navigation.next.id, returnTo)}
                    >
                      Next lead
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.85fr)] xl:items-start">
          <div className="space-y-8">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <CardTitle className="text-foreground">
                  Inquiry message
                </CardTitle>
                <CardDescription>
                  The complete message submitted from the contact flow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-3xl border border-border bg-muted px-6 py-5 text-sm leading-7 text-foreground whitespace-pre-wrap">
                  {submission.message}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background">
                  <Clock3 className="h-5 w-5" />
                </div>
                <CardTitle className="text-foreground">Lead activity</CardTitle>
                <CardDescription>
                  Internal note history with the stage and status snapshot
                  captured at save time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border bg-muted px-6 py-8 text-sm text-muted-foreground">
                    No lead activity has been recorded yet.
                  </div>
                ) : (
                  activity.map((entry) => {
                    const entryStatus = getLeadStatusOption(entry.status);
                    const entryStage = getFollowUpStageOption(
                      entry.follow_up_stage,
                    );

                    return (
                      <article
                        key={String(entry.id)}
                        className="rounded-3xl border border-border bg-muted px-5 py-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${entryStage.badgeClassName}`}
                            >
                              {entryStage.label}
                            </span>
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${entryStatus.badgeClassName}`}
                            >
                              {entryStatus.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(entry.created_at)}
                          </p>
                        </div>
                        <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
                          {entry.internal_note ||
                            "Workflow updated without an internal note."}
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                          {entry.created_by_email
                            ? `Logged by ${entry.created_by_email}.`
                            : entry.isSynthetic
                              ? "Recovered from earlier workflow notes."
                              : "Saved from the admin workflow."}
                        </p>
                      </article>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:sticky xl:top-8">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-foreground">Lead workflow</CardTitle>
                <CardDescription>
                  Private admin-only status, follow-up stage, and internal
                  notes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showSavedState ? (
                  <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                    Lead workflow was saved.
                  </div>
                ) : null}

                <div className="rounded-2xl border border-border bg-muted px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Current status
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${leadStatus.badgeClassName}`}
                      >
                        {leadStatus.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {leadStatus.description}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Follow-up stage
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${followUpStage.badgeClassName}`}
                      >
                        {followUpStage.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {followUpStage.description}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {metadata?.updated_at
                      ? `Last updated ${formatDateTime(metadata.updated_at)}${metadata.updated_by_email ? ` by ${metadata.updated_by_email}` : ""}.`
                      : "No private admin updates have been saved yet."}
                  </p>
                </div>

                <form action={updateLeadWorkflow} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="status"
                      className="text-sm font-medium text-foreground"
                    >
                      Lead status
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={leadStatus.value}
                      className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                    >
                      {LEAD_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="followUpStage"
                      className="text-sm font-medium text-foreground"
                    >
                      Follow-up stage
                    </label>
                    <select
                      id="followUpStage"
                      name="followUpStage"
                      defaultValue={followUpStage.value}
                      className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                    >
                      {FOLLOW_UP_STAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="internalNote"
                      className="text-sm font-medium text-foreground"
                    >
                      Add internal note
                    </label>
                    <Textarea
                      id="internalNote"
                      name="internalNote"
                      defaultValue=""
                      placeholder="Add a private update for this stage change, pricing discussion, objection, or next step."
                      className="min-h-40 border-border bg-card text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Each saved note is appended to Lead activity with the
                      selected follow-up stage.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="rounded-full bg-primary text-background hover:bg-primary/90"
                  >
                    Save lead details
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle className="text-foreground">Lead contact</CardTitle>
              <CardDescription>
                Primary follow-up details captured with the submission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="space-y-3">
                <DetailItem label="Email" value={submission.email} />
                <DetailItem
                  label="Phone"
                  value={submission.phone || "No phone provided"}
                />
                <DetailItem
                  label="Company"
                  value={submission.company || "No company provided"}
                />
              </dl>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-primary text-background hover:bg-primary/90"
                >
                  <a href={`mailto:${submission.email}`}>
                    <Mail className="h-4 w-4" />
                    Email lead
                  </a>
                </Button>
                {submission.phone ? (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-border"
                  >
                    <a href={`tel:${submission.phone}`}>
                      <Phone className="h-4 w-4" />
                      Call lead
                    </a>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-success/15 text-success">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-foreground">
                Submission context
              </CardTitle>
              <CardDescription>
                Helpful metadata for triage and attribution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <DetailItem label="Lead source" value={submission.source} />
                <DetailItem label="Requested product" value={productLabel} />
                <DetailItem
                  label="Submitted at"
                  value={formatDateTime(submission.submitted_at)}
                />
                <DetailItem
                  label="Stored at"
                  value={formatDateTime(submission.created_at)}
                />
                <DetailItem
                  label="Referrer"
                  value={submission.referrer || "No referrer recorded"}
                />
                <DetailItem
                  label="User agent"
                  value={submission.user_agent || "No user agent recorded"}
                />
              </dl>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
