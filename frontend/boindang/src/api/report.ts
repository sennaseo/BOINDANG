import apiClient from "@/lib/apiClient";

export const getReport = async (productId: string) => {
    const response = await apiClient.get("/nutrition/analyze", {
        params: {
            productId: productId,
        },
    });
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
};
