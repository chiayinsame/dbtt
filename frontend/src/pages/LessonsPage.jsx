import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";
import Pill from "../components/ui/Pill";

const VIDEOS = [
  {
    id: 1, title: "Badminton Smash Technique",
    channel: "ActiveSG Academy", duration: "8:24", views: "12.4K",
    sport: "Badminton", level: "Intermediate",
    icon: "🏸", color: "#00D68F",
    desc: "Master the overhead smash with proper footwork, arm swing, and follow-through.",
  },
  {
    id: 2, title: "Full Body HIIT — No Equipment",
    channel: "ActiveSG Fitness", duration: "20:00", views: "45.2K",
    sport: "Fitness", level: "All Levels",
    icon: "💪", color: "#F43F5E",
    desc: "20-minute high-intensity workout you can do anywhere. No equipment needed.",
  },
  {
    id: 3, title: "Basketball Shooting Drills",
    channel: "ActiveSG Academy", duration: "12:15", views: "8.7K",
    sport: "Basketball", level: "Beginner",
    icon: "🏀", color: "#F5A623",
    desc: "Improve your free throw, mid-range, and three-point shooting accuracy.",
  },
  {
    id: 4, title: "Yoga for Athletes — Recovery",
    channel: "ActiveSG Wellness", duration: "25:00", views: "18.1K",
    sport: "Yoga", level: "All Levels",
    icon: "🧘", color: "#A855F7",
    desc: "Post-workout stretching and recovery yoga to reduce soreness and improve flexibility.",
  },
  {
    id: 5, title: "Swimming Freestyle Form",
    channel: "ActiveSG Aquatics", duration: "10:32", views: "22.6K",
    sport: "Swimming", level: "Beginner",
    icon: "🏊", color: "#00B4D8",
    desc: "Break down the freestyle stroke — breathing, arm pull, and kick timing.",
  },
  {
    id: 6, title: "Football First Touch Drills",
    channel: "ActiveSG Academy", duration: "9:45", views: "6.3K",
    sport: "Football", level: "Beginner",
    icon: "⚽", color: "#A855F7",
    desc: "Control the ball like a pro with these wall drills and cone exercises.",
  },
  {
    id: 7, title: "Strength Training Basics",
    channel: "ActiveSG Fitness", duration: "15:30", views: "31.8K",
    sport: "Fitness", level: "Beginner",
    icon: "🏋️", color: "#F43F5E",
    desc: "Learn proper form for squats, deadlifts, bench press, and rows.",
  },
  {
    id: 8, title: "Tennis Serve Masterclass",
    channel: "ActiveSG Academy", duration: "14:10", views: "9.2K",
    sport: "Tennis", level: "Intermediate",
    icon: "🎾", color: "#F43F5E",
    desc: "Flat serve, slice serve, and kick serve — technique breakdown and common mistakes.",
  },
  {
    id: 9, title: "5-Minute Warm-Up Routine",
    channel: "ActiveSG Fitness", duration: "5:00", views: "52.1K",
    sport: "Fitness", level: "All Levels",
    icon: "🔥", color: "#F97316",
    desc: "Dynamic warm-up to do before any sport. Reduces injury risk and improves performance.",
  },
];

const LessonsPage = ({onBack}) => {
  return (
    <Shell title="Lessons" onBack={onBack}>
      <div style={{ fontSize: 13, color: $.t3, marginBottom: 18 }}>
        Watch workout videos and sport tutorials
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {["All", "Fitness", "Badminton", "Basketball", "Swimming", "Football", "Tennis", "Yoga"].map(cat => (
          <button key={cat} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: cat === "All" ? $.ac : "rgba(255,255,255,0.05)",
            color: cat === "All" ? $.bg : $.t2,
            border: cat === "All" ? "none" : `1px solid ${$.bd}`,
            cursor: "pointer", fontFamily: $.font, whiteSpace: "nowrap", flexShrink: 0,
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {VIDEOS.map(vid => (
          <Card key={vid.id} style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
            {/* Thumbnail placeholder */}
            <div style={{
              height: 140, background: `linear-gradient(135deg, ${vid.color}18, ${vid.color}08)`,
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            }}>
              <span style={{ fontSize: 48 }}>{vid.icon}</span>
              {/* Play button overlay */}
              <div style={{
                position: "absolute", width: 48, height: 48, borderRadius: "50%",
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.2)",
              }}>
                <div style={{
                  width: 0, height: 0, marginLeft: 4,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "16px solid white",
                }} />
              </div>
              {/* Duration badge */}
              <div style={{
                position: "absolute", bottom: 8, right: 8,
                background: "rgba(0,0,0,0.75)", borderRadius: 6,
                padding: "3px 8px", fontSize: 11, fontWeight: 700, color: "#fff",
              }}>{vid.duration}</div>
            </div>

            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{vid.title}</div>
              <div style={{ fontSize: 12, color: $.t3, marginBottom: 8 }}>{vid.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: $.t3 }}>{vid.channel}</span>
                  <span style={{ fontSize: 11, color: $.t3 }}>·</span>
                  <span style={{ fontSize: 11, color: $.t3 }}>{vid.views} views</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Pill color={vid.color}>{vid.sport}</Pill>
                  <Pill color={$.t2}>{vid.level}</Pill>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
};

export default LessonsPage;
