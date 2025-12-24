
'use client';

import { useRef, useEffect } from 'react';
import { motion, useTransform, useMotionValue, animate } from 'framer-motion';
import { SectionShell } from '../components/SectionShell';
import { DiagramCanvas } from '../components/DiagramCanvas';
import { Node } from '../components/Node';
import { Edge } from '../components/Edge';
//
import { ArrowToken } from '../components/ArrowToken';
import { Badge } from '../components/Badge';
import { useSectionProgress } from '../components/useSectionProgress';
import { segmentT } from '../components/phase';
import { easeInOutCubic } from '../components/anim';

// Navbar removed per request

function Hero() {
  return (
    <section id="content" className="relative mx-auto flex min-h-[80vh] w-full max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Agentic AI Frameworks, Visualized</h1>
          <p className="max-w-prose text-base text-white/80">Scroll through interactive diagrams to see how popular agent frameworks orchestrate planning, tool use, handoffs, memory, and evaluation — powered by scroll-linked motion for clarity over flair.</p>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5">↓</span>
            <span>Scroll to explore</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-soft">
          <p className="text-sm text-white/70">Ideas covered</p>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-white/90 sm:grid-cols-2">
            <li className="rounded-xl border border-white/10 bg-white/[0.06] p-3">Graph/state machines</li>
            <li className="rounded-xl border border-white/10 bg-white/[0.06] p-3">Role-based crews</li>
            <li className="rounded-xl border border-white/10 bg-white/[0.06] p-3">Conversation + critique</li>
            <li className="rounded-xl border border-white/10 bg-white/[0.06] p-3">Routers + ownership</li>
            <li className="rounded-xl border border-white/10 bg-white/[0.06] p-3">ReAct loops</li>
            <li className="rounded-xl border border-white/10 bg-white/[0.06] p-3">Memory paging</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function LangGraphDiagram({ progress }: { progress: ReturnType<typeof useSectionProgress> }) {
  // Time-based looping animation independent of scroll
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: 18, ease: 'linear', repeat: Infinity, repeatType: 'loop' });
    return () => controls.stop();
  }, [t]);
  const presenceT = (a: number, b: number) => useTransform(t, v => {
    const c = (a + b) / 2; const hw = (b - a) / 2; const u = (v - c) / (hw || 1e-6);
    return Math.max(0, Math.min(1, 1 - Math.abs(u)));
  });
  const drawT = (a: number, b: number) => useTransform(t, v => Math.max(0, Math.min(1, (v - a) / (b - a))));
  const pC = presenceT(0.9, 1);

  const A: [number, number] = [14, 50]; // Input
  const Bn: [number, number] = [30, 30]; // Planner
  const Cn: [number, number] = [46, 50]; // Tools
  const Dn: [number, number] = [62, 30]; // Verifier
  const E: [number, number] = [82, 50]; // Output

  const loopPath: Array<[number, number]> = [A, Bn, Cn, Dn, Cn, Dn, E];

  // Determine active/draw per segment with better timing
  const sAB: [number, number] = [0.00, 0.16];
  const sBC: [number, number] = [0.16, 0.32];
  const sCD: [number, number] = [0.32, 0.48];
  const sDC: [number, number] = [0.48, 0.70];
  const sCD2: [number, number] = [0.70, 0.86];
  const sDE: [number, number] = [0.86, 1.00];

  const segDraw = (seg: [number, number]) => drawT(seg[0], seg[1]);
  const segActive = (seg: [number, number]) => presenceT(seg[0], seg[1]);

  const activeAB = segActive(sAB);
  const activeBC = segActive(sBC);
  const activeCD = segActive(sCD);
  const activeDC = segActive(sDC);
  const activeCD2 = segActive(sCD2);
  const activeDE = segActive(sDE);

  const drawAB = segDraw(sAB);
  const drawBC = segDraw(sBC);
  const drawCD = segDraw(sCD);
  const drawDC = segDraw(sDC);
  const drawCD2 = segDraw(sCD2);
  const drawDE = segDraw(sDE);

  const nA = presenceT(0, sBC[0]);
  const nB = presenceT(sAB[0], sCD[0]);
  const nC = presenceT(sBC[0], sDE[0]);
  const nD = presenceT(sCD[0], sDE[1]);
  const nE = presenceT(0.9, 1);

  return (
    <DiagramCanvas title="LangGraph" legend={
      <>
        <span className="badge">A. Overview</span>
        <span className="badge">B. Execute + Verify Loop</span>
        <span className="badge">C. Output</span>
      </>
    }>
      {/* Edges */}
      <Edge points={[A, Bn]} active={activeAB} draw={drawAB} label="Input → Planner" />
      <Edge points={[Bn, Cn]} active={activeBC} draw={drawBC} label="Planner → Tools" />
      <Edge points={[Cn, Dn]} active={activeCD} draw={drawCD} label="Tools → Verifier" />
      <Edge points={[Dn, Cn]} active={activeDC} draw={drawDC} label="Verifier → Tools" />
      <Edge points={[Cn, Dn]} active={activeCD2} draw={drawCD2} label="Tools → Verifier" />
      <Edge points={[Dn, E]} active={activeDE} draw={drawDE} label="Verifier → Output" />

      {/* Nodes */}
      <Node x={A[0]} y={A[1]} label="Input" intensity={nA} />
      <Node x={Bn[0]} y={Bn[1]} label="Planner" intensity={nB} />
      <Node x={Cn[0]} y={Cn[1]} label="Tools" intensity={nC} />
      <Node x={Dn[0]} y={Dn[1]} label="Verifier" intensity={nD} />
      <Node x={E[0]} y={E[1]} label="Output" intensity={nE} />

      {/* Animated arrow along path */}
      <ArrowToken path={loopPath} progress={t} ariaLabel="Flow arrow" />

      {/* Completion badge */}
      <motion.div className="absolute" style={{ left: `${E[0]}%`, top: `${E[1] - 12}%`, transform: 'translate(-50%, 0)' }}>
        <motion.div style={{ opacity: pC, scale: useTransform(pC, t => 0.9 + t * 0.12), rotate: useTransform(pC, t => (1 - t) * -6) }}>
          <Badge label="Verified Output" tone="success" />
        </motion.div>
      </motion.div>
    </DiagramCanvas>
  );
}

