'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryItem {
  name: string;
  imageSrc: string;
}

interface CategoryListSectionProps {
  categoryIngredients: CategoryItem[];
}

const CategoryListSection: React.FC<CategoryListSectionProps> = ({ categoryIngredients }) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">카테고리별 성분 백과 📚</h2>
      <div className="bg-white border border-gray-100 rounded-lg shadow-md overflow-hidden p-6">
        <div className="grid grid-cols-4 gap-4">
          {categoryIngredients.map((item) => (
            <Link key={item.name} href={`/ingredients/${encodeURIComponent(item.name)}`} passHref legacyBehavior>
              <a className="flex flex-col items-center justify-start p-3 text-center rounded-lg transition-all duration-300 ease-in-out hover:bg-purple-50 hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center mb-2">
                  <Image src={item.imageSrc} alt={item.name} width={64} height={64} className="object-cover" />
                </div>
                <span
                  className="text-gray-700 whitespace-nowrap font-medium"
                  style={{ fontSize: '15px' }} // 픽셀 단위로 직접 수정 가능
                >
                  {item.name}
                </span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryListSection; 