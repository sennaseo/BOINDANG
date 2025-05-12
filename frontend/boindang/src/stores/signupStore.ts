import { create } from 'zustand'

// 스토어에서 관리할 상태의 타입 정의
interface SignUpState {
  // 1단계 : 아이디/비밀번호
  username : string;
  password : string;
  nickname : string;
  // 2단계 : 신체정보
  gender : 'M' | 'F' | '';
  height : string; // 초기 입력은 string, 최종 제출 시  numnber로 변환
  weight : string; // 초기 입력은 string, 최종 제출 시  numnber로 변환
  // 3단계 : 사용자 유형
  userType : '다이어트' | '근성장' | '당뇨병' | '신장질환' | '';

  // 각 단계의 데이터를 업데이트하는 액션 정의
  setUsername : (username : string) => void;
  setPassword : (password : string) => void;
  setNickname : (nickname : string) => void;
  setGender : (gender : 'M' | 'F' | '') => void;
  setHeight : (height : string) => void;
  setWeight : (weight : string) => void;
  setUserType : (userType : '다이어트' | '근성장' | '당뇨병' | '신장질환' | '') => void;

  // 모든 데이터를 초기화하는 액션 (선택 사항)
  resetSignUpForm : () => void;
}

// 초기 상태 값
const initialState: Omit<SignUpState, 'setUsername' | 'setPassword' | 'setNickname' | 'setGender' | 'setHeight' | 'setWeight' | 'setUserType' | 'resetSignUpForm'> = {
  username: '',
  password: '',
  nickname: '',
  gender: '',
  height: '',
  weight: '',
  userType: '',
};

// Zustand 스토어 생성
export const useSignUpStore = create<SignUpState>((set) => ({
  ...initialState,

  // 액션 구현
  setUsername : (username) => set({ username }),
  setPassword : (password) => set({ password }),
  setNickname : (nickname) => set({ nickname }),
  setGender : (gender) => set({ gender }),
  setHeight : (height) => set({ height }),
  setWeight : (weight) => set({ weight }),
  setUserType : (userType) => set({ userType }),

  // 모든 데이터를 초기화하는 액션
  resetSignUpForm : () => set(initialState),
}));