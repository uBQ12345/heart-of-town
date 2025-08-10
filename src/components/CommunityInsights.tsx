import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Post } from "./PostCard";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(var(--secondary-foreground))", "hsl(var(--destructive))"];

interface CommunityInsightsProps {
  posts: Post[];
}

const CommunityInsights = ({ posts }: CommunityInsightsProps) => {
  const byType = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const day = d.toLocaleDateString(undefined, { weekday: "short" });
    const count = posts.filter((p) => {
      const pd = new Date(p.createdAt);
      return pd.toDateString() === d.toDateString();
    }).length;
    return { day, count };
  });

  const positive = posts.filter((p) => ["Good Deeds", "Donations", "Events"].includes(p.type)).length;
  const issues = posts.filter((p) => p.type === "Issues").length;
  const totalPI = positive + issues || 1;
  const posPct = Math.round((positive / totalPI) * 100);

  return (
    <aside aria-label="Community Insights" className="space-y-6">
      <section className="rounded-lg border bg-card p-4 shadow-soft">
        <h4 className="font-semibold mb-3">Post Breakdown</h4>
        <div className="h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60} label>
                {pieData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4 shadow-soft">
        <h4 className="font-semibold mb-3">Weekly Activity</h4>
        <div className="h-48">
          <ResponsiveContainer>
            <BarChart data={days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4 shadow-soft">
        <h4 className="font-semibold mb-1">Community Sentiment</h4>
        <p className="text-sm text-muted-foreground mb-3">Positive vs. Issues</p>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent"
            style={{ width: `${posPct}%` }}
            aria-valuenow={posPct}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {posPct}% positive
        </div>
      </section>
    </aside>
  );
};

export default CommunityInsights;