function CrewAIDiagram({ progress }: { progress: ReturnType<typeof useSectionProgress> }) {
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: 16, ease: 'linear', repeat: Infinity, repeatType: 'loop' });
    return () => controls.stop();
  }, [t]);
  const presenceT = (a: number, b: number) => useTransform(t, v => {
    const c = (a + b) / 2; const hw = (b - a) / 2; const u = (v - c) / (hw || 1e-6);
    return Math.max(0, Math.min(1, 1 - Math.abs(u)));
  });
  const drawT = (a: number, b: number) => useTransform(t, v => Math.max(0, Math.min(1, (v - a) / (b - a))));
  const pC = presenceT(0.85, 1);

  const R: [number, number] = [16, 40]; // Researcher
  const A: [number, number] = [36, 40]; // Analyst
  const W: [number, number] = [56, 40]; // Writer
  const Re: [number, number] = [76, 40]; // Reviewer
  const taskPath = [R, A, W, Re];

  const activeRA = presenceT(0, 0.33);
  const activeAW = presenceT(0.33, 0.66);
  const activeWR = presenceT(0.66, 1);
  const drawRA = drawT(0, 0.33);
  const drawAW = drawT(0.33, 0.66);
  const drawWR = drawT(0.66, 1);

  return (
    <DiagramCanvas title="CrewAI" legend={
      <>
        <span className="badge">A. Roles defined</span>
        <span className="badge">B. Handoffs + parallel check</span>
        <span className="badge">C. Delivered</span>
      </>
    }>
      <Edge points={[R, A]} active={activeRA} draw={drawRA} label="Researcher → Analyst" />
      <Edge points={[A, W]} active={activeAW} draw={drawAW} label="Analyst → Writer" />
      <Edge points={[W, Re]} active={activeWR} draw={drawWR} label="Writer → Reviewer" />
      <Node x={R[0]} y={R[1]} label="Researcher" />
      <Node x={A[0]} y={A[1]} label="Analyst" />
      <Node x={W[0]} y={W[1]} label="Writer" />
      <Node x={Re[0]} y={Re[1]} label="Reviewer" />
      <ArrowToken path={taskPath} progress={t} ariaLabel="Task flow arrow" />
      <motion.div className="absolute" style={{ left: `${Re[0]}%`, top: `${Re[1] - 12}%`, transform: 'translate(-50%, 0)' }}>
        <motion.div style={{ opacity: pC, scale: useTransform(pC, t => 0.9 + t * 0.15), rotate: useTransform(pC, t => (1 - t) * -8) }}>
          <Badge label="Delivered" tone="success" />
        </motion.div>
      </motion.div>
    </DiagramCanvas>
  );
}

