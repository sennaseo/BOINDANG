export interface Experience {
    id: number;
    name: string;
    content: string;
    imageUrl: string;
    startDate: string;
    deadline: string;
    status: string;
    capacity: number;
    hashtags: string[];
    applied: boolean;
  }
  
  export interface ExperienceListResponse {
    isSuccess: boolean;
    code: number;
    message: string;
    data: Experience[];
  }

export interface ExperienceDetail {
  id: number;
  name: string;
  content: string;
  mainCategory: string;
  subCategory: string;
  imageUrl: string;
  startDate: string;
  deadline: string;
  status: string;
  capacity: number;
  applicantCount: number;
  hashtags: string[];
  notices: string[];
  applied: boolean;
}