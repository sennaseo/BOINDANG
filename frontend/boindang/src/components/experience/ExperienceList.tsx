import type { ExperienceCardProps } from './ExperienceCard';
import ExperienceCard from './ExperienceCard';

interface ExperienceListProps {
  experiences: ExperienceCardProps[];
}

export default function ExperienceList({ experiences }: ExperienceListProps) {
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