function AutoGenDiagram({ progress }: { progress: ReturnType<typeof useSectionProgress> }) {
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: 16, ease: 'linear', repeat: Infinity, repeatType: 'loop' });
    return () => controls.stop();
  }, [t]);
  const presenceT = (a: number, b: number) => useTransform(t, v => {
    const c = (a + b) / 2; const hw = (b - a) / 2; const u = (v - c) / (hw || 1e-6);
    return Math.max(0, Math.min(1, 1 - Math.abs(u)));
  });
  const drawT = (a: number, b: number) => useTransform(t, v => Math.max(0, Math.min(1, (v - a) / (b - a))));
  const pC = presenceT(0.85, 1);
  const Acol: [number, number] = [28, 30];
  const Bcol: [number, number] = [72, 30];
  const Judge: [number, number] = [50, 14];
  const path1: Array<[number, number]> = [Acol, Bcol, Acol];

  const m1 = presenceT(0.0, 0.34);
  const m2 = presenceT(0.34, 0.67);
  const m3 = presenceT(0.67, 1.0);
  const drawA2B = drawT(0, 0.34);
  const drawB2J = drawT(0.34, 0.67);
  const activeJ2A = presenceT(0.67, 1);
  const drawJ2A = drawT(0.67, 1);

  return (
    <DiagramCanvas title="AutoGen" legend={
      <>
        <span className="badge">A. Two agents</span>
        <span className="badge">B. Conversation + Critique</span>
        <span className="badge">C. Consensus</span>
      </>
    }>
      {/* Participants */}
      <Node x={Acol[0]} y={Acol[1]} label="Agent A" />
      <Node x={Bcol[0]} y={Bcol[1]} label="Agent B" />
      <Node x={Judge[0]} y={Judge[1]} label="Critic" pill />

      {/* Message bubbles */}
      <Node x={28} y={55} w={22} h={10} label="Initial proposal" intensity={m1} />
      <Node x={72} y={66} w={22} h={10} label="Response" intensity={m2} />
      <Node x={50} y={46} w={26} h={10} label="Critique → Revise" intensity={m2} />
      <Node x={28} y={77} w={26} h={10} label="Revised message" intensity={m3} />

      {/* Arrows */}
      <Edge points={[Acol, Bcol]} active={m1} draw={drawA2B} label="A → B" />
      <Edge points={[Bcol, Judge]} active={m2} draw={drawB2J} label="B → Critic" />
      <Edge points={[Judge, Acol]} active={activeJ2A} draw={drawJ2A} label="Critic → A" />

      {/* Token as message flow */}
      <ArrowToken path={path1} progress={t} ariaLabel="Conversation flow" />

      <motion.div className="absolute" style={{ left: '50%', top: '88%', transform: 'translate(-50%, 0)' }}>
        <motion.div style={{ opacity: pC }}>
          <Badge label="Consensus" tone="success" />
        </motion.div>
      </motion.div>
    </DiagramCanvas>
  );
}

