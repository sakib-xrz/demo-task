import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";

export type DashboardProject = {
  PROJECT: string;
  THUMBNAIL: string | null;
};

export type ProjectMetrics = {
  DR: number;
  TRAFFIC: number;
  RD: number;
  KEYWORDS: number;
};

export type TrafficPoint = {
  TRAFFIC: number;
  DATE: string;
};

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Projects"],
  endpoints: (build) => ({
    getDashboardProjects: build.query<{ data: DashboardProject[] }, void>({
      query: () => "/get-dashboard-projects",
      providesTags: ["Projects"],
    }),
    getProjectMetrics: build.query<
      { metrics: ProjectMetrics; oldMetrics: ProjectMetrics | null },
      string
    >({
      query: (project) => ({
        url: "/get-dashboard-project-metrics",
        params: { project },
      }),
    }),
    getTrafficHistory: build.query<TrafficPoint[], string>({
      query: (project) => ({
        url: "/get-dashboard-project-traffic-history",
        params: { project },
      }),
    }),
    createDashboardProject: build.mutation<
      { success: boolean },
      { project: string }
    >({
      query: (body) => ({
        url: "/create-dashboard-project",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetDashboardProjectsQuery,
  useGetProjectMetricsQuery,
  useGetTrafficHistoryQuery,
  useCreateDashboardProjectMutation,
} = dashboardApi;
