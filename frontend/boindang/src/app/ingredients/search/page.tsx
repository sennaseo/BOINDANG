'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, XCircle } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import type { IngredientResult } from '@/types/api/ingredients';
import { useSearchIngredientsQuery } from '@/hooks/queries/useSearchIngredientsQuery';

export default function IngredientSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'suggest' | 'original'>('suggest');
  const router = useRouter();

  const trimmedSearchTerm = searchTerm.trim();
  const shouldAttemptSearch = trimmedSearchTerm.length >= 2;

  const {
    data: apiResponseData,
    isLoading,
    error,
  } = useSearchIngredientsQuery({
    query: trimmedSearchTerm,
    suggested: searchMode === 'suggest',
    enabled: shouldAttemptSearch,
  });

  const searchResults: IngredientResult[] = apiResponseData?.results || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSearchMode('suggest');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchMode('suggest');
  };

  const handleSearchOriginal = (originalQuery: string) => {
    setSearchTerm(originalQuery);
    setSearchMode('original');
  };

  const handleGoBack = () => {
    router.back();
  };

  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : null;

  const showLoading = isLoading && shouldAttemptSearch;
  const showError = !isLoading && errorMessage && shouldAttemptSearch;
  const showInitialMessage = !shouldAttemptSearch && !isLoading;
  const showResults = !isLoading && !errorMessage && shouldAttemptSearch && apiResponseData;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto shadow-sm pb-[70px]">
        {/* 상단 검색 영역 */}
        <div className="bg-white p-4 flex items-center gap-2 sticky top-0 z-10 border-b border-gray-200">
          <button
            onClick={handleGoBack}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="어떤 성분이 궁금하세요?"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 pl-3 pr-10 py-2"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} weight="fill" />
              </button>
            )}
          </div>
        </div>

        {/* 검색 결과 표시 영역 */}
        <div className="p-4 h-[calc(100vh-57px-70px)] overflow-y-auto">
          {showLoading && (
            <p className="text-gray-500 text-center mt-10">검색 중...</p>
          )}

          {showError && (
            <p className="text-red-500 text-center mt-10">
              에러: {errorMessage}
            </p>
          )}

          {showInitialMessage && (
            <p className="text-gray-400 text-center mt-10">
              궁금한 영양 성분을 2자 이상 검색해보세요.
            </p>
          )}

          {showResults && (
            <>
              {searchMode === 'suggest' &&
                apiResponseData.suggestedName &&
                apiResponseData.suggestedName !== apiResponseData.originalQuery && (
                  <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-md text-sm flex flex-wrap items-center gap-x-1">
                    <span className="font-semibold">{apiResponseData.suggestedName}</span>
                    <span>(으)로 검색한 결과입니다.</span>
                    {apiResponseData.originalQuery && (
                      <button
                        onClick={() => handleSearchOriginal(apiResponseData.originalQuery!)}
                        className="text-purple-600 hover:text-purple-800 font-semibold underline ml-1"
                      >
                        `{apiResponseData.originalQuery}` 검색결과 보기
                      </button>
                    )}
                  </div>
                )}

              {searchResults.length > 0 ? (
                <div>
                  {(searchMode === 'original' || !apiResponseData.suggestedName || apiResponseData.suggestedName === apiResponseData.originalQuery) &&
                    apiResponseData.originalQuery && (
                      <p className="text-gray-700 mb-4">
                        <span className="font-semibold">{apiResponseData.originalQuery}</span> 검색 결과입니다.
                      </p>
                    )}
                  <ul className="space-y-2">
                    {searchResults.map((result) => (
                      <li key={result.id} className="p-3 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 cursor-pointer">
                        <h3 className="font-semibold text-gray-800">{result.name} ({result.engName})</h3>
                        <div className="text-xs text-gray-600">
                          <span>타입: {result.type}</span>
                          <span className="mx-1">|</span>
                          <span>위험도: {result.riskLevel}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  <span className="font-semibold">{apiResponseData.originalQuery || trimmedSearchTerm}</span>에 대한 검색 결과가 없습니다.
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
        <BottomNavBar />
      </div>
    </div>
  );
}