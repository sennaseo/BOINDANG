'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import type { IngredientResult, CategoryIngredientsData } from '@/types/api/ingredients';
import { fetchCategoryIngredients } from '@/api/ingredients';
import { CheckCircle, Warning, XCircle as RiskXCircle, CaretRight, Spinner, Info, Package, FadersHorizontal, Check, X as ModalCloseX } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import BackArrowIcon from '@/components/common/BackArrowIcon';

// 카테고리명과 이미지 경로 매핑
const categoryImageMap: { [key: string]: string } = {
  '단백질': '/assets/category_icon/danback.png',
  '당류': '/assets/category_icon/dang.png',
  '감미료': '/assets/category_icon/gammi.png',
  '식이섬유': '/assets/category_icon/sike.png',
  '지방': '/assets/category_icon/jibang.png',
  '식품첨가물': '/assets/category_icon/chumga.png',
  '비타민': '/assets/category_icon/vita.png',
  '미네랄': '/assets/category_icon/mine.png',
};

type SortOrderOption = 'nameAsc' | 'nameDesc' | 'safetyHighToLow' | 'safetyLowToHigh' | 'cautionFirst';

const sortOptionsConfig: { key: SortOrderOption; label: string }[] = [
  { key: 'nameAsc', label: '이름 오름차순 (ㄱ-ㅎ)' },
  { key: 'nameDesc', label: '이름 내림차순 (ㅎ-ㄱ)' },
  { key: 'safetyHighToLow', label: '안전도 높은 순 (안심 우선)' },
  { key: 'safetyLowToHigh', label: '안전도 낮은 순 (위험 우선)' },
  { key: 'cautionFirst', label: '주의 성분 먼저 보기' },
];

/**
 * 특정 카테고리에 속한 성분 목록을 보여주는 페이지 컴포넌트입니다.
 * @param params URL 파라미터 객체. `categoryName`을 포함합니다.
 */
const CategoryIngredientsPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryNameFromParams = params.categoryName as string;

  const decodedCategoryName = categoryNameFromParams ? decodeURIComponent(categoryNameFromParams) : '';
  const categoryIconSrc = decodedCategoryName ? categoryImageMap[decodedCategoryName] : undefined;

  const [ingredients, setIngredients] = useState<IngredientResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrderOption>('nameAsc');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const mainScrollRef = useRef<HTMLElement | null>(null);

  // 무한 스크롤 상태
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const handleGoBack = () => {
    router.back();
  };

  const loadMoreIngredients = useCallback(async () => {
    if (isLoadingMore || !hasMore || !decodedCategoryName) return;

    setIsLoadingMore(true);
    const nextPageToLoad = page + 1;

    try {
      const response = await fetchCategoryIngredients({
        categoryName: decodedCategoryName,
        page: nextPageToLoad,
      });

      if (response.success && response.data) {
        const categoryData = response.data as CategoryIngredientsData;
        if (categoryData.ingredients.length > 0) {
          setIngredients(prevIngredients => [...prevIngredients, ...categoryData.ingredients]);
          setPage(nextPageToLoad);
          setHasMore(nextPageToLoad < categoryData.totalPages - 1);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
        console.warn('Failed to load more ingredients (API error or no data):', response.error);
      }
    } catch (err) {
      console.error("Failed to load more ingredients (exception):", err);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, decodedCategoryName, page]);

  useEffect(() => {
    const mainElement = mainScrollRef.current;

    const handleScroll = () => {
      if (mainElement) {
        setIsScrolled(mainElement.scrollTop > 10);
        // 무한 스크롤 로직
        if (
          mainElement.scrollHeight - mainElement.scrollTop - mainElement.clientHeight < 200 && // 스크롤이 하단에 가까워지면
          hasMore && // 더 로드할 데이터가 있고
          !isLoadingMore && // 현재 로딩 중이 아니면
          !isLoading // 초기 로딩 중이 아니면
        ) {
          loadMoreIngredients();
        }
      }
    };

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLoading, hasMore, isLoadingMore, loadMoreIngredients]);

  useEffect(() => {
    const loadInitialIngredients = async () => {
      if (!decodedCategoryName) {
        setIsLoading(false);
        setHasMore(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      const initialPage = 0;
      setPage(initialPage);
      setIngredients([]);
      setHasMore(true);

      try {
        const response = await fetchCategoryIngredients({
          categoryName: decodedCategoryName,
          page: initialPage,
        });

        if (response.success && response.data) {
          const categoryData = response.data as CategoryIngredientsData;
          setIngredients(categoryData.ingredients);
          setHasMore(initialPage < categoryData.totalPages - 1);
        } else {
          setError(response.error?.message || '성분 목록을 가져오는데 실패했습니다.');
          setHasMore(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
        setHasMore(false);
      }
      setIsLoading(false);
    };

    loadInitialIngredients();
  }, [decodedCategoryName]);

  const sortedIngredients = useMemo(() => {
    const ingredientsCopy = [...ingredients];
    const safetyOrderMap = { '안심': 0, '주의': 1, '위험': 2 };
    const getRiskOrder = (riskLevel: '안심' | '주의' | '위험') => safetyOrderMap[riskLevel] ?? 3;

    switch (sortOrder) {
      case 'nameAsc':
        return ingredientsCopy.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      case 'nameDesc':
        return ingredientsCopy.sort((a, b) => b.name.localeCompare(a.name, 'ko'));
      case 'safetyHighToLow':
        return ingredientsCopy.sort((a, b) => getRiskOrder(a.riskLevel) - getRiskOrder(b.riskLevel));
      case 'safetyLowToHigh':
        return ingredientsCopy.sort((a, b) => getRiskOrder(b.riskLevel) - getRiskOrder(a.riskLevel));
      case 'cautionFirst':
        const cautionOrderMap = { '주의': 0, '안심': 1, '위험': 2 };
        const getCautionOrder = (riskLevel: '안심' | '주의' | '위험') => cautionOrderMap[riskLevel] ?? 3;
        return ingredientsCopy.sort((a, b) => getCautionOrder(a.riskLevel) - getCautionOrder(b.riskLevel));
      default:
        return ingredientsCopy;
    }
  }, [ingredients, sortOrder]);

  const HEADER_INITIAL_BACK_BUTTON_AREA_HEIGHT = 48;
  const HEADER_INITIAL_TITLE_AREA_HEIGHT = 60;
  const HEADER_SCROLLED_TOTAL_HEIGHT = 56;
  const NAVBAR_HEIGHT_NUM = 70;

  const scrollableAreaHeight = useMemo(() => {
    if (isScrolled) {
      return `calc(100vh - ${HEADER_SCROLLED_TOTAL_HEIGHT}px - ${NAVBAR_HEIGHT_NUM}px)`;
    }
    return `calc(100vh - ${HEADER_INITIAL_BACK_BUTTON_AREA_HEIGHT}px - ${HEADER_INITIAL_TITLE_AREA_HEIGHT}px - ${NAVBAR_HEIGHT_NUM}px)`;
  }, [isScrolled]);

  if (!decodedCategoryName && isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto flex flex-col h-screen items-center justify-center">
          <Spinner size={40} className="text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto flex flex-col h-screen">
          <header className="sticky top-0 bg-white z-10 p-4 flex items-center border-b border-gray-200 h-[57px]">
            <button onClick={handleGoBack} className="p-1 text-gray-600 hover:text-gray-800">
              <BackArrowIcon size={22} />
            </button>
            <div className="flex items-center ml-3 flex-grow min-w-0">
              {categoryIconSrc && (
                <Image
                  src={categoryIconSrc}
                  alt={`${decodedCategoryName} icon`}
                  width={28}
                  height={28}
                  className="mr-2 flex-shrink-0"
                />
              )}
              <h1 className="text-lg font-bold text-gray-800 truncate">
                {decodedCategoryName}
              </h1>
            </div>
          </header>
          <main className="flex-grow overflow-y-auto flex flex-col items-center justify-center p-4">
            <Spinner size={40} className="text-purple-600 animate-spin mb-3" />
            <p className="text-gray-600">로딩 중...</p>
          </main>
          <div className="sticky bottom-0 w-full z-10">
            <BottomNavBar />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto flex flex-col h-screen">
          <header className="sticky top-0 bg-white z-10 p-4 flex items-center border-b border-gray-200 h-[57px]">
            <button onClick={handleGoBack} className="p-1 text-gray-600 hover:text-gray-800">
              <BackArrowIcon size={22} />
            </button>
            <div className="flex items-center ml-3 flex-grow min-w-0">
              {categoryIconSrc && (
                <Image
                  src={categoryIconSrc}
                  alt={`${decodedCategoryName} icon`}
                  width={28}
                  height={28}
                  className="mr-2 flex-shrink-0"
                />
              )}
              <h1 className="text-lg font-bold text-gray-800 truncate">
                {decodedCategoryName}
              </h1>
            </div>
          </header>
          <main className="flex-grow overflow-y-auto flex flex-col items-center justify-center text-center p-4">
            <Info size={48} className="text-red-500 mb-4" weight="fill" />
            <h2 className="text-lg font-semibold text-red-700 mb-2">오류 발생</h2>
            <p className="text-sm text-gray-600 mb-3">데이터를 불러오는 중 문제가 발생했습니다.</p>
            <p className="text-xs text-red-500 bg-red-50 p-2 rounded break-all">{error}</p>
          </main>
          <div className="sticky bottom-0 w-full z-10">
            <BottomNavBar />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto flex flex-col h-screen">
        <div
          className={`w-full bg-white z-20 transition-all duration-200 ease-in-out
            ${isScrolled
              ? `fixed top-0 left-0 right-0 mx-auto max-w-md h-[${HEADER_SCROLLED_TOTAL_HEIGHT}px] shadow-sm flex items-center justify-between px-4 border-b border-gray-100`
              : `relative`}
          `}
        >
          {isScrolled ? (
            <>
              <button onClick={handleGoBack} className="p-1 text-gray-600 hover:text-gray-800">
                <BackArrowIcon size={22} />
              </button>
              <div className="flex items-center flex-grow overflow-hidden mx-2">
                {categoryIconSrc && (
                  <Image
                    src={categoryIconSrc}
                    alt={`${decodedCategoryName} icon`}
                    width={22}
                    height={22}
                    className="mr-1.5 flex-shrink-0"
                  />
                )}
                <h1 className="text-base font-semibold text-gray-800 truncate">
                  {decodedCategoryName}
                </h1>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-600 hover:text-gray-800 flex-shrink-0">
                <FadersHorizontal size={22} />
              </button>
            </>
          ) : (
            <>
              <div
                className={`pt-4 px-4 pb-2 flex items-center`}
                style={{ height: `${HEADER_INITIAL_BACK_BUTTON_AREA_HEIGHT}px` }}
              >
                <button onClick={handleGoBack} className="p-1 text-gray-600 hover:text-gray-800">
                  <BackArrowIcon size={24} />
                </button>
              </div>
              <div
                className={`px-4 py-3 flex items-center justify-between border-b border-gray-200`}
                style={{ height: `${HEADER_INITIAL_TITLE_AREA_HEIGHT}px` }}
              >
                <div className="flex items-center">
                  {categoryIconSrc && (
                    <Image
                      src={categoryIconSrc}
                      alt={`${decodedCategoryName} icon`}
                      width={28}
                      height={28}
                      className="mr-2 flex-shrink-0"
                    />
                  )}
                  <h1 className="text-2xl font-bold text-gray-800">
                    {decodedCategoryName}
                    <span className="font-medium text-gray-700 ml-1.5">사전</span>
                  </h1>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-600 hover:text-gray-800">
                  <FadersHorizontal size={24} />
                </button>
              </div>
            </>
          )}
        </div>

        <main
          ref={mainScrollRef}
          style={{
            height: scrollableAreaHeight,
            paddingTop: isScrolled ? `${HEADER_SCROLLED_TOTAL_HEIGHT}px` : '0px'
          }}
          className="flex-grow overflow-y-auto bg-white pb-24"
        >
          {isLoading && ingredients.length === 0 ? (
            <div className="p-4 text-center text-gray-500">목록을 불러오는 중...</div>
          ) : sortedIngredients.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-100">
                {sortedIngredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/ingredients/detail/${ingredient.id}`)}
                  >
                    <div className="flex-grow min-w-0 mr-4">
                      <h2 className="text-base font-medium text-gray-800 truncate">
                        {ingredient.name}
                        {ingredient.engName && <span className="text-gray-500 font-normal ml-1">({ingredient.engName})</span>}
                      </h2>
                      <p className="text-sm text-gray-500 truncate">{ingredient.type}</p>
                    </div>

                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      {ingredient.riskLevel === '안심' && (
                        <span className="flex items-center bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          <CheckCircle size={14} weight="fill" className="mr-1" />
                          안심
                        </span>
                      )}
                      {ingredient.riskLevel === '주의' && (
                        <span className="flex items-center bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          <Warning size={14} weight="fill" className="mr-1" />
                          주의
                        </span>
                      )}
                      {ingredient.riskLevel === '위험' && (
                        <span className="flex items-center bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          <RiskXCircle size={14} weight="fill" className="mr-1" />
                          위험
                        </span>
                      )}
                      <CaretRight size={20} className="text-gray-400" />
                    </div>
                  </li>
                ))}
              </ul>
              {isLoadingMore && (
                <div className="flex justify-center items-center p-4">
                  <Spinner size={32} className="text-purple-600 animate-spin" />
                  <p className="ml-2 text-gray-600">더 많은 성분을 불러오는 중...</p>
                </div>
              )}
              {!hasMore && ingredients.length > 0 && !isLoadingMore && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  모든 성분을 불러왔습니다.
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Package size={48} className="text-gray-400 mb-4" weight="light" />
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {decodedCategoryName ? `${decodedCategoryName} 카테고리에는 아직 성분이 없어요.` : '성분이 없어요.'}
              </p>
              <p className="text-sm text-gray-500">
                곧 유용한 성분 정보로 업데이트 될 예정입니다.
              </p>
            </div>
          )}
        </main>

        <div className="sticky bottom-0 w-full z-10 border-t border-gray-100">
          <BottomNavBar />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.25)] flex items-center justify-center z-30 p-4 transition-opacity duration-300 ease-in-out" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs p-5 transform transition-all duration-300 ease-in-out scale-100" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">정렬 기준</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-500 hover:text-gray-700">
                  <ModalCloseX size={20} />
                </button>
              </div>
              <ul className="space-y-1">
                {sortOptionsConfig.map((option) => (
                  <li key={option.key}>
                    <button
                      onClick={() => {
                        setSortOrder(option.key);
                        setIsModalOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${sortOrder === option.key
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {option.label}
                      {sortOrder === option.key && <Check size={18} className="text-purple-600" weight="bold" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryIngredientsPage;