function SwarmDiagram({ progress }: { progress: ReturnType<typeof useSectionProgress> }) {
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: 16, ease: 'linear', repeat: Infinity, repeatType: 'loop' });
    return () => controls.stop();
  }, [t]);
  const presenceT = (a: number, b: number) => useTransform(t, v => {
    const c = (a + b) / 2; const hw = (b - a) / 2; const u = (v - c) / (hw || 1e-6);
    return Math.max(0, Math.min(1, 1 - Math.abs(u)));
  });
  const drawT = (a: number, b: number) => useTransform(t, v => Math.max(0, Math.min(1, (v - a) / (b - a))));
  const pC = presenceT(0.85, 1);
  const Router: [number, number] = [50, 20];
  const S1: [number, number] = [26, 60];
  const S2: [number, number] = [44, 60];
  const S3: [number, number] = [56, 60];
  const S4: [number, number] = [74, 60];

  const path: Array<[number, number]> = [Router, S2, S3, Router];
  const e1 = presenceT(0, 0.34);
  const e2 = presenceT(0.34, 0.67);
  const e3 = presenceT(0.67, 1);
  const drawE1 = drawT(0, 0.34);
  const drawE2 = drawT(0.34, 0.67);
  const drawE3 = drawT(0.67, 1);
  const tMove = drawT(0.34, 0.67);
  const ownerLeft = useTransform(tMove, t => `${S2[0] + (S3[0] - S2[0]) * t}%`);
  const ownerTop = useTransform(tMove, t => `${S2[1] + (S3[1] - S2[1]) * t - 12}%`);

  return (
    <DiagramCanvas title="OpenAI Swarm" legend={
      <>
        <span className="badge">A. Router + Specialists</span>
        <span className="badge">B. Ownership handoffs</span>
        <span className="badge">C. Resolved</span>
      </>
    }>
      <Edge points={[Router, S2]} active={e1} draw={drawE1} label="Route to specialist" />
      <Edge points={[S2, S3]} active={e2} draw={drawE2} label="Handoff" />
      <Edge points={[S3, Router]} active={e3} draw={drawE3} label="Resolved" />

      <Node x={Router[0]} y={Router[1]} label="Router" />
      <Node x={S1[0]} y={S1[1]} label="Spec A" />
      <Node x={S2[0]} y={S2[1]} label="Spec B" />
      <Node x={S3[0]} y={S3[1]} label="Spec C" />
      <Node x={S4[0]} y={S4[1]} label="Spec D" />

      <ArrowToken path={path} progress={t} ariaLabel="Routing flow" />

      {/* Ownership badge follows S2 → S3 */}
      <motion.div className="absolute" style={{ left: ownerLeft, top: ownerTop, transform: 'translate(-50%, 0)' }}>
        <Badge label="Owner" tone="muted" />
      </motion.div>

      <motion.div className="absolute" style={{ left: `${Router[0]}%`, top: `${Router[1] - 12}%`, transform: 'translate(-50%, 0)' }}>
        <motion.div style={{ opacity: pC }}>
          <Badge label="Resolved" tone="success" />
        </motion.div>
      </motion.div>
    </DiagramCanvas>
  );
}

