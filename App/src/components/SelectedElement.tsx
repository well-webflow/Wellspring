import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useWebflow } from '../context/webflowContext';

export default function SelectedElement({ classNames }: { classNames?: string }) {
  const styles = twMerge(clsx('bg-action-primary-background p-1 px-2 rounded-xs text-sm'));
  const wrapperStyles = twMerge(clsx('p-1 bg-background3 flex-row gap-2 flex-wrap inline-flex', classNames));

  const { elementSelected, elementInfo } = useWebflow();
  if (!elementSelected) {
    return (
      <div className={wrapperStyles}>
        <div className={styles}>No Element Selected</div>
      </div>
    );
  }

  // Element is selected but info is still loading
  if (!elementInfo) {
    return (
      <div className={wrapperStyles}>
        <div className={styles}>Loading...</div>
      </div>
    );
  }

  let typeText = elementSelected.type.toString();
  console.log(elementSelected);
  if (elementSelected.type === 'Block') typeText = 'Div Block';

  return (
    <div className={wrapperStyles}>
      {elementInfo.classes?.length ? (
        elementInfo.classes.map((c) => (
          <div key={c} className={styles}>
            {c}
          </div>
        ))
      ) : (
        <div className={styles}>{typeText}</div>
      )}
    </div>
  );
}
