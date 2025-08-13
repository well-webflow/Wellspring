import Card from '../../../../components/UI/Card';

export interface GenericSettingProps {
  header: React.ReactNode;
  description: string;
  input?: React.ReactNode;
  content?: React.ReactNode;
}

export function GenericSetting({ header, description, input, content }: GenericSettingProps) {
  return (
    <Card>
      <div className="flex flex-row gap-5 justify-between items-start">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex flex-row items-center gap-3">{header}</div>
          <span className="text-sm text-text3">{description}</span>
        </div>
        {input}
      </div>
      {content}
    </Card>
  );
}
