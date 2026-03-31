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
      className={`inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-[#c5cdd9] text-[10px] font-semibold text-[#9aa6b8] ${className ?? ""}`}
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
      <div className="absolute inset-0 scale-[1.02] px-7 pt-6 blur-[6px] opacity-60">
        {/* Top row: DR, Organic Traffic, Keywords */}
        <div className="grid grid-cols-3 gap-0 border-b border-[#e7ebf1] pb-6">
          {/* Domain Rating */}
          <div className="border-r border-[#e7ebf1] pr-6">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-medium text-[#3d506e]">
                Domain Rating (DR)
              </span>
              <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#c5cdd9] text-[10px] font-semibold text-[#9aa6b8]">
                i
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-[48px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                77
              </span>
              <span className="text-[16px] font-medium leading-none text-[#24395f]">
                /100
              </span>
            </div>
            <div className="mx-auto mt-3 flex justify-center">
              <svg
                viewBox="0 0 200 110"
                className="h-auto w-full max-w-52.5"
                aria-hidden
              >
                <path
                  d="M 32 95 A 68 68 0 0 1 168 95"
                  fill="none"
                  stroke="#e8ecf2"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M 32 95 A 68 68 0 0 1 168 95"
                  fill="none"
                  stroke="#5ba3eb"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray="164.5 214"
                />
              </svg>
            </div>
          </div>
          {/* Organic Traffic */}
          <div className="border-r border-[#e7ebf1] px-6">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-medium text-[#3d506e]">
                Organic traffic
              </span>
              <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#c5cdd9] text-[10px] font-semibold text-[#9aa6b8]">
                i
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[48px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                429.1K
              </span>
              <span className="text-[18px] font-semibold leading-none text-[#20a16a]">
                +22K
              </span>
            </div>
            <div className="mt-4 h-30 w-full">
              <svg
                viewBox="0 0 280 120"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="mock-area-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                    <stop
                      offset="100%"
                      stopColor="#3b82f6"
                      stopOpacity="0.01"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0 90 Q40 85 70 70 T140 50 T210 30 T280 20 V120 H0 Z"
                  fill="url(#mock-area-grad)"
                />
                <path
                  d="M0 90 Q40 85 70 70 T140 50 T210 30 T280 20"
                  fill="none"
                  stroke="#2383eb"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          {/* Keywords */}
          <div className="pl-6">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-medium text-[#3d506e]">
                Keywords
              </span>
              <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#c5cdd9] text-[10px] font-semibold text-[#9aa6b8]">
                i
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[48px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                273
              </span>
              <span className="text-[18px] font-semibold leading-none text-[#20a16a]">
                +18
              </span>
            </div>
          </div>
        </div>

        {/* AI Citations label */}
        <div className="mt-5 flex items-center gap-2">
          image.png
          <span className="text-[16px] font-semibold text-[#24395f]">
            AI Citations
          </span>
          <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#c5cdd9] text-[10px] font-semibold text-[#9aa6b8]">
            i
          </span>
        </div>

        {/* AI Citation tiles grid */}
        <div className="mt-4 grid grid-cols-3 border-t border-[#e7ebf1] pt-4">
          {/* Col 1: Overview + Gemini */}
          <div className="border-r border-[#e7ebf1] pr-7">
            <div className="py-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#4a7cc9]" />
                <span className="text-[15px] font-semibold text-[#253b62]">
                  Overview
                </span>
              </div>
              <span className="text-[52px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                57
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[13px] font-medium text-[#5b6a83]">
                  33 pages
                </span>
                <span className="text-[13px] font-semibold text-[#f29e30]">
                  -23
                </span>
              </div>
            </div>
            <div className="border-t border-[#e7ebf1] py-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#e44040]" />
                <span className="text-[15px] font-semibold text-[#253b62]">
                  Gemini
                </span>
              </div>
              <span className="text-[52px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                0
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[13px] font-medium text-[#5b6a83]">
                  33 pages
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: ChatGPT + Copilot */}
          <div className="border-r border-[#e7ebf1] px-7">
            <div className="py-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#10a37f]" />
                <span className="text-[15px] font-semibold text-[#253b62]">
                  ChatGPT
                </span>
              </div>
              <span className="text-[52px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                95
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[13px] font-medium text-[#5b6a83]">
                  33 pages
                </span>
                <span className="text-[13px] font-semibold text-[#20a16a]">
                  +12
                </span>
              </div>
            </div>
            <div className="border-t border-[#e7ebf1] py-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#4a90d9]" />
                <span className="text-[15px] font-semibold text-[#253b62]">
                  Copilot
                </span>
              </div>
              <span className="text-[52px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                26
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[13px] font-medium text-[#5b6a83]">
                  33 pages
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Perplexity */}
          <div className="pl-7">
            <div className="py-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#1a73e8]" />
                <span className="text-[15px] font-semibold text-[#253b62]">
                  Perplexity
                </span>
              </div>
              <span className="text-[52px] font-bold leading-none tracking-[-0.03em] text-[#1681e4]">
                73
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[13px] font-medium text-[#5b6a83]">
                  58 pages
                </span>
              </div>
            </div>
          </div>
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
  const activeProject = useMemo(() => {
    if (!projects.length) return null;
    if (userProject && projects.some((p) => p.PROJECT === userProject)) {
      return userProject;
    }
    return projects[0].PROJECT;
  }, [projects, userProject]);

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
    <div className="min-h-screen bg-[#FFFFFF] px-6 pb-14 pt-8 text-[#243659] sm:px-8">
      <div className="mx-auto max-w-257.5">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#2B456B]">
            Projekte
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10.5 items-center gap-2.5 rounded-full bg-[#F5F8FA] px-6 text-base font-semibold text-[#2B456B] tracking-[-0.01em]"
            >
              <IconLineChart className="h-5 w-5 text-[#2a3f65]" />
              Detailed Analytics
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F8FA] text-[#2B456B]"
              aria-label="Open"
            >
              <IconArrowUpRight className="h-4.5 w-4.5 text-[#2a3f65]" />
            </button>
          </div>
        </header>

        {/* Project tabs */}
        <div className="relative z-20 -mb-px mt-7 flex w-full items-end overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          {projectsLoading && (
            <div className="mx-1 h-10.5 w-44 animate-pulse rounded-full bg-[#dfe6f1]" />
          )}
          {!projectsLoading &&
            projects.map((p, index) => {
              const active = p.PROJECT === activeProject && !empty;

              const iconNode = p.THUMBNAIL ? (
                <span
                  className="h-5 w-5 shrink-0 rounded bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${p.THUMBNAIL})`,
                  }}
                  role="img"
                  aria-hidden
                />
              ) : (
                <TabPlaceholderIcon seed={p.PROJECT} />
              );

              if (active) {
                return (
                  <div
                    key={p.PROJECT}
                    className="relative z-30 mx-1 shrink-0 rounded-t-[20px] border border-b-0 border-[#d9dfe9] bg-white p-1.5 first:ml-0"
                  >
                    <button
                      type="button"
                      onClick={() => setUserProject(p.PROJECT)}
                      className="flex items-center gap-2 rounded-full border-2 border-[#3E4FEA] bg-[#3E4FEA]/10 px-5 py-1.5 text-[14px] font-semibold text-[#3E4FEA] transition-all"
                    >
                      {iconNode}
                      <span className="max-w-47.5 truncate whitespace-nowrap">
                        {p.PROJECT}
                      </span>
                    </button>

                    <svg
                      className={`absolute -left-4 w-4 h-4 ${index === 0 ? "-bottom-0.5" : "bottom-0"}`}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 0V16H0C8.83656 16 16 8.83656 16 0Z"
                        fill="white"
                      />
                      <path
                        d="M0 16C8.83656 16 16 8.83656 16 0"
                        stroke="#d9dfe9"
                        strokeWidth="1"
                      />
                    </svg>

                    <svg
                      className="absolute -right-4 bottom-0 h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0V16H16C7.16344 16 0 8.83656 0 0Z"
                        fill="white"
                      />
                      <path
                        d="M16 16C7.16344 16 0 8.83656 0 0"
                        stroke="#d9dfe9"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                );
              }

              return (
                <button
                  key={p.PROJECT}
                  type="button"
                  onClick={() => setUserProject(p.PROJECT)}
                  className="z-10 mx-1 mb-1.5 inline-flex h-10.5 shrink-0 items-center gap-2 rounded-full bg-[#F5F8FA] px-5 text-[14px] font-medium text-[#2B456B] transition-colors hover:bg-[#e2e8f0] first:ml-0"
                >
                  {iconNode}
                  <span className="max-w-47.5 truncate whitespace-nowrap">
                    {p.PROJECT}
                  </span>
                </button>
              );
            })}
          {empty && !projectsLoading && (
            <div className="z-10 mx-1 mb-1.5 inline-flex h-10.5 shrink-0 items-center gap-2 rounded-full bg-[#F5F8FA] px-5 text-[14px] font-medium text-[#2B456B]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#3E4FEA] text-[#243a62]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>Project</span>
            </div>
          )}
          {!empty && !projectsLoading && !showAddProject && (
            <button
              type="button"
              onClick={() => setShowAddProject(true)}
              className="z-10 ml-1 mr-4 mb-1.5 inline-flex h-10.5 shrink-0 items-center gap-2 rounded-full bg-[#F5F8FA] px-5 text-[14px] font-medium text-[#2B456B] transition-colors hover:bg-[#e2e8f0] sm:mr-0"
            >
              <IconPlusCircle className="h-4.5 w-4.5" />
              <span>Project</span>
            </button>
          )}
          {!empty && !projectsLoading && showAddProject && (
            <div className="z-20 ml-1 mb-1.5 inline-flex h-10.5 shrink-0 items-center gap-2 rounded-full border-2 border-[#3f4acf] bg-white px-3">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    void submitUrl().then(() => setShowAddProject(false));
                  if (e.key === "Escape") {
                    setShowAddProject(false);
                    setUrlInput("");
                  }
                }}
                placeholder="Website URL"
                autoFocus
                className="min-w-0 w-45 border-0 bg-transparent text-[14px] font-medium tracking-[-0.01em] text-[#24395f] outline-none placeholder:text-[#9aa8bd]"
              />
              <button
                type="button"
                onClick={() =>
                  void submitUrl().then(() => setShowAddProject(false))
                }
                disabled={creating || !urlInput.trim()}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3f4acf] text-white disabled:opacity-40"
                aria-label="Add project"
              >
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
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddProject(false);
                  setUrlInput("");
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#9aa8bd] hover:text-[#24395f]"
                aria-label="Cancel"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Main card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#d9dfe9] bg-white shadow-sm sm:rounded-3xl">
          {empty ? (
            <>
              <div className="relative z-20 flex items-center gap-2 border-b border-[#e7ebf1] px-7 py-5">
                <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#24395f]">
                  SEO Insights &amp; AI citations
                </h2>
                <InfoIcon className="size-4! text-[#ABABAB]!" />
              </div>
              <div className="relative min-h-130">
                <BlurredDashboardMock />
                <div className="relative z-10 flex min-h-130 flex-col items-center justify-center px-6 py-16">
                  <p className="max-w-105 text-center text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#20345a]">
                    Add your first project
                    <br />
                    to view your Statistics
                  </p>
                  <div className="mt-8 w-full max-w-105">
                    <div className="flex items-center gap-2 rounded-full border-2 border-[#3f4acf]/40 bg-white py-2.5 pl-6 pr-3">
                      <input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void submitUrl();
                        }}
                        placeholder="Your Website URL"
                        className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-medium tracking-[-0.01em] text-[#24395f] outline-none placeholder:text-[#9aa8bd]"
                      />
                      <button
                        type="button"
                        onClick={() => void submitUrl()}
                        disabled={creating}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#24395f] disabled:opacity-50"
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
                  <div className="mb-2 flex items-center gap-2">
                    <h2 className="text-base font-semibold tracking-[-0.02em] text-[#2B456B]">
                      SEO Insights
                    </h2>
                    <InfoIcon className="size-4! text-[#ABABAB]!" />
                  </div>

                  <hr className="h-1 text-[#E9EAEB] mb-4" />

                  <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
                    {/* Domain Rating */}
                    <div className="border-[#e7ebf1] pb-4 lg:border-r lg:pb-0 lg:pr-6">
                      <div className="flex items-center gap-1.5 text-sm font-normal tracking-[-0.01em] text-[#2B456B]">
                        <span>Domain Rating (DR)</span>
                        <InfoIcon className="size-4! text-[#ABABAB]!" />
                      </div>
                      {metrics && (
                        <>
                          <div className="mt-3 flex items-center gap-3">
                            <span className="text-[48px] leading-none font-bold tabular-nums tracking-[-0.03em] text-[#1681e4]">
                              {Math.round(metrics.DR)}
                            </span>
                            {(() => {
                              const d = deltaParts(
                                metrics.DR,
                                oldM?.DR ?? null,
                              );
                              return (
                                <div>
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
                                  <br />
                                  <span className="text-[16px] font-medium leading-none text-[#24395f]">
                                    /100
                                  </span>
                                </div>
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
                      <div className="flex items-center gap-1.5 text-sm font-normal tracking-[-0.01em] text-[#2B456B]">
                        <span>Organic traffic</span>
                        <InfoIcon className="size-4! text-[#ABABAB]!" />
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
                        <div className="flex items-center gap-1.5 text-sm font-normal tracking-[-0.01em] text-[#2B456B]">
                          <span>Keywords</span>
                          <InfoIcon className="size-4! text-[#ABABAB]!" />
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
                          <div className="flex items-center gap-1.5 text-sm font-normal tracking-[-0.01em] text-[#2B456B]">
                            <span>Referring Domains</span>
                            <InfoIcon className="size-4! text-[#ABABAB]!" />
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
                  <InfoIcon className="size-4! text-[#ABABAB]!" />
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
