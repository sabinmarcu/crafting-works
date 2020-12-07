import { FC } from 'react';
import { useRecipes } from '../../state/recipes-v3';

export const LabelEditor: FC<{
  label: string
}> = ({
  label,
}) => <h1>{label}</h1>;

export const LabelSettings: FC = () => {
  const { labels } = useRecipes();
  return (
    <>
      {labels.map((label) => (
        <LabelEditor key={label} label={label} />
      ))}
    </>
  );
};