function ReActDiagram({ progress }: { progress: ReturnType<typeof useSectionProgress> }) {
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: 14, ease: 'linear', repeat: Infinity, repeatType: 'loop' });
    return () => controls.stop();
  }, [t]);
  const presenceT = (a: number, b: number) => useTransform(t, v => {
    const c = (a + b) / 2; const hw = (b - a) / 2; const u = (v - c) / (hw || 1e-6);
    return Math.max(0, Math.min(1, 1 - Math.abs(u)));
  });
  const drawT = (a: number, b: number) => useTransform(t, v => Math.max(0, Math.min(1, (v - a) / (b - a))));
  const pC = presenceT(0.85, 1);
  const Thought: [number, number] = [24, 50];
  const Action: [number, number] = [50, 50];
  const Observation: [number, number] = [76, 50];
  const Tools: [number, number] = [50, 72];
  const loop: Array<[number, number]> = [Thought, Action, Observation, Thought];

  const toAction = presenceT(0, 0.34);
  const toObs = presenceT(0.34, 0.67);
  const toThought = presenceT(0.67, 1);
  const toolPulse = presenceT(0.2, 0.5);
  const draw1 = drawT(0, 0.34);
  const draw2 = drawT(0.34, 0.67);
  const draw3 = drawT(0.67, 1);
  const drawTool = drawT(0.2, 0.5);

  return (
    <DiagramCanvas title="ReAct" legend={
      <>
        <span className="badge">A. Reason</span>
        <span className="badge">B. Act → Observe</span>
        <span className="badge">C. Answer</span>
      </>
    }>
      <Edge points={[Thought, Action]} active={toAction} draw={draw1} label="Thought → Action" />
      <Edge points={[Action, Observation]} active={toObs} draw={draw2} label="Action → Observation" />
      <Edge points={[Observation, Thought]} active={toThought} draw={draw3} label="Observation → Thought" />
      <Edge points={[Action, Tools]} active={toolPulse} dashed draw={drawTool} label="Tool call" />

      <Node x={Thought[0]} y={Thought[1]} label="Thought" />
      <Node x={Action[0]} y={Action[1]} label="Action" />
      <Node x={Observation[0]} y={Observation[1]} label="Observation" />
      <Node x={Tools[0]} y={Tools[1]} label="Tool" intensity={toolPulse} />

      <ArrowToken path={loop} progress={t} ariaLabel="ReAct loop arrow" />

      <motion.div className="absolute" style={{ left: `${Observation[0]}%`, top: `${Observation[1] + 14}%`, transform: 'translate(-50%, 0)' }}>
        <motion.div style={{ opacity: pC, scale: useTransform(pC, t => 0.9 + t * 0.12) }}>
          <Badge label="Completed reasoning" tone="success" />
        </motion.div>
      </motion.div>
    </DiagramCanvas>
  );
}

function MemGPTDiagram({ progress }: { progress: ReturnType<typeof useSectionProgress> }) {
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: 16, ease: 'linear', repeat: Infinity, repeatType: 'loop' });
    return () => controls.stop();
  }, [t]);
  const presenceT = (a: number, b: number) => useTransform(t, v => {
    const c = (a + b) / 2; const hw = (b - a) / 2; const u = (v - c) / (hw || 1e-6);
    return Math.max(0, Math.min(1, 1 - Math.abs(u)));
  });
  const drawT = (a: number, b: number) => useTransform(t, v => Math.max(0, Math.min(1, (v - a) / (b - a))));
  const pC = presenceT(0.85, 1);
  const STM: [number, number] = [30, 50];
  const Pager: [number, number] = [50, 30];
  const LTM: [number, number] = [72, 50];
  const path: Array<[number, number]> = [STM, LTM, STM];

  const toSTM = presenceT(0, 0.34);
  const toLTM = presenceT(0.34, 0.67);
  const backSTM = presenceT(0.67, 1);
  const draw1 = drawT(0, 0.34);
  const draw2 = drawT(0.34, 0.67);
  const draw3 = drawT(0.67, 1);

  return (
    <DiagramCanvas title="MemGPT" legend={
      <>
        <span className="badge">A. Short-term write</span>
        <span className="badge">B. Page out / recall</span>
        <span className="badge">C. Loaded</span>
      </>
    }>
      <Edge points={[STM, Pager]} active={toSTM} dashed draw={draw1} label="STM → Pager" />
      <Edge points={[Pager, LTM]} active={toLTM} dashed draw={draw2} label="Pager → LTM" />
      <Edge points={[LTM, STM]} active={backSTM} dashed draw={draw3} label="Recall" />

      <Node x={STM[0]} y={STM[1]} w={24} label="Short-term" />
      <Node x={Pager[0]} y={Pager[1]} pill w={20} h={10} label="Pager" />
      <Node x={LTM[0]} y={LTM[1]} w={24} label="Long-term" />

      <ArrowToken path={path} progress={t} ariaLabel="Paging arrow" />

      <motion.div className="absolute" style={{ left: `${STM[0]}%`, top: `${STM[1] + 14}%`, transform: 'translate(-50%, 0)' }}>
        <motion.div style={{ opacity: pC, scale: useTransform(pC, t => 0.9 + t * 0.12) }}>
          <Badge label="Relevant memory loaded" tone="success" />
        </motion.div>
      </motion.div>
    </DiagramCanvas>
  );
}

