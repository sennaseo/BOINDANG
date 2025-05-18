import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import { ReportResultData } from "@/types/api/report";


export const getReport = async (productId: string) => {
    const response = await apiClient.get<ApiResponse<ReportResultData>>("/nutrition/analyze", {
        params: {
            productId: productId,
        },
    });
    console.log("API에서 리포트 데이터 가져옴:", response);
    return response;
};
