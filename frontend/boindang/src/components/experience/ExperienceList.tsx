import type { ExperienceCardProps } from './ExperienceCard';
import ExperienceCard from './ExperienceCard';

interface ExperienceListProps {
  experiences: ExperienceCardProps[];
}

export default function ExperienceList({ experiences }: ExperienceListProps) {
  // experiences의 id 목록을 로그로 출력
  console.log('ExperienceList 렌더링, ids:', experiences.map(e => e.id));
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience.id}
          {...experience}
        />
      ))}
    </div>
  );
} 