function PatternLibrary() {
  const items = [
    { title: 'Planner → Executor → Critic', diagram: (
      <div className="relative h-28">
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arr1" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>
          <path d="M14,50 L40,50" stroke="rgba(148,163,184,0.7)" strokeWidth="2" markerEnd="url(#arr1)" />
          <path d="M60,50 L86,50" stroke="rgba(148,163,184,0.7)" strokeWidth="2" markerEnd="url(#arr1)" />
        </svg>
        <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-[22%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Planner</div></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] hover:scale-[1.03] transition"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Executor</div></div>
        <div className="absolute left-[78%] top-1/2 -translate-x-full -translate-y-1/2 w-[22%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Critic</div></div>
      </div>
    )},
    { title: 'Router → Specialists', diagram: (
      <div className="relative h-28">
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arr2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>
          <path d="M50,24 L24,76" stroke="rgba(148,163,184,0.7)" strokeWidth="2" markerEnd="url(#arr2)" />
          <path d="M50,24 L50,76" stroke="rgba(148,163,184,0.7)" strokeWidth="2" markerEnd="url(#arr2)" />
          <path d="M50,24 L76,76" stroke="rgba(148,163,184,0.7)" strokeWidth="2" markerEnd="url(#arr2)" />
        </svg>
        <div className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 w-[22%]"><div className="rounded-full border border-white/10 bg-white/5 p-2 text-center text-xs">Router</div></div>
        <div className="absolute left-[24%] top-[76%] -translate-x-1/2 -translate-y-1/2 w-[20%] hover:translate-y-[-2px] transition"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Spec A</div></div>
        <div className="absolute left-1/2 top-[76%] -translate-x-1/2 -translate-y-1/2 w-[20%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Spec B</div></div>
        <div className="absolute left-[76%] top-[76%] -translate-x-1/2 -translate-y-1/2 w-[20%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Spec C</div></div>
      </div>
    )},
    { title: 'Tool-Using agent with Guardrails', diagram: (
      <div className="relative h-28">
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arr3" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>
          <path d="M30,50 L70,50" stroke="rgba(148,163,184,0.7)" strokeWidth="2" markerEnd="url(#arr3)" />
          <rect x="18" y="24" width="10" height="52" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="72" y="24" width="10" height="52" rx="4" fill="rgba(255,255,255,0.06)" />
        </svg>
        <div className="absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Agent</div></div>
        <div className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] hover:scale-[1.02] transition"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Tool</div></div>
      </div>
    )},
    { title: 'Human-in-the-Loop', diagram: (
      <div className="relative h-28">
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arr4" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>
          <path d="M26,50 L50,30 L74,50 L50,70 Z" fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="2" />
        </svg>
        <div className="absolute left-[26%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Agent</div></div>
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[22%] hover:translate-y-[1px] transition"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Human</div></div>
        <div className="absolute left-[74%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Tool</div></div>
      </div>
    )},
    { title: 'Evaluator/Judge', diagram: (
      <div className="relative h-28">
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arr5" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>
          <path d="M20,50 L50,50 L80,50" stroke="rgba(148,163,184,0.7)" strokeWidth="2" markerEnd="url(#arr5)" />
        </svg>
        <div className="absolute left-[20%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Outputs</div></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] hover:scale-[1.03] transition"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Judge</div></div>
        <div className="absolute left-[80%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%]"><div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center text-xs">Score</div></div>
      </div>
    )},
  ];

  return (
    <section id="patterns" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <h2 className="text-3xl font-semibold tracking-tight">Pattern Library</h2>
      <p className="mt-2 text-sm text-white/70">Mini diagrams with common orchestration motifs</p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft hover:bg-white/10 transition">
            <p className="text-sm text-white/80">{it.title}</p>
            <div className="mt-3 rounded-xl bg-[color:var(--panel)] grid-bg relative overflow-hidden soft-border">
              {it.diagram}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  const langRef = useRef<HTMLElement>(null);
  const crewRef = useRef<HTMLElement>(null);
  const autoRef = useRef<HTMLElement>(null);
  const swarmRef = useRef<HTMLElement>(null);
  const reactRef = useRef<HTMLElement>(null);
  const memRef = useRef<HTMLElement>(null);

  const langProg = useSectionProgress(langRef);
  const crewProg = useSectionProgress(crewRef);
  const autoProg = useSectionProgress(autoRef);
  const swarmProg = useSectionProgress(swarmRef);
  const reactProg = useSectionProgress(reactRef);
  const memProg = useSectionProgress(memRef);

  return (
    <main>
      <Hero />

      <SectionShell
        ref={langRef as any}
        id="langgraph"
          title="LangGraph: Graph/state machine execution"
          subtitle="Define nodes and edges; manage control flow, conditional branches, and retries across tool and reasoning steps."
          bullets={[
            'Deterministic node transitions',
            'State updates at each step',
            'Conditional verification loop',
            'Great for reliable pipelines',
          ]}
          callout="Structured multi-step workflows with verifications and fallbacks."
      >
        <LangGraphDiagram progress={langProg} />
      </SectionShell>

      <SectionShell
        ref={crewRef as any}
        id="crewai"
          title="CrewAI: Role-based team + handoffs"
          subtitle="Coordinate a crew of specialized agents with well-defined responsibilities and clear handoff policies."
          bullets={[
            'Explicit roles & goals',
            'Sequential & parallel work',
            'Progress visibility',
            'Review before delivery',
          ]}
          callout="Complex tasks spanning research, analysis, writing, and review."
      >
        <CrewAIDiagram progress={crewProg} />
      </SectionShell>

      <SectionShell
        ref={autoRef as any}
        id="autogen"
          title="AutoGen: Multi-agent conversation + critique"
          subtitle="Two agents converse, a critic evaluates, and revisions lead to consensus."
          bullets={[
            'Conversational planning',
            'Critique loops',
            'Revision prompts',
            'Consensus convergence',
          ]}
          callout="Designing collaborative problem solving with iterative feedback."
      >
        <AutoGenDiagram progress={autoProg} />
      </SectionShell>

      <SectionShell
        ref={swarmRef as any}
        id="swarm"
          title="OpenAI Swarm: Router + ownership handoffs"
          subtitle="A central router dispatches tasks to specialists; ownership transfers as needed until resolved."
          bullets={[
            'Routing policies',
            'Specialist selection',
            'Ownership tracking',
            'Resolution events',
          ]}
          callout="Routing complex requests to the right experts, then coordinating results."
      >
        <SwarmDiagram progress={swarmProg} />
      </SectionShell>

      <SectionShell
        ref={reactRef as any}
        id="react"
          title="ReAct: Think/Act/Observe loop"
          subtitle="Alternate between reasoning, acting on tools, and observing results to refine thoughts."
          bullets={[
            'Explicit reasoning steps',
            'Tool invocation',
            'Observation integration',
            'One full loop to completion',
          ]}
          callout="Tool-augmented reasoning that remains interpretable."
      >
        <ReActDiagram progress={reactProg} />
      </SectionShell>

      <SectionShell
        ref={memRef as any}
        id="memgpt"
          title="MemGPT: Short-term vs long-term memory paging"
          subtitle="Actively page memories between a small working set and a larger archive to stay relevant and grounded."
          bullets={[
            'STM writes & evictions',
            'Pager policies',
            'LTM recall',
            'Fresh context assembly',
          ]}
          callout="Assistants that remember what matters without getting lost."
      >
        <MemGPTDiagram progress={memProg} />
      </SectionShell>

      <PatternLibrary />

      <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10 text-sm text-white/60">
        Built for clarity. Accessible, responsive, and motion-aware.
      </footer>
    </main>
  );
}
