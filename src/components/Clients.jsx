import { useLang } from '../context/LangContext'

// The track holds six copies of the list: the CSS animation translates by
// exactly half its width, so the loop has to be seamless across the midpoint.
const LOOPS = 6

export default function Clients() {
  const { t } = useLang()
  const names = t.clients.names

  // No strip until there are real client names to put in it. Filling
  // clients.names in src/i18n.js is all it takes to bring the section back.
  if (!names || names.length === 0) return null

  return (
    <section className="clients" aria-label={t.clients.title}>
      <p className="clients-label">{t.clients.title}</p>
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: LOOPS }).flatMap((_, loop) =>
            names.map((name) => (
              <span className="marquee-item" key={`${loop}-${name}`}>
                <span>{name}</span>
                <span className="sep" aria-hidden="true">✦</span>
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
