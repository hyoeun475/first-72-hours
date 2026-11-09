import type { ResponseGuide } from "@/features/agent/agent.types";
import { Card } from "./ui";

function Section({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  return (
    <Card>
      <h2 className="mb-2 text-base font-semibold">
        <span aria-hidden="true">{icon} </span>
        {title}
      </h2>
      <ol className="list-decimal space-y-2 pl-5 text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </Card>
  );
}

export function StepGuide({ guide }: { guide: ResponseGuide }) {
  return (
    <div className="space-y-3">
      <p className="text-sm">{guide.intro}</p>
      <Section icon="🟢" title="지금 할 수 있는 일" items={guide.canDoNow} />
      <Section icon="🟠" title="피하는 편이 좋은 행동" items={guide.avoid} />
      <Section icon="📝" title="기록하면 도움이 되는 정보" items={guide.helpfulToRecord} />
      <Section icon="🤝" title="전문기관에 연결하면 좋은 상황" items={guide.whenToContactExperts} />
    </div>
  );
}
