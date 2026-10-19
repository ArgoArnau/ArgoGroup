/**
 * The illustrative interface in "What we build": a CRM pipeline inside
 * "Your company", the departments down the side with Sales open. Sample
 * deals with no client names (a grey bar stands for each name) and no
 * figures anywhere, as the brief asks (copy.js, work.mock). The animation (systems.css, "Mock") starts when the figure
 * scrolls into view: the deals arrive column by column, one deal is live,
 * the activity feed moves through its entries and a light sweeps the board.
 * The loops pause while it is off screen (usePauseOffscreen.js); phones get
 * the arrival only, without the loops.
 * Decorative, so hidden from assistive technology.
 */
export default function PlatformMock({ mock }) {
  const { company, menu, active, search, view, tabs, columns, deals, feed } = mock
  return (
    <figure className="mock" data-reveal="" data-loop="" aria-hidden="true">
      <div className="mock-bar">
        <span className="mock-dots"><i /><i /><i /></span>
        <span className="mock-company">{company}</span>
        <span className="mock-search">{search}</span>
        <span className="mock-user" />
      </div>
      <div className="mock-body">
        <ul className="mock-nav">
          {menu.map((item) => (
            <li key={item} data-active={item === active ? 'true' : undefined}>{item}</li>
          ))}
        </ul>
        <div className="mock-main">
          <div className="mock-head">
            <span className="mock-view">{view}</span>
            <span className="mock-tabs">
              {tabs.map((tab, index) => <span key={tab} data-active={index === 0 ? 'true' : undefined}>{tab}</span>)}
            </span>
          </div>
          <div className="mock-board">
            {columns.map((column, col) => (
              <div key={column} className="mock-col" data-col={col}>
                <p className="mock-col-h"><i />{column}</p>
                {deals.filter((deal) => deal.col === col).map((deal) => (
                  <div key={deal.order} className="mock-deal" data-live={deal.live ? 'true' : undefined} style={{ '--i': deal.order, '--bar': deal.bar }}>
                    <i className="mock-deal-name" />
                    <i className="mock-deal-sub" />
                    <span className="mock-deal-foot">
                      <span className="mock-tag">{deal.tag}</span>
                      <i className="mock-avatar" />
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <ul className="mock-feed">
            {feed.map((entry, index) => (
              <li key={entry} style={{ '--i': index }}><i />{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  )
}
