import React, { useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import "./CommitGraph.css";

const LINE_COLORS = [
    "#2D6CDF",
    "#E85C8B",
    "#00A89D",
    "#F2994A",
    "#9B59B6",
    "#27AE60",
    "#E74C3C",
    "#2D9CDB",
];

const TOKENS = {
    margin: { top: 64, right: 240, bottom: 64, left: 120 },
    laneGap: 180,
    stepY: 72,
    lineWidth: 6,
    nodeR: 8,
    labelMax: 28,
};

export default function CommitGraph({ branches = [], pullCommits = [], graph }) {
    const toast = useToast();

    const { nodes, links } = useMemo(() => {
        if (graph?.nodes?.length) {
            const id2time = new Map(graph.nodes.map(n => [n.id, toTime(n.date || n.committedAt)]));
            const fixedLinks = (graph.links || []).map(l => {
                const ds = id2time.get(l.source) ?? 0;
                const dt = id2time.get(l.target) ?? 0;
                return ds <= dt ? l : { source: l.target, target: l.source };
            });
            return {
                nodes: graph.nodes.map(n => ({
                    id: n.id,
                    message: n.message || n.msg || "(no message)",
                    author: n.author || n.committer || "",
                    date: n.date || n.committedAt || "",
                    __hint: n.branch || "",
                })),
                links: fixedLinks,
            };
        }

        const nn = [];
        const ll = [];
        branches.forEach(b => {
            const list = (b.pushedCommits || [])
                .map(c => ({
                    id: c.id || c.hash,
                    message: c.message || "(no message)",
                    author: c.author || "",
                    date: c.committedAt || c.date || "",
                    __hint: b.name,
                }))
                .filter(n => n.id);

            if (b.name === "main" && pullCommits?.length) {
                const pushed = new Set(list.map(n => n.id));
                pullCommits.forEach(pc => {
                    const id = pc.id || pc.hash;
                    if (!pushed.has(id)) {
                        list.push({
                            id,
                            message: pc.message || "(pulled)",
                            author: pc.author || "",
                            date: pc.committedAt || pc.date || "",
                            __pulled: true,
                            __hint: b.name,
                        });
                    }
                });
            }

            list.sort((a, b) => toTime(a.date) - toTime(b.date));
            nn.push(...list);
            for (let i = 1; i < list.length; i++) {
                ll.push({ source: list[i - 1].id, target: list[i].id });
            }
        });

        return { nodes: dedup(nn), links: ll };
    }, [branches, pullCommits, graph]);

    const layout = useMemo(() => computeSubwayLayout(nodes, links, TOKENS), [nodes, links]);

    const width = TOKENS.margin.left + layout.laneCount * TOKENS.laneGap + TOKENS.margin.right;
    const height = TOKENS.margin.top + layout.order.length * TOKENS.stepY + TOKENS.margin.bottom;

    const labelToLane = useMemo(() => {
        const m = new Map();
        layout.laneLabels.forEach((label, lane) => {
            if (label && !m.has(label)) m.set(label, lane);
        });
        return m;
    }, [layout.laneLabels]);

    const onCommitClick = (n) => {
        toast({
            title: "커밋",
            description: n.message || "(no message)",
            status: "info",
            duration: 1800,
            isClosable: true,
        });
    };

    return (
        <div className="subway-graph">
            <div className="sg-toolbar">
                <div className="sg-legend">
                    {Array.from(labelToLane.entries()).map(([label, lane]) => (
                        <span key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                  className="sg-dot"
                  style={{ background: LINE_COLORS[lane % LINE_COLORS.length] }}
              />
                            {label}
            </span>
                    ))}
                </div>
            </div>

            <div className="sg-viewport">
                <svg className="sg-svg" width={Math.max(width, 720)} height={Math.max(height, 420)}>
                    {Array.from({ length: layout.laneCount }).map((_, lane) => {
                        const x = laneX(lane, TOKENS);
                        const label = layout.laneLabels[lane] || `line ${lane + 1}`;
                        return (
                            <g key={`lane-header-${lane}`} className="sg-lane-header">
                                <circle cx={x} cy={TOKENS.margin.top - 38} r={5} fill={LINE_COLORS[lane % LINE_COLORS.length]} />
                                <text x={x + 12} y={TOKENS.margin.top - 34} className="sg-lane-text">
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {layout.rails.map((rail, idx) => {
                        const color = LINE_COLORS[rail.lane % LINE_COLORS.length];
                        return (
                            <path
                                key={`rail-${idx}`}
                                d={rail.path}
                                className="sg-rail"
                                style={{ stroke: color, strokeWidth: TOKENS.lineWidth }}
                            />
                        );
                    })}

                    {layout.order.map((id) => {
                        const n = layout.nodeMap.get(id);
                        if (!n) return null;

                        const x = laneX(n.lane, TOKENS);
                        const y = rowY(n.row, TOKENS);
                        const color = LINE_COLORS[n.lane % LINE_COLORS.length];
                        const label = trunc(n.message, TOKENS.labelMax);

                        return (
                            <g key={`node-${id}`} className="sg-station" transform={`translate(${x},${y})`}>
                                <circle
                                    r={TOKENS.nodeR}
                                    fill="#fff"
                                    stroke={color}
                                    strokeWidth="3"
                                    className={n.inDeg >= 2 ? "is-transfer" : ""}
                                />
                                <g className="sg-chip" onClick={() => onCommitClick(n)}>
                                    <rect
                                        x={12}
                                        y={-16}
                                        rx={8}
                                        ry={8}
                                        width={Math.min(220, 18 + label.length * 7)}
                                        height={32}
                                    />
                                    <text x={20} y={4}>{label}</text>
                                </g>
                                <title>
                                    {[
                                        n.message || "(no message)",
                                        n.author ? `by ${n.author}` : null,
                                        n.date ? formatDate(n.date) : null,
                                        n.inDeg >= 2 ? `merge (${n.inDeg} parents)` : null,
                                    ].filter(Boolean).join(" • ")}
                                </title>
                            </g>
                        );
                    })}

                    {layout.order.map((id) => {
                        const n = layout.nodeMap.get(id);
                        if (!n || n.inDeg < 2) return null;
                        const x = laneX(n.lane, TOKENS);
                        const y = rowY(n.row, TOKENS);
                        return (
                            <g key={`transfer-${id}`} transform={`translate(${x},${y})`} className="sg-transfer">
                                <circle r={TOKENS.nodeR + 6} fill="none" stroke="currentColor" strokeWidth="2" />
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

function toTime(d) {
    if (!d) return 0;
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : 0;
}
function trunc(s = "", n = 28) {
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function formatDate(d) {
    const m = new Date(d);
    return Number.isNaN(m.getTime()) ? d : m.toLocaleString();
}
function laneX(lane, T) {
    return T.margin.left + lane * T.laneGap;
}
function rowY(row, T) {
    return T.margin.top + row * T.stepY;
}
function dedup(arr) {
    const seen = new Set();
    const out = [];
    for (const n of arr) {
        if (!n?.id || seen.has(n.id)) continue;
        seen.add(n.id);
        out.push(n);
    }
    return out;
}

function computeSubwayLayout(nodes = [], links = [], T) {
    const nodeMap = new Map(nodes.map(n => [n.id, {
        ...n,
        time: toTime(n.date),
        parents: [],
        children: [],
        inDeg: 0,
        lane: -1,
        row: -1,
    }]));

    const edges = [];
    for (const l of links) {
        const s = nodeMap.get(l.source);
        const t = nodeMap.get(l.target);
        if (!s || !t) continue;
        if (s.time > t.time) {
            s.children.push(t.id);
            t.parents.push(s.id);
            t.inDeg++;
            edges.push([s.id, t.id]);
        } else {
            s.children.push(t.id);
            t.parents.push(s.id);
            t.inDeg++;
            edges.push([s.id, t.id]);
        }
    }

    const indeg = new Map([...nodeMap].map(([id, n]) => [id, n.inDeg]));
    const q = [];
    for (const [id, n] of nodeMap) if ((indeg.get(id) ?? 0) === 0) q.push(id);
    q.sort((a, b) => nodeMap.get(a).time - nodeMap.get(b).time);

    const order = [];
    while (q.length) {
        const id = q.shift();
        order.push(id);
        for (const c of (nodeMap.get(id).children || [])) {
            indeg.set(c, (indeg.get(c) ?? 0) - 1);
            if (indeg.get(c) === 0) q.push(c);
        }
        q.sort((a, b) => nodeMap.get(a).time - nodeMap.get(b).time);
    }
    if (order.length < nodeMap.size) {
        for (const id of nodeMap.keys()) if (!order.includes(id)) order.push(id);
    }

    const used = [];
    const hintLane = new Map();
    order.forEach((id, row) => {
        const n = nodeMap.get(id);
        n.row = row;
        let lane = null;
        if (n.parents.length) {
            const p0 = nodeMap.get(n.parents[0]);
            lane = p0?.lane ?? null;
        }
        if (lane == null && n.__hint) {
            if (hintLane.has(n.__hint)) lane = hintLane.get(n.__hint);
            else {
                lane = firstFreeLane(used);
                hintLane.set(n.__hint, lane);
            }
        }
        if (lane == null) lane = firstFreeLane(used);
        n.lane = lane;
        used[lane] = row;
    });
    const laneCount = Math.max(1, used.length);

    const rails = [];
    for (let lane = 0; lane < laneCount; lane++) {
        const laneNodes = order
            .map(id => nodeMap.get(id))
            .filter(n => n.lane === lane);
        if (laneNodes.length === 0) continue;

        const minRow = laneNodes[0].row;
        const maxRow = laneNodes[laneNodes.length - 1].row;
        const x = laneX(lane, T);
        const y1 = rowY(minRow, T) - T.stepY * 0.5;
        const y2 = rowY(maxRow, T) + T.stepY * 0.5;
        rails.push({ lane, path: `M ${x} ${y1} L ${x} ${y2}` });
    }

    const laneLabels = Array.from({ length: laneCount }, () => "");
    for (let lane = 0; lane < laneCount; lane++) {
        const counts = new Map();
        order.forEach(id => {
            const n = nodeMap.get(id);
            if (n?.lane === lane && n.__hint) {
                counts.set(n.__hint, (counts.get(n.__hint) || 0) + 1);
            }
        });
        let best = "";
        let max = 0;
        for (const [k, v] of counts) {
            if (v > max) {
                max = v;
                best = k;
            }
        }
        laneLabels[lane] = best || `line ${lane + 1}`;
    }

    return { nodeMap, order, rails, laneCount, laneLabels };
}

function firstFreeLane(used) {
    for (let i = 0; i < used.length; i++) return i;
    return used.length;
}
