export interface MyApplication {
  campaignId: number;
  title: string;
  isSelected: boolean;
  appliedAt: string;
}

export interface MyApplicationsResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: MyApplication[];
}
