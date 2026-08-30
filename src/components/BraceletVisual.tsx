import { GEMSTONE_MAP } from "@/data/gemstones";

export default function BraceletVisual({
  gemstoneIds,
  size = "md",
}: {
  gemstoneIds: string[];
  size?: "sm" | "md" | "lg";
}) {
  const beadCount = 12;
  const beads = Array.from({ length: beadCount }, (_, i) => {
    const stoneId = gemstoneIds[i % gemstoneIds.length];
    return GEMSTONE_MAP[stoneId];
  });

  const dims = {
    sm: { box: 96, bead: 12 },
    md: { box: 160, bead: 18 },
    lg: { box: 260, bead: 26 },
  }[size];

  const radius = dims.box / 2 - dims.bead / 2 - 4;
  const center = dims.box / 2;

  return (
    <div
      className="relative mx-auto rounded-full bg-gradient-to-br from-[var(--color-cream)] to-[#f0e4d3]"
      style={{ width: dims.box, height: dims.box }}
      aria-hidden="true"
    >
      {beads.map((stone, i) => {
        const angle = (i / beadCount) * 2 * Math.PI;
        const x = center + radius * Math.cos(angle) - dims.bead / 2;
        const y = center + radius * Math.sin(angle) - dims.bead / 2;
        return (
          <span
            key={i}
            className="absolute rounded-full shadow-sm ring-1 ring-black/10"
            style={{
              width: dims.bead,
              height: dims.bead,
              left: x,
              top: y,
              background: `radial-gradient(circle at 35% 30%, ${stone?.hex ?? "#ccc"}dd, ${stone?.hex ?? "#ccc"})`,
            }}
          />
        );
      })}
    </div>
  );
}
