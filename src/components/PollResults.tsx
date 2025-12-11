import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface VoteCount {
  option_id: string;
  option_text: string;
  count: number;
}

interface PollResultsProps {
  voteCounts: VoteCount[];
  totalVotes: number;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function PollResults({ voteCounts, totalVotes }: PollResultsProps) {
  const data = voteCounts.map((vc, index) => ({
    name: vc.option_text,
    votes: vc.count,
    percentage: totalVotes > 0 ? Math.round((vc.count / totalVotes) * 100) : 0,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="w-full space-y-6">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              dataKey="votes"
              radius={[0, 6, 6, 0]}
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(value: number) => `${value}%`}
                style={{ fill: 'hsl(var(--muted-foreground))', fontSize: 14 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Total votes: <span className="font-semibold text-foreground">{totalVotes}</span>
        </p>
      </div>
    </div>
  );
}
