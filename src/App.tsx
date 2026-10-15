import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Atom, Award, BookOpen, Check, ChevronDown,
  CircleHelp, Code2, Compass, Crown, Flame, FlaskConical, Gamepad2,
  GraduationCap, Lightbulb, LockKeyhole, Menu, Play, RotateCcw, Sparkles,
  Terminal, Trophy, X, Zap
} from 'lucide-react'

type Mission = {
  id: number; title: string; subtitle: string; icon: string; color: string;
  operation: string; a: number; b: number; algorithm: string[]; concept: string;
  story: string; challenge: string; starterCode: string
}

const missions: Mission[] = [
  { id: 1, title: 'The Addition Heist', subtitle: 'Count the hidden treasure', icon: '🪙', color: 'coral', operation: '+', a: 5, b: 3,
    story: 'Two treasure chests have been found! One holds 5 gold coins and the other holds 3. How many coins are there altogether?',
    challenge: 'Write a program that adds two numbers and prints the total.',
    algorithm: ['Start the program', 'Store the first number', 'Store the second number', 'Add the two numbers', 'Display the answer'],
    concept: 'Variables & arithmetic', starterCode: 'a = 5\nb = 3\n\ntotal = a + b\nprint(total)' },
  { id: 2, title: 'The Subtraction Escape', subtitle: 'Find what is left', icon: '🗝️', color: 'purple', operation: '-', a: 12, b: 4,
    story: 'A vault has 12 keys. The team uses 4 keys to open the doors. How many keys remain?',
    challenge: 'Write a program that subtracts the second number from the first.',
    algorithm: ['Start the program', 'Store the starting amount', 'Store the amount used', 'Subtract the amount used', 'Display what remains'],
    concept: 'Variables & subtraction', starterCode: 'starting_keys = 12\nused_keys = 4\n\nremaining = starting_keys - used_keys\nprint(remaining)' },
  { id: 3, title: 'The Multiplication Machine', subtitle: 'Build equal groups', icon: '🤖', color: 'blue', operation: '*', a: 4, b: 3,
    story: 'A robot packs 4 batteries into each box. It fills 3 boxes. How many batteries did it pack in total?',
    challenge: 'Write a program that multiplies the number in each group by the number of groups.',
    algorithm: ['Start the program', 'Store the items in one group', 'Store the number of groups', 'Multiply the two numbers', 'Display the total'],
    concept: 'Expressions & multiplication', starterCode: 'batteries_per_box = 4\nnumber_of_boxes = 3\n\ntotal = batteries_per_box * number_of_boxes\nprint(total)' },
  { id: 4, title: 'The Division Code', subtitle: 'Share fairly', icon: '🧩', color: 'green', operation: '/', a: 12, b: 3,
    story: 'Agent Nova finds 12 gems and shares them equally among 3 teammates. How many gems does each teammate get?',
    challenge: 'Write a program that divides the total gems by the number of teammates.',
    algorithm: ['Start the program', 'Store the total number of gems', 'Store the number of teammates', 'Divide gems equally', 'Display gems per teammate'],
    concept: 'Division & numeric results', starterCode: 'gems = 12\nteammates = 3\n\nper_agent = gems / teammates\nprint(per_agent)' },
  { id: 5, title: 'The Number Showdown', subtitle: 'Find the bigger number', icon: '⚖️', color: 'yellow', operation: '>', a: 8, b: 5,
    story: 'Two secret numbers are on the screen. Your mission is to discover which number is greater.',
    challenge: 'Use an if/else statement to print which number is greater.',
    algorithm: ['Start the program', 'Store both numbers', 'Compare the numbers', 'If the first is greater, say so', 'Otherwise, report the other result'],
    concept: 'Conditions & comparisons', starterCode: 'a = 8\nb = 5\n\nif a > b:\n    print("A is bigger")\nelse:\n    print("B is bigger or equal")' },
]

