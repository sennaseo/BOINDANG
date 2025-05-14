import React from 'react';
// import Image from 'next/image'; // 추후 성분 이미지를 사용한다면 주석 해제

/**
 * 개별 성분 정보를 담는 인터페이스입니다.
 */
interface Ingredient {
  id: string;
  name: string;
  description: string;
  // imageSrc?: string; // 선택적 성분 이미지 URL
}

// DUMMY_INGREDIENTS_DATA 관련 코드 전체 삭제

/**
 * 특정 카테고리에 속한 성분 목록을 보여주는 페이지 컴포넌트입니다.
 * @param params URL 파라미터 객체. `categoryName`을 포함합니다.
 */
const CategoryIngredientsPage = ({ params }: { params: { categoryName: string } }) => {
  const { categoryName } = params;
  const decodedCategoryName = decodeURIComponent(categoryName);

  // API 연동 전, ingredients는 빈 배열로 초기화합니다.
  // TODO: 추후 API를 통해 실제 성분 목록을 가져와 여기에 할당해야 합니다.
  const ingredients: Ingredient[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
            {decodedCategoryName}
          </h1>
          <p className="text-lg text-gray-700">
            {decodedCategoryName} 카테고리의 주요 성분들을 살펴보세요.
          </p>
        </header>

        {ingredients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-purple-700 mb-3">{ingredient.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{ingredient.description}</p>
                  {/* 
                  // 추후 성분 이미지를 사용한다면 아래 코드의 주석을 해제하고 경로를 설정하세요.
                  {ingredient.imageSrc && (
                    <div className="mt-4">
                      <Image 
                        src={ingredient.imageSrc} 
                        alt={ingredient.name} 
                        width={80} 
                        height={80} 
                        className="rounded-lg object-cover mx-auto" 
                      />
                    </div>
                  )}
                  */}
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-purple-400 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5.16 12.75M9.75 3.104a2.25 2.25 0 0 0-2.25 2.25v10.304a2.25 2.25 0 0 0 .659 1.591L9.2 20.25M9.75 3.104a2.25 2.25 0 0 1 2.25 2.25v10.304a2.25 2.25 0 0 1-.659 1.591L12.9 20.25m0 0a2.25 2.25 0 0 0 2.25-2.25V5.354a2.25 2.25 0 0 0-2.25-2.25m-4.5 0H9.75M14.25 3.104c.813 0 1.593.298 2.175.853M12 3.104a2.25 2.25 0 0 0-2.25 2.25v.396M7.5 12.75c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5A1.125 1.125 0 0 0 7.5 11.25v1.5Z" />
            </svg>
            <p className="text-xl text-gray-600 font-semibold">아직 준비된 성분이 없어요</p>
            <p className="text-gray-500 mt-2">{`선택하신 '${decodedCategoryName}' 카테고리의 성분 정보를 곧 업데이트할 예정입니다.`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryIngredientsPage;
