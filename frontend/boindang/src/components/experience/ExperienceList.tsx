import ExperienceCard from './ExperienceCard';

interface Experience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  remainingDays: number;
}

interface ExperienceListProps {
  experiences: Experience[];
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