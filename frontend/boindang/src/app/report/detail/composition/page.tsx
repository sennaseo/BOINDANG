"use client";

import React, { useState } from "react";
import ReportTabNav from "@/components/navigation/ReportTabNav";
import { CaretLeft, X, Info } from "@phosphor-icons/react";
import CompositionChart from "@/components/chart/CompositionChart";

const exampleData = [
  { 
    id: "탄수화물", 
    label: "탄수화물", 
    value: 33, 
    color: "#3b82f6",
    subData: [
      { id: "당류", label: "당류", value: 15, color: "#60a5fa" },
      { id: "식이섬유", label: "식이섬유", value: 8, color: "#93c5fd" },
      { id: "기타", label: "기타", value: 10, color: "#bfdbfe" }
    ]
  },
  { 
    id: "단백질", 
    label: "단백질", 
    value: 5, 
    color: "#22c55e",
    subData: [
      { id: "동물성", label: "동물성", value: 3, color: "#4ade80" },
      { id: "식물성", label: "식물성", value: 2, color: "#86efac" }
    ]
  },
  { 
    id: "지방", 
    label: "지방", 
    value: 14, 
    color: "#f59e42",
    subData: [
      { id: "포화지방", label: "포화지방", value: 6, color: "#fbbf24" },
      { id: "불포화지방", label: "불포화지방", value: 8, color: "#fcd34d" }
    ]
  }
];

// 영양소 카테고리 데이터
const categories = [
  { 
    id: "sweetener", 
    name: "감미료", 
    color: "#3b82f6",
    icon: "🍯",
    items: [
      { id: "sugar", name: "설탕", description: "정제된 사탕수수나 사탕무에서 추출한 기본 감미료로, 단맛을 제공합니다." },
      { id: "fructose", name: "과당", description: "과일에 자연적으로 존재하는 단순 당류로, 설탕보다 단맛이 강합니다." },
      { id: "maltitol", name: "말티톨", description: "설탕 대체 감미료로, 칼로리가 낮고 혈당 상승을 적게 유발합니다." },
    ]
  },
  { 
    id: "acidity-regulator", 
    name: "산도조절제", 
    color: "#22c55e",
    icon: "🧪",
    items: [
      { id: "citric-acid", name: "구연산", description: "음식의 산도를 조절하고 신맛을 부여하는 데 사용되는 약산입니다." },
      { id: "acetic-acid", name: "아세트산", description: "식초의 주요 성분으로, 보존 및 풍미 향상에 사용됩니다." },
      { id: "lactic-acid", name: "젖산", description: "요구르트와 같은 발효 식품에서 흔히 발견되는 산도 조절제입니다." },
    ]
  },
  { 
    id: "emulsifier", 
    name: "유화제", 
    color: "#f59e42",
    icon: "🔄",
    items: [
      { id: "lecithin", name: "레시틴", description: "기름과 물을 섞이게 하는 천연 유화제로, 초콜릿과 마가린에 흔히 사용됩니다." },
      { id: "monoglycerides", name: "모노글리세라이드", description: "지방 기반 유화제로, 빵과 과자류에 질감을 개선하기 위해 사용됩니다." },
      { id: "polysorbates", name: "폴리소르베이트", description: "합성 유화제로, 아이스크림과 드레싱에 사용됩니다." },
    ]
  },
  { 
    id: "thickener", 
    name: "점질제", 
    color: "#a855f7",
    icon: "🍮",
    items: [
      { id: "xanthan-gum", name: "잔탄검", description: "미생물 발효를 통해 생산되는 점질제로, 소스와 드레싱의 점도를 높입니다." },
      { id: "pectin", name: "펙틴", description: "과일에서 추출한 천연 점질제로, 젤리와 잼을 만드는 데 사용됩니다." },
      { id: "gelatin", name: "젤라틴", description: "동물 콜라겐에서 추출한 단백질로, 젤리와 마시멜로에 사용됩니다." },
    ]
  },
  { 
    id: "flavoring", 
    name: "착향료", 
    color: "#ec4899",
    icon: "🌸",
    items: [
      { id: "vanilla", name: "바닐라", description: "바닐라 꼬투리에서 추출한 천연 향료로, 디저트에 달콤한 향을 더합니다." },
      { id: "artificial-vanilla", name: "인공 바닐라", description: "바닐린을 합성하여 만든 향료로, 천연 바닐라보다 저렴합니다." },
      { id: "citrus-flavors", name: "시트러스 향", description: "레몬, 라임, 오렌지 등의 과일에서 추출한 향료입니다." },
    ]
  },
  { 
    id: "coloring", 
    name: "착색료", 
    color: "#ef4444",
    icon: "🎨",
    items: [
      { id: "caramel", name: "캐러멜", description: "설탕을 가열하여 만든 갈색 착색료로, 콜라와 간장에 사용됩니다." },
      { id: "beetroot-extract", name: "비트 추출물", description: "비트에서 추출한 천연 적색 착색료입니다." },
      { id: "turmeric", name: "강황", description: "강황 뿌리에서 추출한 천연 노란색 착색료입니다." },
    ]
  },
  { 
    id: "preservative", 
    name: "보존제", 
    color: "#6366f1",
    icon: "🧊",
    items: [
      { id: "sodium-benzoate", name: "벤조산 나트륨", description: "산성 식품에서 곰팡이와 박테리아 성장을 억제하는 보존제입니다." },
      { id: "potassium-sorbate", name: "소르빈산 칼륨", description: "곰팡이와 효모의 성장을 억제하는 보존제로, 요구르트와 치즈에 사용됩니다." },
      { id: "sulfites", name: "아황산염", description: "와인과 말린 과일에 사용되는 보존제로, 일부 사람들에게 알레르기 반응을 일으킬 수 있습니다." },
    ]
  },
  { 
    id: "antioxidant", 
    name: "산화방지제", 
    color: "#0ea5e9",
    icon: "🛡️",
    items: [
      { id: "vitamin-c", name: "비타민 C", description: "천연 항산화제로, 식품의 변색을 방지하고 영양을 보충합니다." },
      { id: "vitamin-e", name: "비타민 E", description: "기름 기반 식품의 산패를 방지하는 지용성 항산화제입니다." },
      { id: "bht", name: "BHT", description: "합성 항산화제로, 기름, 견과류, 시리얼 등의 산화를 방지합니다." },
    ]
  },
  { 
    id: "leavening", 
    name: "팽창제", 
    color: "#14b8a6",
    icon: "🍞",
    items: [
      { id: "baking-powder", name: "베이킹 파우더", description: "산과 알칼리가 결합된 팽창제로, 수분과 열에 반응하여 이산화탄소를 생성합니다." },
      { id: "baking-soda", name: "베이킹 소다", description: "산성 재료와 반응하여 이산화탄소를 생성하는 알칼리 팽창제입니다." },
      { id: "yeast", name: "이스트", description: "설탕을 먹고 이산화탄소를 생성하는 생물학적 팽창제입니다." },
    ]
  },
  { 
    id: "salt", 
    name: "염류", 
    color: "#64748b",
    icon: "🧂",
    items: [
      { id: "table-salt", name: "식탁용 소금", description: "나트륨과 염소로 구성된 기본 조미료로, 맛을 향상시키고 보존 효과가 있습니다." },
      { id: "potassium-chloride", name: "염화 칼륨", description: "나트륨 함량을 줄인 소금 대체제로 사용됩니다." },
      { id: "sea-salt", name: "바다 소금", description: "바닷물을 증발시켜 얻은 소금으로, 미네랄 함량이 더 높습니다." },
    ]
  },
  { 
    id: "supplement", 
    name: "보충제", 
    color: "#8b5cf6",
    icon: "💊",
    items: [
      { id: "calcium", name: "칼슘", description: "뼈와 치아 건강에 중요한 미네랄로, 유제품 외에도 식품에 첨가됩니다." },
      { id: "iron", name: "철분", description: "빈혈 예방에 중요한 미네랄로, 시리얼과 빵에 첨가됩니다." },
      { id: "vitamin-d", name: "비타민 D", description: "칼슘 흡수를 돕는 비타민으로, 우유와 대체 음료에 첨가됩니다." },
    ]
  },
  { 
    id: "other", 
    name: "기타", 
    color: "#d97706",
    icon: "🔍",
    items: [
      { id: "caffeine", name: "카페인", description: "중추신경계를 자극하는 화합물로, 커피, 차, 에너지 음료에 자연적으로 존재합니다." },
      { id: "msg", name: "MSG", description: "감칠맛을 내는 조미료로, 육류, 생선, 채소에 자연적으로 존재하는 글루탐산의 나트륨 형태입니다." },
      { id: "carrageenan", name: "카라기난", description: "해조류에서 추출한 점질제로, 아이스크림과 식물성 우유에 사용됩니다." },
    ]
  },
];

