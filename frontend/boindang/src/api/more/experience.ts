import apiClient from '@/lib/apiClient';
import type { MyApplicationsResponse, MyApplication } from '@/types/api/more/experience';

export const fetchMyApplications = async (): Promise<MyApplication[]> => {
  const response = await apiClient.get<MyApplicationsResponse>('/campaign/my-applications');
  return response.data.data;
};
