import { useState } from 'react'
import type { CSSProperties } from 'react'
import { HoloCard } from 'react-holo-card'
import type { HoloCardProps } from 'react-holo-card'

/** Stagger index for the shared rise-in animation. */
const at = (i: number) => ({ '--i': i }) as CSSProperties

const INSTALL = 'npm install react-holo-card'
const GITHUB = 'https://github.com/codeweb-dev/holo-card'
const NPM = 'https://www.npmjs.com/package/react-holo-card'
const VERSION = '0.2.0'

/** The four stops of the component's own foil gradient, one per card art. */
const ART = [
  { id: 'aurora', color: '#ff00aa', alt: 'Aurora — layered nebula card art' },
  { id: 'prism', color: '#fff000', alt: 'Prism — refracted spectrum card art' },
  { id: 'orbit', color: '#00ffc8', alt: 'Orbit — concentric ring card art' },
  { id: 'bloom', color: '#505aff', alt: 'Bloom — concentric bloom card art' },
]

const RADII = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const

const LAYERS = [
  ['--rx --ry', 'Tilt', 'Pointer position becomes a rotateX / rotateY, clamped to maxTilt.'],
  ['--mx --my', 'Glare', 'A specular hotspot under the cursor, plus a sheen band sweeping back.'],
  ['--distance', 'Foil', 'A diagonal rainbow in color-dodge, strengthening toward the edge.'],
  ['0 deps', 'Quiet', 'Values are written to the DOM in rAF. React never re-renders on move.'],
]

const API: [prop: string, type: string, def: string, desc: string][] = [
  ['url', 'string', '—', 'Image URL rendered inside the card'],
  ['width', 'number', '320', 'Card width in px'],
  ['height', 'number', '446', 'Card height in px'],
  ['radius', 'preset | number', '"md"', 'none · sm · md · lg · xl · full, or raw px'],
  ['showSparkles', 'boolean', 'true', 'Rainbow foil sparkle layer'],
  ['maxTilt', 'number', '14', 'Max tilt rotation in degrees at the edge'],
  ['alt', 'string', '""', 'Alt text for the image'],
  ['className', 'string', '—', 'Extra class on the root element'],
  ['style', 'object', '—', 'Extra inline styles on the root element'],
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className={copied ? 'copy copied' : 'copy'}
      aria-label="Copy install command"
      onClick={() =>
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        }, () => {})
      }
    >
      <span aria-hidden="true">{copied ? 'copied' : 'copy'}</span>
      <span className="sr-only" role="status">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  )
}

export default function App() {
  const [art, setArt] = useState(ART[0])
  const [radius, setRadius] = useState<HoloCardProps['radius']>('md')
  const [sparkles, setSparkles] = useState(true)
  const [tilt, setTilt] = useState(14)

  const snippet = [
    '<HoloCard',
    `  url="/cards/${art.id}.svg"`,
    '  width={280} height={390}',
    radius !== 'md' && `  radius="${radius}"`,
    !sparkles && '  showSparkles={false}',
    tilt !== 14 && `  maxTilt={${tilt}}`,
    '/>',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <main>
      <header style={at(0)}>
        <h1>
          <span className="dot" style={{ background: art.color }} aria-hidden="true" />
          holocard
        </h1>
        <div className="header-right">
          <span className="meta">v{VERSION} · 0 deps</span>
          <a className="gh" href={GITHUB}>
            GitHub
          </a>
        </div>
      </header>

      <p className="tagline" style={at(1)}>
        A card that tilts, catches the light, and throws rainbow foil — everywhere your pointer
        goes. <strong>Every control below drives the real component.</strong>
      </p>

      <section style={at(2)}>
        <div className="stage">
          <HoloCard
            url={`/cards/${art.id}.svg`}
            alt={art.alt}
            width={280}
            height={390}
            radius={radius}
            showSparkles={sparkles}
            maxTilt={tilt}
          />
        </div>
        <p className="hint">Move your pointer across the card. That's the whole API.</p>
      </section>

      <section style={at(3)}>
        <h2>
          Props <small>live</small>
        </h2>

        <div className="row">
          <span className="row-label">
            url
            <span className="row-hint">card art</span>
          </span>
          <div className="chips">
            {ART.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === art.id ? 'chip on' : 'chip'}
                aria-pressed={item.id === art.id}
                onClick={() => setArt(item)}
              >
                <i style={{ background: item.color }} />
                {item.id}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          <span className="row-label">
            radius
            <span className="row-hint">new in 0.2</span>
          </span>
          <div className="chips">
            {RADII.map((r) => (
              <button
                key={r}
                type="button"
                className={r === radius ? 'chip on' : 'chip'}
                aria-pressed={r === radius}
                onClick={() => setRadius(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          <span className="row-label">
            showSparkles
            <span className="row-hint">rainbow foil</span>
          </span>
          <button
            type="button"
            role="switch"
            className="switch"
            aria-checked={sparkles}
            aria-label="Toggle rainbow foil"
            onClick={() => setSparkles((on) => !on)}
          >
            <span className="knob" />
          </button>
        </div>

        <div className="row">
          <span className="row-label">
            maxTilt
            <span className="row-hint">degrees at the edge</span>
          </span>
          <div className="range">
            <input
              type="range"
              min={0}
              max={30}
              value={tilt}
              aria-label="Max tilt in degrees"
              onChange={(e) => setTilt(Number(e.target.value))}
            />
            <output>{tilt}°</output>
          </div>
        </div>

        <pre className="code">{snippet}</pre>
      </section>

      <section style={at(4)}>
        <h2>
          How it works <small>three layers, zero re-renders</small>
        </h2>
        <div className="features">
          {LAYERS.map(([vars, title, body]) => (
            <article className="feature" key={title}>
              <code className="f-vars">{vars}</code>
              <span className="f-title">{title}</span>
              <span className="f-desc">{body}</span>
            </article>
          ))}
        </div>
      </section>

      <section style={at(5)}>
        <h2>
          Install <small>peer dependency: react ≥ 17</small>
        </h2>
        <div className="command">
          <span className="prompt">$</span>
          <code>{INSTALL}</code>
          <CopyButton text={INSTALL} />
        </div>
      </section>

      <section style={at(6)}>
        <h2>
          Reference <small>nine props, none required but one</small>
        </h2>
        <div className="table-wrap">
          <table className="api">
            <tbody>
              {API.map(([prop, type, def, desc]) => (
                <tr key={prop}>
                  <td className="api__prop">
                    {prop}
                    {prop === 'url' && <span className="req">req</span>}
                  </td>
                  <td className="api__type">{type}</td>
                  <td className="api__default">{def}</td>
                  <td className="api__desc">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer style={at(7)}>
        <span>MIT © Allen Labrague</span>
        <span>
          <a href={NPM}>npm</a> · <a href={GITHUB}>source</a>
        </span>
      </footer>
    </main>
  )
}
