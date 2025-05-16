import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FeaturedIngredient {
  id: string;
  name: string;
  description: string;
  imageSrc?: string; // 간단한 아이콘이나 이미지를 위한 경로
  tag?: string; // 예: "혈당 주의", "면역 UP" 등 짧은 태그
}

interface FeaturedIngredientsSectionProps {
  title: React.ReactNode;
  ingredients: FeaturedIngredient[];
  theme: 'bad' | 'good';
}

const FeaturedIngredientCard: React.FC<{ ingredient: FeaturedIngredient, theme: 'bad' | 'good' }> = ({ ingredient, theme }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/ingredients/detail/${ingredient.id}`);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden w-64 flex-shrink-0 ${theme === 'bad' ? 'border-yellow-200' : 'border-purple-200'} border cursor-pointer hover:shadow-lg transition-shadow duration-200`}
      onClick={handleClick}
    >
      <div className="relative w-full h-40">
        {ingredient.imageSrc ? (
          <Image
            src={ingredient.imageSrc}
            alt={ingredient.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 rounded-t-lg">
            <span>이미지 없음</span>
          </div>
        )}
        {ingredient.tag && (
          <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-md ${theme === 'bad' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'
            }`}>
            {ingredient.tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1 text-gray-800">{ingredient.name}</h4>
        <p className="text-sm text-gray-600 h-16 overflow-hidden">{ingredient.description}</p> {/* 내용 길이를 고려하여 높이 고정 및 overflow 처리 */}
      </div>
    </div>
  );
};

const FeaturedIngredientsCarousel: React.FC<FeaturedIngredientsSectionProps> = ({ title, ingredients, theme }) => {
  if (ingredients.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <h2 className={`text-lg font-semibold mb-3 text-gray-800`}> {/* 글자 크기 text-lg, 굵기 font-semibold로 변경, mb-3으로 통일 */}
        {title}
      </h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar"> {/* 가로 스크롤 및 스크롤바 숨김 */}
        {ingredients.map((item) => (
          <FeaturedIngredientCard key={item.id} ingredient={item} theme={theme} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedIngredientsCarousel;