const lessons = [
  { icon: '🧠', title: 'What is an algorithm?', text: 'A clear set of steps that helps solve a problem.', example: 'A recipe is an algorithm: follow the steps in the right order to make something delicious.', color: 'purple' },
  { icon: '💻', title: 'What is code?', text: 'Instructions written in a language a computer can follow.', example: 'print("Hello, Agent!") asks Python to show a message on the screen.', color: 'blue' },
  { icon: '📥', title: 'Input → Process → Output', text: 'Computers take information, do something with it, and show a result.', example: 'Input: 5 and 3  →  Process: add  →  Output: 8', color: 'green' },
]

type Screen = 'home' | 'learn' | 'missions' | 'mission' | 'achievements'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeLesson, setActiveLesson] = useState(0)
  const [missionId, setMissionId] = useState(1)
  const [phase, setPhase] = useState(0)
  const [steps, setSteps] = useState<string[]>([])
  const [code, setCode] = useState(missions[0].starterCode)
  const [output, setOutput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [completed, setCompleted] = useState<number[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [testNumber, setTestNumber] = useState(0)
  const [ageMode, setAgeMode] = useState<'junior' | 'senior'>('junior')

  const mission = missions.find(m => m.id === missionId) || missions[0]
  const progress = Math.round((completed.length / missions.length) * 100)
  const shuffledSteps = useMemo(() => [...mission.algorithm].sort((a, b) => a.localeCompare(b)), [missionId, phase])

  useEffect(() => {
    const openRewards = () => go('achievements')
    window.addEventListener('cryptic-open-rewards', openRewards)
    return () => window.removeEventListener('cryptic-open-rewards', openRewards)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('cryptic-coder-completed')
    if (saved) setCompleted(JSON.parse(saved) as number[])
  }, [])

  function go(next: Screen) { setScreen(next); setShowMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function startMission(id: number) {
    const selected = missions.find(m => m.id === id) || missions[0]
    setMissionId(id); setPhase(0); setSteps([]); setCode(selected.starterCode)
    setOutput(''); setFeedback(''); setShowHint(false); setTestNumber(0); go('mission')
  }
  function finishMission() {
    const next = Array.from(new Set([...completed, missionId]))
    setCompleted(next); localStorage.setItem('cryptic-coder-completed', JSON.stringify(next))
    setFeedback('Mission complete! You cracked the code and earned 100 XP.')
  }
  function runCode() {
    // Guided MVP runner: runs the starter arithmetic/condition exercises safely in the browser.
    // Arbitrary Python execution will be added in the next build phase.
    const normalized = code.replace(/\s+/g, ' ')
    let result = ''
    const numberAssignments = [...code.matchAll(/^\s*([a-zA-Z_]\w*)\s*=\s*(-?\d+(?:\.\d+)?)\s*$/gm)]
    const vars: Record<string, number> = {}
    numberAssignments.forEach(m => { vars[m[1]] = Number(m[2]) })
    if (missionId === 5) {
      const conditionMatch = code.match(/if\s+([a-zA-Z_]\w*)\s*>\s*([a-zA-Z_]\w*)\s*:/)
      if (conditionMatch && vars[conditionMatch[1]] !== undefined && vars[conditionMatch[2]] !== undefined) {
        result = vars[conditionMatch[1]] > vars[conditionMatch[2]] ? 'A is bigger' : 'B is bigger or equal'
        if (code.includes('print("A is bigger")') && code.includes('print("B is bigger or equal")')) {
          setOutput(result); setFeedback('Your comparison ran successfully. Try changing the numbers!'); return
        }
      }
      setOutput(''); setFeedback('Check your if/else structure and make sure both messages are printed.'); return
    }
    const assignment = code.match(/^\s*([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*)\s*([+\-*/])\s*([a-zA-Z_]\w*)\s*$/m)
    if (assignment) {
      const [, target, left, op, right] = assignment
      if (vars[left] !== undefined && vars[right] !== undefined) {
        const value = op === '+' ? vars[left] + vars[right] : op === '-' ? vars[left] - vars[right] : op === '*' ? vars[left] * vars[right] : vars[left] / vars[right]
        if (/print\s*\(\s*[a-zA-Z_]\w*\s*\)/.test(code) && code.includes(`print(${target})`)) result = String(Number.isInteger(value) ? value : Number(value.toFixed(4)))
      }
    }
    if (result !== '') {
      setOutput(result)
      setFeedback('Nice work! Your program ran. Now change the numbers and test it again.')
    } else {
      setOutput('')
      setFeedback('Not quite yet. Check your variable names, operator, and print() line. Need a clue? Open Hint.')
    }
  }
  function resetCode() { setCode(mission.starterCode); setOutput(''); setFeedback('Code reset. Ready for another try?') }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="Cryptic Coder home">
          <span className="brand-mark"><Code2 size={22}/></span>
          <span className="brand-name">cryptic<span>coder</span><small>THINK. DECODE. CREATE.</small></span>
        </button>
        <nav className={showMenu ? 'nav-links open' : 'nav-links'}>
          <button className={screen === 'learn' ? 'nav-link active' : 'nav-link'} onClick={() => go('learn')}>📘 Start Here</button>
          <button className={screen === 'missions' || screen === 'mission' ? 'nav-link active' : 'nav-link'} onClick={() => go('missions')}>🗺️ Adventure Map</button>
          <button className={screen === 'achievements' ? 'nav-link active' : 'nav-link'} onClick={() => go('achievements')}>🏆 My Rewards</button>
        </nav>
        <div className="top-actions">
          <div className="streak"><Flame size={17} fill="currentColor"/> <span>{completed.length ? completed.length : 0} day streak</span></div>
          <button className="avatar" title="Agent profile">🕵️</button>
          <button className="mobile-menu" onClick={() => setShowMenu(!showMenu)} aria-label="Toggle menu">{showMenu ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        {screen === 'home' && <Home progress={progress} completed={completed.length} onStart={() => go('learn')} onMissions={() => go('missions')} />}
        {screen === 'learn' && <section className="page-wrap guided-page">
          <div className="journey-banner"><span className="journey-number">1</span><div><strong>First stop: Detective Training!</strong><p>Read a tiny lesson, try the idea, then choose your first mystery.</p></div><span className="journey-mascot">🦊</span></div>
          <div className="eyebrow"><BookOpen size={16}/> YOUR FIRST FIELD GUIDE</div>
          <h1 className="page-title">Before you crack the code… <span>learn the clues.</span></h1>
          <p className="page-subtitle">Every great coder starts by learning how to think. Three tiny lessons. One big brain boost.</p>
          <div className="lesson-layout">
            <div className="lesson-list">
              {lessons.map((l, i) => <button key={l.title} className={`lesson-tab ${activeLesson === i ? 'selected' : ''}`} onClick={() => setActiveLesson(i)}>
                <span className="lesson-emoji">{l.icon}</span><span><strong>{l.title}</strong><small>LESSON 0{i + 1}</small></span><ArrowRight size={17}/>
              </button>)}
              <div className="mini-note"><Lightbulb size={18}/><span>Agent tip: You don't need to know everything. Curiosity is your superpower.</span></div>
            </div>
            <div className={`lesson-card ${lessons[activeLesson].color}`}>
              <div className="lesson-card-top"><span className="pill">LESSON 0{activeLesson + 1} / 03</span><span className="big-lesson-emoji">{lessons[activeLesson].icon}</span></div>
              <h2>{lessons[activeLesson].title}</h2><p>{lessons[activeLesson].text}</p>
              <div className="example-box"><span>🧪 TRY TO UNDERSTAND</span><p>{lessons[activeLesson].example}</p></div>
              <div className="lesson-footer"><span><Check size={16}/> Bite-sized lesson</span><button className="button button-primary" onClick={() => activeLesson < 2 ? setActiveLesson(activeLesson + 1) : go('missions')}>{activeLesson < 2 ? 'Next lesson' : 'Choose a mission'} <ArrowRight size={16}/></button></div>
            </div>
          </div>
          <div className="concept-strip"><div><span className="concept-icon">📥</span><strong>INPUT</strong><small>Information goes in</small></div><ArrowRight/><div><span className="concept-icon">⚙️</span><strong>PROCESS</strong><small>Computer follows steps</small></div><ArrowRight/><div><span className="concept-icon">✨</span><strong>OUTPUT</strong><small>Result comes out</small></div></div>
        </section>}
        {screen === 'missions' && <section className="page-wrap guided-page">
          <div className="journey-banner map-banner"><span className="journey-number">2</span><div><strong>Choose your next adventure!</strong><p>Pick any case. Byte will explain the mystery, help you plan, and guide you as you code.</p></div><span className="journey-mascot">🗺️</span></div>
          <div className="eyebrow"><Compass size={16}/> MISSION CONTROL</div>
          <h1 className="page-title">Pick your <span>first mystery.</span></h1>
          <p className="page-subtitle">Choose a mission, think through the steps, then bring your solution to life with code.</p>
          <div className="mission-grid">{missions.map(m => <button className={`mission-card ${m.color}`} key={m.id} onClick={() => startMission(m.id)}>
            <div className="mission-card-top"><span className="mission-icon">{m.icon}</span><span className="difficulty">{m.id < 3 ? 'LEVEL 01' : m.id < 5 ? 'LEVEL 02' : 'LEVEL 03'}</span>{completed.includes(m.id) && <span className="done-mark"><Check size={14}/></span>}</div>
            <h3>{m.title}</h3><p>{m.subtitle}</p><div className="mission-card-bottom"><span><Zap size={15}/> {m.id === 5 ? 'Conditions' : 'Logic + math'}</span><span className="circle-arrow"><ArrowRight size={17}/></span></div>
          </button>)}</div>
          <div className="bottom-callout"><div className="callout-icon"><Sparkles/></div><div><strong>There is no rush, Agent.</strong><p>Try things, make mistakes, and try again. That's how real coders learn.</p></div><span className="callout-doodle">✳</span></div>
        </section>}
        {screen === 'mission' && <section className="page-wrap mission-workspace">
          <button className="back-link" onClick={() => go('missions')}><ArrowLeft size={16}/> Back to missions</button>
          <div className="workspace-heading"><div><div className="eyebrow"><span className="live-dot"/> MISSION {String(mission.id).padStart(2, '0')} / 05</div><h1 className="page-title">{mission.title}</h1><p className="page-subtitle">{mission.subtitle}. <strong>Concept: {mission.concept}.</strong></p></div><div className="workspace-badge">{mission.icon}</div></div>
          <div className="phase-track">{['The mystery', 'Build an algorithm', 'Write the code', 'Test it'].map((p, i) => <button key={p} className={`phase-step ${phase === i ? 'current' : phase > i ? 'passed' : ''}`} onClick={() => i <= phase ? setPhase(i) : setFeedback('Complete the current step first to unlock this stage.')}><span>{phase > i ? <Check size={14}/> : i + 1}</span>{p}</button>)}</div>
          {phase === 0 && <div className="mission-columns">
            <article className="story-card"><span className="card-kicker">📡 INCOMING TRANSMISSION</span><h2>Agent, we need your help!</h2><p>{mission.story}</p><div className="number-puzzle"><div className="number-tile"><span>{mission.id === 1 ? 'CHEST A' : mission.id === 2 ? 'START' : mission.id === 3 ? 'PER BOX' : mission.id === 4 ? 'GEMS' : 'NUMBER A'}</span><strong>{mission.a}</strong></div><div className="math-symbol">{mission.operation}</div><div className="number-tile"><span>{mission.id === 1 ? 'CHEST B' : mission.id === 2 ? 'USED' : mission.id === 3 ? 'BOXES' : mission.id === 4 ? 'AGENTS' : 'NUMBER B'}</span><strong>{mission.b}</strong></div><div className="question-tile">?</div></div><div className="challenge-box"><CircleHelp size={19}/><div><strong>YOUR CHALLENGE</strong><p>{mission.challenge}</p></div></div><button className="button button-primary button-wide" onClick={() => setPhase(1)}>I understand the mystery <ArrowRight size={17}/></button></article>
            <aside className="agent-tip-card"><div className="agent-face">🦊</div><span className="pill">YOUR CODING SIDEKICK</span><h3>Meet Byte!</h3><p>“Good coders don't guess. They break a big problem into little steps. Let's figure it out together!”</p><div className="tip-decoration">✦ &nbsp; ✧ &nbsp; ✦</div></aside>
          </div>}
          {phase === 1 && <div className="algorithm-panel">
            <div className="panel-intro"><div className="panel-icon purple-bg"><FlaskConical/></div><div><h2>Put the clues in order</h2><p>An algorithm is a set of steps in the right order. Arrange the steps below, from start to finish.</p></div></div>
            <div className="algorithm-builder"><div className="step-bank"><span className="column-label">CLUE CARDS</span>{shuffledSteps.filter(s => !steps.includes(s)).map((s, i) => <div className="step-card draggable" key={s}><span className="grip">⠿</span>{s}<button onClick={() => setSteps([...steps, s])} aria-label={`Add ${s}`}><ArrowRight size={16}/></button></div>)}</div><div className="step-bank chosen-bank"><span className="column-label">YOUR ALGORITHM <small>{steps.length}/{mission.algorithm.length} steps</small></span>{steps.map((s, i) => <div className="step-card chosen" key={s}><span className="step-number">{i + 1}</span>{s}<div className="step-controls"><button disabled={i === 0} onClick={() => {const a=[...steps];[a[i-1],a[i]]=[a[i],a[i-1]];setSteps(a)}}>↑</button><button disabled={i === steps.length-1} onClick={() => {const a=[...steps];[a[i+1],a[i]]=[a[i],a[i+1]];setSteps(a)}}>↓</button><button onClick={() => setSteps(steps.filter(x => x !== s))}><X size={13}/></button></div></div>)}{steps.length === 0 && <div className="empty-steps">Add clue cards here to build your plan.</div>}</div></div>
            {feedback && <p className="feedback">{feedback}</p>}<div className="panel-actions"><button className="button button-ghost" onClick={() => {setSteps([]);setFeedback('')}}><RotateCcw size={15}/> Start over</button><button className="button button-primary" onClick={() => {if (steps.join('|') === mission.algorithm.join('|')) {setFeedback('Perfect sequence! You are thinking like a programmer.'); setTimeout(() => {setPhase(2);setFeedback('')}, 650)} else setFeedback(steps.length !== mission.algorithm.length ? 'Add all the clue cards first.' : 'Almost! Think about what the computer needs to know before it can calculate.') }}>Check my algorithm <ArrowRight size={16}/></button></div>
          </div>}
          {phase === 2 && <div className="coding-panel">
            <div className="panel-intro"><div className="panel-icon blue-bg"><Code2/></div><div><h2>Time to write some code!</h2><p>Python is a language that lets us give instructions to a computer. Try changing the code, then run it.</p></div></div>
            <div className="code-explainer"><div className="code-example"><span className="column-label">YOUR CODE EDITOR <span className="python-tag">PYTHON</span></span><div className="editor-window"><div className="editor-toolbar"><div><i/><i/><i/></div><span>mission_{mission.id}.py</span><button onClick={resetCode}><RotateCcw size={14}/> Reset</button></div><div className="editor-body"><div className="line-numbers">{code.split('\n').map((_, i) => <span key={i}>{i+1}</span>)}</div><textarea aria-label="Python code editor" spellCheck={false} value={code} onChange={e => {setCode(e.target.value);setOutput('');setFeedback('')}} /></div></div><div className="editor-actions"><button className="button button-primary" onClick={runCode}><Play size={16} fill="currentColor"/> Run code</button><button className="button button-ghost" onClick={() => setShowHint(!showHint)}><Lightbulb size={16}/> {showHint ? 'Hide hint' : 'Need a hint?'}</button></div>{showHint && <div className="hint-box"><Lightbulb size={17}/><span>Look at the operator: <code>{mission.operation}</code>. Make sure the variable names match and your final line uses <code>print()</code>.</span></div>}</div>
              <div className="code-side"><div className="output-card"><div className="output-heading"><Terminal size={16}/> OUTPUT <span className="output-status">{output ? 'SUCCESS' : 'READY'}</span></div><div className="output-screen">{output ? <><span className="output-prompt">&gt;</span> {output}</> : <span className="muted-output">Your result will appear here…</span>}</div>{feedback && <p className={`run-feedback ${output ? 'success' : ''}`}>{feedback}</p>}</div><div className="code-tip"><span>💡</span><div><strong>Coder clue</strong><p>Computers follow instructions exactly. Even a tiny typo can change what happens!</p></div></div><div className="variable-visual"><span className="column-label">THINK OF VARIABLES AS BOXES</span><div><code>{mission.id === 2 ? 'starting_keys' : mission.id === 3 ? 'batteries_per_box' : mission.id === 4 ? 'gems' : 'a'}</code><strong>{mission.a}</strong></div><div><code>{mission.id === 2 ? 'used_keys' : mission.id === 3 ? 'number_of_boxes' : mission.id === 4 ? 'teammates' : 'b'}</code><strong>{mission.b}</strong></div></div></div>
            </div>
            <div className="panel-actions"><button className="button button-ghost" onClick={() => setPhase(1)}><ArrowLeft size={15}/> Back to algorithm</button><button className="button button-primary" onClick={() => {setPhase(3);setOutput('');setFeedback('')}}>Go to testing <ArrowRight size={16}/></button></div>
          </div>}
          {phase === 3 && <div className="test-panel">
            <div className="panel-intro"><div className="panel-icon green-bg"><Check/></div><div><h2>Test your solution</h2><p>A good program works for more than one example. Change the numbers and see what happens.</p></div></div>
            <div className="test-card"><div className="test-top"><span className="pill">TEST CASE {testNumber + 1} OF 3</span><span className="test-status">{testNumber === 0 ? 'STARTER TEST' : 'EXTRA CHALLENGE'}</span></div><h3>{['Try the original numbers','Try a new pair','Try a zero'][testNumber]}</h3><div className="test-inputs"><label>First number<input type="number" value={testNumber === 0 ? mission.a : testNumber === 1 ? 10 : 0} readOnly /></label><span>{mission.operation}</span><label>Second number<input type="number" value={testNumber === 0 ? mission.b : testNumber === 1 ? 7 : 9} readOnly /></label></div><p className="test-explain">Use the values above in your code, run it, and check the result. Then mark the test as complete.</p><button className="button button-primary" onClick={() => {if(testNumber < 2) {setTestNumber(testNumber+1);setFeedback('')} else finishMission()}}>{testNumber < 2 ? 'Next test case' : 'Complete mission'} <ArrowRight size={16}/></button>{feedback && <div className="completion-message"><Trophy size={22}/><div><strong>MISSION COMPLETE!</strong><p>{feedback}</p><button className="button button-primary" onClick={() => go('missions')}>Back to Mission Control</button></div></div>}</div>
            <div className="test-checklist"><strong>Before you finish, check:</strong><span><Check size={15}/> The algorithm is in the right order</span><span><Check size={15}/> The code uses the correct operator</span><span><Check size={15}/> The output matches what you expected</span></div>
            <div className="panel-actions"><button className="button button-ghost" onClick={() => setPhase(2)}><ArrowLeft size={15}/> Back to code</button></div>
          </div>}
        </section>}
        {screen === 'achievements' && <section className="page-wrap">
          <div className="eyebrow"><Trophy size={16}/> AGENT RECORD</div><h1 className="page-title">Look how far <span>you've come!</span></h1><p className="page-subtitle">Every attempt counts. Every bug is a clue. Keep going, Agent.</p>
          <div className="progress-hero"><div className="progress-ring"><strong>{progress}%</strong><span>complete</span></div><div><h2>Your coding journey</h2><p>{completed.length === 0 ? 'Your first mission is waiting. Let’s crack the code!' : `You have completed ${completed.length} out of ${missions.length} missions.`}</p><div className="progress-bar"><span style={{width: `${progress}%`}}/></div><small>{completed.length} / {missions.length} missions completed</small></div></div>
          <h2 className="section-heading">Your badges</h2><div className="badge-grid"><div className={`badge-card ${completed.length ? 'earned' : ''}`}><span>🧠</span><strong>Brain Starter</strong><small>Complete your first mission</small>{completed.length ? <em>UNLOCKED</em> : <em>LOCKED</em>}</div><div className={`badge-card ${completed.length >= 3 ? 'earned' : ''}`}><span>🧩</span><strong>Clue Cracker</strong><small>Complete 3 missions</small><em>{completed.length >= 3 ? 'UNLOCKED' : 'LOCKED'}</em></div><div className={`badge-card ${completed.length === 5 ? 'earned' : ''}`}><span>🏆</span><strong>Cryptic Legend</strong><small>Complete all 5 missions</small><em>{completed.length === 5 ? 'UNLOCKED' : 'LOCKED'}</em></div></div>
          <h2 className="section-heading">Mission log</h2><div className="mission-log">{missions.map(m => <div key={m.id}><span>{m.icon}</span><strong>{m.title}</strong><small>{m.concept}</small><b className={completed.includes(m.id) ? 'log-done' : ''}>{completed.includes(m.id) ? 'COMPLETED' : 'NOT STARTED'}</b><button onClick={() => startMission(m.id)}>{completed.includes(m.id) ? 'Play again' : 'Start'} <ArrowRight size={14}/></button></div>)}</div>
        </section>}
      </main>
      <footer className="footer"><div className="footer-brand"><span className="brand-mark"><Code2 size={18}/></span><strong>cryptic<span>coder</span></strong></div><p>Made for curious minds and future problem-solvers.</p><span className="footer-note">A learning prototype · Ages 7–13</span></footer>
    </div>
  )
}

function Home({ progress, completed, onStart, onMissions }: { progress: number; completed: number; onStart: () => void; onMissions: () => void }) {
  return <div className="home-page kid-home">
    <section className="kid-welcome page-wrap">
      <div className="welcome-copy">
        <div className="welcome-ribbon">✨ THE SECRET CODING CLUB</div>
        <h1>Hey, Junior Detective!<br/><span>Ready to crack a code?</span></h1>
        <p>Meet Byte, your coding buddy. Together, you'll solve little mysteries, learn how computers think, and make your first programs.</p>
        <div className="welcome-actions">
          <button className="button button-primary button-large" onClick={onStart}>🚀 Let's learn first <ArrowRight size={19}/></button>
          <button className="button button-playful button-large" onClick={onMissions}>🗺️ Show me the missions</button>
        </div>
        <div className="tiny-reassurance"><span>💡</span><strong>New to coding?</strong> Perfect! We'll show you what to do at every step.
        </div>
      </div>
      <div className="buddy-scene" aria-label="Byte the coding buddy">
        <div className="scene-cloud cloud-a">✦</div><div className="scene-cloud cloud-b">☁️</div>
        <div className="buddy-speech"><strong>Hi, I'm Byte!</strong><br/>I'll be your guide. Let's solve a mystery! 👋</div>
        <div className="buddy-character"><div className="buddy-ear ear-left"/><div className="buddy-ear ear-right"/><div className="buddy-head"><i className="buddy-eye eye-left"/><i className="buddy-eye eye-right"/><div className="buddy-mouth"/><div className="buddy-cheek cheek-left"/><div className="buddy-cheek cheek-right"/></div><div className="buddy-torso"><span>&lt;/&gt;</span></div><div className="buddy-arm arm-left"/><div className="buddy-arm arm-right"/></div>
        <div className="scene-star star-one">⭐</div><div className="scene-star star-two">✨</div>
        <div className="xp-bubble">🌟 {completed * 100} XP</div>
      </div>
    </section>

    <section className="page-wrap home-progress-card">
      <div className="progress-character">🧭</div><div className="home-progress-copy"><strong>Your coding adventure</strong><p>{completed === 0 ? 'Your journey starts here. Complete your first case to earn a badge!' : `Amazing! You've cracked ${completed} of 5 mysteries. Keep going!`}</p><div className="kid-progress-track"><span style={{width: `${progress}%`}}/></div><small>{completed} of 5 mysteries solved</small></div><div className="progress-percent">{progress}%<small>explored</small></div>
    </section>

    <section className="page-wrap choose-path-section">
      <div className="kid-section-heading"><span>🎯</span><div><h2>What would you like to do?</h2><p>Pick a path. You can always come back!</p></div></div>
      <div className="path-cards">
        <button className="path-card path-learn" onClick={onStart}><span className="path-emoji">🧠</span><span className="path-step">STEP 1 · START HERE</span><strong>Learn the basics</strong><small>Discover how computers follow instructions.</small><span className="path-action">Let's learn <ArrowRight size={16}/></span></button>
        <button className="path-card path-missions" onClick={onMissions}><span className="path-emoji">🔎</span><span className="path-step">STEP 2 · PLAY & SOLVE</span><strong>Solve a mystery</strong><small>Choose from 5 fun number and logic challenges.</small><span className="path-action">Pick a mission <ArrowRight size={16}/></span></button>
        <button className="path-card path-rewards" onClick={() => window.dispatchEvent(new CustomEvent('cryptic-open-rewards'))}><span className="path-emoji">🏆</span><span className="path-step">YOUR COLLECTION</span><strong>My rewards</strong><small>Earn stars and badges as you learn.</small><span className="path-action">See rewards <ArrowRight size={16}/></span></button>
      </div>
    </section>

    <section className="page-wrap how-kids-work">
      <div className="kid-section-heading"><span>🪄</span><div><h2>Every mystery has 4 easy steps</h2><p>We'll guide you all the way. No guessing what to do next.</p></div></div>
      <div className="kid-steps"><div className="kid-step"><span className="kid-step-icon">🕵️</span><b>1. Discover</b><p>Listen to the story and find the clue.</p></div><span className="kid-step-arrow">➜</span><div className="kid-step"><span className="kid-step-icon">🧩</span><b>2. Plan</b><p>Put the instructions in order.</p></div><span className="kid-step-arrow">➜</span><div className="kid-step"><span className="kid-step-icon">💻</span><b>3. Code</b><p>Tell the computer what to do.</p></div><span className="kid-step-arrow">➜</span><div className="kid-step"><span className="kid-step-icon">🎉</span><b>4. Test & celebrate</b><p>Try it, learn, and earn a reward.</p></div></div>
      <div className="kindness-note"><span>💛</span><div><strong>Remember, detectives: mistakes are clues!</strong><p>If something doesn't work, Byte will help you try again. That's how every coder learns.</p></div></div>
    </section>
  </div>
}

export default App;