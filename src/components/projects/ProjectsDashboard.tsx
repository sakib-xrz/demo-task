"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  useGetDashboardProjectsQuery,
  useGetProjectMetricsQuery,
  useGetTrafficHistoryQuery,
  useCreateDashboardProjectMutation,
} from "@/store/dashboardApi";
import { toast } from "sonner";
import { deltaParts, formatBigNumber } from "@/lib/dashboardFormat";
import { SemiCircleGauge } from "./SemiCircleGauge";
import { TrafficAreaChart } from "./TrafficAreaChart";

function InfoIcon({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#c5cdd9] text-[10px] font-semibold text-[#9aa6b8] ${className ?? ""}`}
      aria-hidden
    >
      i
    </span>
  );
}

function IconLineChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path
        d="M7.5 14.5l3-3 2.5 2.5 3.5-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path
        d="M7 17L17 7M7 7h10v10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlusCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        className="stroke-[#263B63]"
        strokeWidth="1.8"
      />
      <path
        d="M12 8v8M8 12h8"
        className="stroke-[#263B63]"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TabPlaceholderIcon({ seed }: { seed: string }) {
  const n = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
  if (n === 0) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="text-[#293a59]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    );
  }
  if (n === 1) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="text-[#293a59]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    );
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="text-[#293a59]"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function BlurredDashboardMock() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 scale-[1.02] p-6 blur-md opacity-[0.52]">
        <div className="grid grid-cols-3 gap-6 border-b border-slate-100 pb-6">
          <div>
            <div className="h-3 w-28 rounded bg-slate-200" />
            <div className="mt-3 flex items-end gap-2">
              <div className="h-10 w-16 rounded bg-blue-200" />
              <div className="h-4 w-12 rounded bg-slate-200" />
            </div>
            <div className="mx-auto mt-2 h-16 w-32 rounded-full border-8 border-slate-200" />
          </div>
          <div>
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="mt-3 h-10 w-24 rounded bg-blue-200" />
            <div className="mt-2 h-20 rounded bg-slate-100" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="mt-2 h-9 w-12 rounded bg-blue-200" />
            </div>
            <div>
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="mt-2 h-9 w-12 rounded bg-blue-200" />
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <div className="h-4 w-40 rounded bg-slate-200" />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {["ChatGPT", "Perplexity", "Gemini", "Copilot"].map((name) => (
            <div
              key={name}
              className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
            >
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="mt-2 h-7 w-10 rounded bg-blue-200" />
              <div className="mt-2 h-2 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CitationIcon({
  src,
  alt,
  width = 16,
  height = 16,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="shrink-0"
    />
  );
}

function CitationTile({
  icon,
  label,
  value,
  delta,
  pages,
  pagesDelta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: string;
  pages: string;
  pagesDelta?: string;
}) {
  return (
    <div className="py-3">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <span className="text-[15px] font-semibold leading-none tracking-[-0.01em] text-[#253b62]">
          {label}
        </span>
      </div>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-[52px] leading-none font-bold tracking-[-0.03em] text-[#1681e4]">
          {value}
        </span>
        {delta ? (
          <span
            className={`text-[22px] font-semibold leading-none ${
              delta.startsWith("-") ? "text-[#f29e30]" : "text-[#20a16a]"
            }`}
          >
            {delta}
          </span>
        ) : null}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-bold text-[#1681e4]">{pages}</span>
        <span className="text-[13px] font-medium text-[#5b6a83]">pages</span>
        {pagesDelta ? (
          <span
            className={`text-[13px] font-semibold ${
              pagesDelta.startsWith("-") ? "text-[#f29e30]" : "text-[#20a16a]"
            }`}
          >
            {pagesDelta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function AiCitationsSection() {
  return (
    <div className="mt-2 grid grid-cols-1 border-t border-[#e7ebf1] pt-4 lg:grid-cols-3">
      {/* Column 1: Overview + Gemini */}
      <div className="border-[#e7ebf1] lg:border-r lg:pr-7">
        <CitationTile
          icon={<CitationIcon src="/overview.svg" alt="Overview" />}
          label="Overview"
          value="57"
          delta="-33"
          pages="33"
          pagesDelta="-23"
        />
        <div className="border-t border-[#e7ebf1] pt-1">
          <CitationTile
            icon={
              <CitationIcon
                src="/gemini.svg"
                alt="Gemini"
                width={14}
                height={14}
              />
            }
            label="Gemini"
            value="0"
            pages="33"
            pagesDelta="+20"
          />
        </div>
      </div>

      {/* Column 2: ChatGPT + Copilot */}
      <div className="border-t border-[#e7ebf1] pt-4 lg:border-r lg:border-t-0 lg:px-7 lg:pt-0">
        <CitationTile
          icon={
            <CitationIcon
              src="/chatgpt.svg"
              alt="ChatGPT"
              width={12}
              height={12}
            />
          }
          label="ChatGPT"
          value="95"
          delta="+8"
          pages="33"
          pagesDelta="+12"
        />
        <div className="border-t border-[#e7ebf1] pt-1">
          <CitationTile
            icon={
              <CitationIcon
                src="/copilot.svg"
                alt="Copilot"
                width={12}
                height={12}
              />
            }
            label="Copilot"
            value="26"
            pages="33"
            pagesDelta="-19"
          />
        </div>
      </div>

      {/* Column 3: Perplexity */}
      <div className="border-t border-[#e7ebf1] pt-4 lg:border-t-0 lg:pl-7 lg:pt-0">
        <CitationTile
          icon={
            <CitationIcon
              src="/perplexity.svg"
              alt="Perplexity"
              width={11}
              height={12}
            />
          }
          label="Perplexity"
          value="73"
          pages="58"
          pagesDelta="-3"
        />
      </div>
    </div>
  );
}

export function ProjectsDashboard() {
  const { data: projectsRes, isLoading: projectsLoading } =
    useGetDashboardProjectsQuery();
  const projects = useMemo(() => projectsRes?.data ?? [], [projectsRes?.data]);
  const [userProject, setUserProject] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [createProject, { isLoading: creating }] =
    useCreateDashboardProjectMutation();

  const [showAddProject, setShowAddProject] = useState(false);

  const empty = !projectsLoading && projects.length === 0;
  const firstProject = projects[0]?.PROJECT;
  const activeProject = useMemo(() => {
    if (!projects.length) return null;
    if (userProject && projects.some((p) => p.PROJECT === userProject)) {
      return userProject;
    }
    return projects[0].PROJECT;
  }, [projects, userProject]);

  const isFirstActive = Boolean(
    activeProject && firstProject === activeProject,
  );

  const { data: metricsRes, isFetching: metricsFetching } =
    useGetProjectMetricsQuery(activeProject ?? "", {
      skip: !activeProject || empty,
    });
  const { data: trafficData, isFetching: trafficFetching } =
    useGetTrafficHistoryQuery(activeProject ?? "", {
      skip: !activeProject || empty,
    });

  const metrics = metricsRes?.metrics;
  const oldM = metricsRes?.oldMetrics;

  async function submitUrl() {
    const v = urlInput.trim();
    if (!v || creating) return;
    try {
      await createProject({ project: v }).unwrap();
      setUrlInput("");
      setUserProject(v);
      toast.success("Project created successfully");
    } catch {
      toast.error("Failed to create project. Please try again.");
    }
  }

  const contentBusy = metricsFetching || trafficFetching;

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 pb-14 pt-8 text-[#243659] sm:px-8">
      <div className="mx-auto max-w-[1030px]">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#20345a]">
            Projekte
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-[44px] items-center gap-2.5 rounded-full border border-[#d9dfe9] bg-white px-6 text-[14px] font-semibold text-[#243a62] shadow-sm tracking-[-0.01em]"
            >
              <IconLineChart className="h-5 w-5 text-[#2a3f65]" />
              Detailed Analytics
            </button>
            <button
              type="button"
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#d9dfe9] bg-white text-[#2a3f65] shadow-sm"
              aria-label="Open"
            >
              <IconArrowUpRight className="h-[18px] w-[18px] text-[#2a3f65]" />
            </button>
          </div>
        </header>

        {/* Project tabs */}
        <div className="mt-7 flex flex-wrap items-end gap-3">
          {projectsLoading && (
            <div className="h-[42px] w-44 animate-pulse rounded-t-xl bg-[#dfe6f1]" />
          )}
          {!projectsLoading &&
            projects.map((p) => {
              const active = p.PROJECT === activeProject && !empty;
              return (
                <button
                  key={p.PROJECT}
                  type="button"
                  onClick={() => setUserProject(p.PROJECT)}
                  className={
                    active
                      ? "relative z-10 -mb-px inline-flex h-[44px] items-center gap-2.5 rounded-t-[16px] border border-b-0 border-[#d9dfe9] bg-white px-6 text-[14px] font-semibold tracking-[-0.01em] text-[#3c4fc9]"
                      : "inline-flex h-[42px] items-center gap-2.5 rounded-full bg-[#eef2f9] px-5 text-[14px] font-semibold tracking-[-0.01em] text-[#2b3e61]"
                  }
                >
                  {p.THUMBNAIL ? (
                    <span
                      className="h-6 w-6 shrink-0 rounded bg-cover bg-center"
                      style={{ backgroundImage: `url(${p.THUMBNAIL})` }}
                      role="img"
                      aria-hidden
                    />
                  ) : (
                    <TabPlaceholderIcon seed={p.PROJECT} />
                  )}
                  <span className="max-w-[190px] truncate">{p.PROJECT}</span>
                </button>
              );
            })}
          {empty && !projectsLoading && (
            <div className="relative z-10 -mb-px inline-flex h-[44px] items-center gap-2.5 rounded-t-[16px] border border-b-0 border-[#d9dfe9] bg-white px-6 text-[14px] font-semibold tracking-[-0.01em] text-[#243a62]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#bcc6d8] bg-[#f4f7fc] text-[#243a62]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="lowercase">project</span>
            </div>
          )}
          {!empty && !projectsLoading && !showAddProject && (
            <button
              type="button"
              onClick={() => setShowAddProject(true)}
              className="inline-flex h-[42px] items-center gap-2.5 rounded-full bg-[#eef2f9] px-5 text-[14px] font-semibold tracking-[-0.01em] text-[#2b3e61] transition-colors hover:bg-[#e4eaf4]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#bcc6d8] bg-white text-[#243a62]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="lowercase">project</span>
            </button>
          )}
          {!empty && !projectsLoading && showAddProject && (
            <div className="inline-flex h-[42px] items-center gap-2 rounded-full border-2 border-[#3f4acf] bg-white px-3">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitUrl().then(() => setShowAddProject(false));
                  if (e.key === "Escape") {
                    setShowAddProject(false);
                    setUrlInput("");
                  }
                }}
                placeholder="Website URL"
                autoFocus
                className="min-w-0 w-[180px] border-0 bg-transparent text-[14px] font-medium tracking-[-0.01em] text-[#24395f] outline-none placeholder:text-[#9aa8bd]"
              />
              <button
                type="button"
                onClick={() => void submitUrl().then(() => setShowAddProject(false))}
                disabled={creating || !urlInput.trim()}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3f4acf] text-white disabled:opacity-40"
                aria-label="Add project"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => { setShowAddProject(false); setUrlInput(""); }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#9aa8bd] hover:text-[#24395f]"
                aria-label="Cancel"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Main card */}
        <div
          className={`relative -mt-px overflow-hidden border border-[#d9dfe9] bg-white shadow-sm ${
            isFirstActive || empty
              ? "rounded-2xl rounded-tl-none"
              : "rounded-2xl"
          }`}
        >
          {empty ? (
            <>
              <div className="relative z-20 flex items-center gap-2 border-b border-[#e7ebf1] px-7 py-5">
                <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#24395f]">
                  SEO Insights &amp; AI citations
                </h2>
                <InfoIcon />
              </div>
              <div className="relative min-h-[520px]">
                <BlurredDashboardMock />
                <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-center px-6 py-16">
                  <p className="max-w-[500px] text-center text-[14px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#20345a]">
                    Add your first project to view your Statistics
                  </p>
                  <div className="mt-10 w-full max-w-[560px]">
                    <div className="flex items-center gap-2 rounded-full border-[3px] border-[#3f4acf] bg-white py-3 pl-6 pr-2">
                      <input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void submitUrl();
                        }}
                        placeholder="Your Website URL"
                        className="min-w-0 flex-1 border-0 bg-transparent text-[16px] font-medium tracking-[-0.01em] text-[#24395f] outline-none placeholder:text-[#9aa8bd]"
                      />
                      <button
                        type="button"
                        onClick={() => void submitUrl()}
                        disabled={creating}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#24395f] disabled:opacity-50"
                        aria-label="Add project"
                      >
                        <IconPlusCircle />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* SEO Insights */}
              <div className="border-b border-[#e7ebf1] px-7 pb-7 pt-6">
                <div
                  key={activeProject ?? "x"}
                  className="dashboard-tab-panel"
                  style={{
                    opacity: contentBusy ? 0.65 : 1,
                    transition: "opacity 0.42s ease",
                  }}
                >
                  <div className="mb-6 flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#24395f]">
                      SEO Insights
                    </h2>
                    <InfoIcon />
                  </div>

                  <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
                    {/* Domain Rating */}
                    <div className="border-[#e7ebf1] pb-4 lg:border-r lg:pb-0 lg:pr-6">
                      <div className="flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.01em] text-[#3d506e]">
                        <span>Domain Rating (DR)</span>
                        <InfoIcon />
                      </div>
                      {metrics && (
                        <>
                          <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-[48px] leading-none font-bold tabular-nums tracking-[-0.03em] text-[#1681e4]">
                              {Math.round(metrics.DR)}
                            </span>
                            {(() => {
                              const d = deltaParts(
                                metrics.DR,
                                oldM?.DR ?? null,
                              );
                              return (
                                <>
                                  {d && (
                                    <span
                                      className={`text-[18px] font-semibold leading-none ${
                                        d.up
                                          ? "text-[#20a16a]"
                                          : "text-[#f29e30]"
                                      }`}
                                    >
                                      {d.text}
                                    </span>
                                  )}
                                  <span className="text-[16px] font-medium leading-none text-[#24395f]">
                                    /100
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                          <div className="mt-3">
                            <SemiCircleGauge value={metrics.DR} />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Organic Traffic */}
                    <div className="border-t border-[#e7ebf1] pt-5 lg:border-r lg:border-t-0 lg:px-6 lg:pt-0">
                      <div className="flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.01em] text-[#3d506e]">
                        <span>Organic traffic</span>
                        <InfoIcon />
                      </div>
                      {metrics && (
                        <>
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-[48px] leading-none font-bold tabular-nums tracking-[-0.03em] text-[#1681e4]">
                              {formatBigNumber(metrics.TRAFFIC)}
                            </span>
                            {(() => {
                              const d = deltaParts(
                                metrics.TRAFFIC,
                                oldM?.TRAFFIC ?? null,
                              );
                              if (!d) return null;
                              return (
                                <span
                                  className={`text-[18px] font-semibold leading-none ${
                                    d.up ? "text-[#20a16a]" : "text-[#f29e30]"
                                  }`}
                                >
                                  {d.text}
                                </span>
                              );
                            })()}
                          </div>
                          {trafficData && trafficData.length > 0 && (
                            <div className="mt-4">
                              <TrafficAreaChart data={trafficData} />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Keywords + Referring Domains */}
                    <div className="space-y-8 border-t border-[#e7ebf1] pt-5 lg:border-t-0 lg:pl-6 lg:pt-0">
                      <div>
                        <div className="flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.01em] text-[#3d506e]">
                          <span>Keywords</span>
                          <InfoIcon />
                        </div>
                        {metrics && (
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-[48px] leading-none font-bold tabular-nums tracking-[-0.03em] text-[#1681e4]">
                              {Math.round(metrics.KEYWORDS)}
                            </span>
                            {(() => {
                              const d = deltaParts(
                                metrics.KEYWORDS,
                                oldM?.KEYWORDS ?? null,
                              );
                              if (!d) return null;
                              return (
                                <span
                                  className={`text-[18px] font-semibold leading-none ${
                                    d.up ? "text-[#20a16a]" : "text-[#f29e30]"
                                  }`}
                                >
                                  {d.text}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="border-t border-[#e7ebf1] pt-6">
                          <div className="flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.01em] text-[#3d506e]">
                            <span>Referring Domains</span>
                            <InfoIcon />
                          </div>
                          {metrics && (
                            <div className="mt-3 flex items-baseline gap-2">
                              <span className="text-[48px] leading-none font-bold tabular-nums tracking-[-0.03em] text-[#1681e4]">
                                {Math.round(metrics.RD)}
                              </span>
                              {(() => {
                                const d = deltaParts(
                                  metrics.RD,
                                  oldM?.RD ?? null,
                                );
                                if (!d) return null;
                                return (
                                  <span
                                    className={`text-[18px] font-semibold leading-none ${
                                      d.up ? "text-[#20a16a]" : "text-[#f29e30]"
                                    }`}
                                  >
                                    {d.text}
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Citations */}
              <div className="relative px-7 pb-7 pt-5">
                <div className="mb-0 flex items-center gap-2">
                  <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#24395f]">
                    AI Citations
                  </h2>
                  <InfoIcon />
                </div>
                <div className="relative">
                  <div className="pointer-events-none select-none blur-[6px] opacity-50">
                    <AiCitationsSection />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[22px] font-semibold tracking-[-0.02em] text-[#243659]">
                      AI Citations coming soon
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
