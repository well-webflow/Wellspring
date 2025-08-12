import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SelectedElementInfo, useWebflow } from '../context/webflowContext';

export default function SelectedElement({ classNames }: { classNames?: string }) {
  const { elementSelected, elementInfo } = useWebflow();
  if (!elementSelected || !elementInfo) {
    return <div>No Element Selected</div>;
  }
  let typeText;
  if (elementSelected.type === 'Block') typeText = 'Div Block';

  const styles = twMerge(clsx('bg-action-primary-background p-1 px-2 rounded-xs text-sm'));
  const wrapperStyles = twMerge(clsx('p-1 bg-background3 flex-row gap-2 flex-wrap inline-flex', classNames));

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
