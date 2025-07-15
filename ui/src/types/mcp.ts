export interface Repository {
  url: string;
  source: string;
  id: string;
}

export interface VersionDetail {
  version: string;
  release_date: string;
  is_latest: boolean;
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  repository: Repository;
  version_detail: VersionDetail;
}

export interface McpServerListResponse {
  servers: McpServer[];
  total_count: number;
  next?: string;
} 