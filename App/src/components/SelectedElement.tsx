import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SelectedElementInfo } from '../context/webflowContext';

export default function SelectedElement({ el, classNames }: { el: SelectedElementInfo | null; classNames?: string }) {
  if (!el) return null;
  let typeText;
  if (el.type === 'Block') typeText = 'Div Block';

  const styles = twMerge(clsx('bg-action-primary-background p-1 px-2 rounded-xs text-sm'));
  const wrapperStyles = twMerge(clsx('p-2 bg-background3 flex flex-row gap-2 flex-wrap', classNames));

  return (
    <div className={wrapperStyles}>
      {el.classes?.length ? (
        el.classes.map((c) => (
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