export default function CompositionPage() {
  // 선택된 카테고리와 모달 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string, name: string, description: string} | null>(null);

  // 선택된 카테고리 데이터 가져오기
  const selectedCategoryData = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory) 
    : null;

  // 카테고리 버튼 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowModal(true);
    setSelectedItem(null);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // 아이템 클릭 핸들러
  const handleItemClick = (item: {id: string, name: string, description: string}) => {
    setSelectedItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* 헤더 */}
      <header className="flex items-center mb-2">
        <button className="mr-2 text-2xl"><CaretLeft/></button>
        <h1 className="text-2xl font-bold mx-auto">리포트</h1>
      </header>
      <ReportTabNav />

      {/* 성분 비율 분석표 */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-2">성분 비율 분석표</h2>
        <CompositionChart data={exampleData} />
      </section>

      {/* 영양소 성분 구성 */}
      <section className="mb-4">
        <h2 className="font-bold text-lg mb-2">첨가물 성분 구성</h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white rounded-xl shadow p-4 transition-all hover:shadow-md hover:scale-105 flex flex-col items-center justify-center"
            >
              <div 
                className="w-12 h-12 rounded-full mb-2 flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
              <p className="font-semibold text-sm text-gray-600">{category.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 모달 */}
      {showModal && selectedCategoryData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            {/* 모달 헤더 */}
            <div className="p-4 flex justify-between items-center border-b" style={{ backgroundColor: `${selectedCategoryData.color}20` }}>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{selectedCategoryData.icon}</span>
                <h3 className="text-xl font-bold">{selectedCategoryData.name}</h3>
              </div>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            {/* 모달 내용 */}
            <div className="flex-1 overflow-auto">
              {/* 상세 정보가 선택되지 않았을 때 목록 표시 */}
              {!selectedItem && (
                <ul className="divide-y">
                  {selectedCategoryData.items.map((item) => (
                    <li key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleItemClick(item)}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <Info size={20} className="text-gray-400" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* 상세 정보가 선택되었을 때 */}
              {selectedItem && (
                <div className="p-4">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="mb-4 text-blue-500 flex items-center"
                  >
                    <CaretLeft size={16} />
                    <span className="ml-1">목록으로 돌아가기</span>
                  </button>
                  <h4 className="text-lg font-bold mb-2">{selectedItem.name}</h4>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
