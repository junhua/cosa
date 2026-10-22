import { FormEvent, ReactNode, useEffect, useState } from "react"

type IconName = "arrow" | "check" | "help" | "lock" | "package" | "pin" | "shield" | "unlock"

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.6 1.9c-.9.6-1.4 1.1-1.4 2.1" />
        <path d="M12 17h.01" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    package: (
      <>
        <path d="m4 7 8-4 8 4v10l-8 4-8-4Z" />
        <path d="m4 7 8 4 8-4M12 11v10M8 5l8 4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    unlock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 7.5-2" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {paths[name]}
      </g>
    </svg>
  )
}

function LockerQr() {
  const size = 29

  function finderCell(row: number, column: number, top: number, left: number) {
    const y = row - top
    const x = column - left
    if (x < 0 || x > 6 || y < 0 || y > 6) return false
    return (
      x === 0 ||
      x === 6 ||
      y === 0 ||
      y === 6 ||
      (x >= 2 && x <= 4 && y >= 2 && y <= 4)
    )
  }

  const cells = []
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const finder =
        finderCell(row, column, 0, 0) ||
        finderCell(row, column, 0, size - 7) ||
        finderCell(row, column, size - 7, 0)
      const reserved =
        (row < 8 && column < 8) ||
        (row < 8 && column > size - 9) ||
        (row > size - 9 && column < 8)
      const data =
        !reserved &&
        ((row * 7 + column * 11 + row * column) % 5 < 2 ||
          (row + column * 3) % 11 === 0)

      if (finder || data) {
        cells.push(
          <rect
            height="1"
            key={`${row}-${column}`}
            width="1"
            x={column}
            y={row}
          />,
        )
      }
    }
  }

  return (
    <svg
      aria-label="Food locker F03 locking QR code"
      className="locker-qr__code"
      role="img"
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
    >
      <rect fill="white" height={size + 4} width={size + 4} x="-2" y="-2" />
      <g fill="currentColor">{cells}</g>
    </svg>
  )
}

function Button({
  children,
  disabled,
  onClick,
  type = "button",
  variant = "primary",
}: {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "primary" | "secondary" | "text"
}) {
  return (
    <button
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

function TextField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <span className="field__control">
        <span className="field__prefix">#</span>
        <input
          aria-label={label}
          autoCapitalize="characters"
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          placeholder="Enter delivery code"
          value={value}
        />
        <span className="field__valid">
          <Icon name="check" size={15} />
        </span>
      </span>
    </label>
  )
}

const order = {
  code: "FD-4821",
  guest: "Mina T.",
  locker: "F03",
  provider: "GrabFood",
  room: "Capsule B12",
}

export default function App() {
  const [step, setStep] = useState<"verify" | "dropoff" | "locking" | "done">(
    "verify",
  )
  const [code, setCode] = useState("FD-4821")

  const service = "https://cosahub-delivery-staging.aiitpelective2005.chatgpt.site/api/staging/deliveries/FD-4821"
  const [requestId, setRequestId] = useState(() => crypto.randomUUID())
  const [deliveryError, setDeliveryError] = useState("")
  const [notificationSeen, setNotificationSeen] = useState(false)
  async function completeDelivery() {
    if (step === "locking") return
    setDeliveryError("")
    setStep("locking")
    try {
      const response = await fetch(`${service}/complete`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, booking: "CSA-0913", lockerId: "F03" }),
        signal: AbortSignal.timeout(15000),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Could not confirm delivery. Please retry.")
      if (result.delivery.status === "collected") throw new Error("This delivery was already collected. Start another delivery to test again.")
      setNotificationSeen(result.delivery.notificationSeen)
      setStep("done")
    } catch (error) {
      setDeliveryError(error instanceof Error ? error.message : "Could not confirm delivery. Please retry.")
      setStep("dropoff")
    }
  }
  useEffect(() => {
    if (step !== "done") return
    let cancelled = false
    const deadline = Date.now() + 120000
    async function check() {
      if (cancelled || document.hidden || Date.now() > deadline) return
      try {
        const response = await fetch(`${service}?booking=CSA-0913`, { signal: AbortSignal.timeout(10000) })
        const result = await response.json()
        if (!cancelled && response.ok) setNotificationSeen(!!result.delivery?.notificationSeen)
      } catch { /* The delivery is recorded; receipt status can be refreshed later. */ }
    }
    void check()
    const timer = window.setInterval(() => void check(), 5000)
    return () => { cancelled = true; window.clearInterval(timer) }
  }, [step])

  function verifyOrder(event: FormEvent) {
    event.preventDefault()
    if (code.trim().toUpperCase() === "FD-4821") { setDeliveryError(""); setStep("dropoff") }
    else setDeliveryError("Use delivery code FD-4821 for this connected test.")
  }

  return (
    <div className="app-shell">
      {deliveryError && <div role="alert" style={{padding:16,background:"#f8e5da",color:"#813e27"}}>{deliveryError}</div>}
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setStep("verify")}
          type="button"
        >
          <span className="brand__mark">CŌSA</span>
          <span className="brand__divider" />
          <span className="brand__product">Rider Drop-off</span>
        </button>
        <div className="topbar__actions">
          <span className="connected">
            <span className="connected__dot" />
            CosaHub test connection
          </span>
          <Button variant="text">
            <Icon name="help" size={19} />
            <span>Need help?</span>
          </Button>
        </div>
      </header>

      <main className="main">
        <div className="main__inner">
          {step === "verify" && (
            <section className="verify-screen">
              <div className="eyebrow">
                <span className="eyebrow__icon">
                  <Icon name="package" size={17} />
                </span>
                FOOD DELIVERY
              </div>
              <div className="hero-copy">
                <div className="display-title">
                  Deliver safely.
                  <br />
                  We’ll notify the guest.
                </div>
                <p>
                  Verify the order to get a designated locker. Cōsa will keep
                  the food secure and let the guest know it has arrived.
                </p>
              </div>

              <form className="verify-card" onSubmit={verifyOrder}>
                <div className="card-title">Find this delivery</div>
                <p className="card-intro">
                  Enter the code shown in your delivery instructions.
                </p>
                <TextField
                  label="Delivery code"
                  onChange={setCode}
                  value={code}
                />
                <Button disabled={!code.trim()} type="submit">
                  Verify delivery
                  <Icon name="arrow" size={19} />
                </Button>
              </form>

              <div className="location-note">
                <span className="location-note__icon">
                  <Icon name="pin" size={20} />
                </span>
                <span>
                  <strong>Food lockers are in the ground-floor lobby</strong>
                  <small>Beside reception · Accessible 24 hours</small>
                </span>
              </div>
            </section>
          )}

          {(step === "dropoff" || step === "locking") && (
            <section className="dropoff-screen">
              <button
                className="back-link"
                onClick={() => setStep("verify")}
                type="button"
              >
                <span>←</span> Back to verification
              </button>
              <div className="dropoff-layout">
                <div className="dropoff-copy">
                  <div className="eyebrow">
                    <span className="eyebrow__icon">
                      <Icon name="check" size={17} />
                    </span>
                    DELIVERY VERIFIED
                  </div>
                  <div className="display-title">
                    Locker {order.locker}
                    <br />
                    is ready.
                  </div>
                  <p>
                    Your rider QR is ready. Follow the loading steps, then scan
                    it at the locker reader to secure the delivery.
                  </p>

                  <div className="order-summary">
                    <div>
                      <span>ORDER</span>
                      <strong>#{order.code}</strong>
                    </div>
                    <div>
                      <span>FOR</span>
                      <strong>{order.guest}</strong>
                    </div>
                    <div>
                      <span>STAY</span>
                      <strong>{order.room}</strong>
                    </div>
                  </div>
                </div>

                <div
                  className={`locker-card ${
                    step === "locking" ? "is-locking" : ""
                  }`}
                >
                  <div className="locker-card__top">
                    <div>
                      <span>ASSIGNED FOOD LOCKER</span>
                      <strong>{order.locker}</strong>
                    </div>
                    <span className="locker-status">
                      <Icon
                        name={step === "locking" ? "lock" : "unlock"}
                        size={17}
                      />
                      {step === "locking" ? "QR accepted" : "Ready for loading"}
                    </span>
                  </div>

                  <div className="qr-workflow">
                    <ol className="qr-instructions">
                      <li>
                        Go to locker {order.locker}. It is available for
                        loading.
                      </li>
                      <li>
                        Place the food inside. Keep your phone with you.
                      </li>
                      <li>
                        Close the door, then scan your QR at the locker reader
                        to lock.
                      </li>
                    </ol>

                    <div className="locker-qr">
                      <LockerQr />
                      <strong>Food locker QR · lock</strong>
                      <small>Valid only for locker {order.locker}</small>
                    </div>
                  </div>

                  <div className="locker-action">
                    <Button
                      disabled={step === "locking"}
                      onClick={() => void completeDelivery()}
                    >
                      {step === "locking" ? (
                        <>
                          QR accepted · locking…
                          <span className="button-spinner" />
                        </>
                      ) : (
                        <>
                          Scan QR at locker reader
                          <Icon name="arrow" size={18} />
                        </>
                      )}
                    </Button>
                    <p>
                      Prototype action · the locker stays unlocked until the QR
                      is scanned.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === "done" && (
            <section className="success-screen">
              <div className="delivery-receipt">
                <div className="delivery-receipt__brand">CŌSA</div>
                <div className="delivery-receipt__label">DELIVERY RECEIPT</div>
                <div className="delivery-receipt__number">
                  Receipt · {order.code}-F03
                </div>

                <div className="receipt-success">
                  <span>
                    <Icon name="check" size={26} />
                  </span>
                  <div>
                    <strong>Locked and delivered</strong>
                    <small>Completed just now</small>
                  </div>
                </div>

                <dl className="receipt-details">
                  <div>
                    <dt>Delivery</dt>
                    <dd>#{order.code}</dd>
                  </div>
                  <div>
                    <dt>Provider</dt>
                    <dd>{order.provider}</dd>
                  </div>
                  <div>
                    <dt>Guest</dt>
                    <dd>{order.guest}</dd>
                  </div>
                  <div>
                    <dt>Stay</dt>
                    <dd>{order.room}</dd>
                  </div>
                  <div className="receipt-details__locker">
                    <dt>Food locker</dt>
                    <dd>{order.locker}</dd>
                  </div>
                </dl>

                <div className="receipt-confirmations">
                  <div>
                    <span className="receipt-confirmations__icon">
                      <Icon name="shield" size={19} />
                    </span>
                    <span>
                      <strong>Locker secured</strong>
                      <small>Locked by rider QR scan</small>
                    </span>
                    <span className="success-pill">
                      <Icon name="check" size={14} /> Locked
                    </span>
                  </div>
                  <div>
                    <span className="receipt-confirmations__icon">
                      <span className="cosa-symbol">C</span>
                    </span>
                    <span>
                      <strong>{notificationSeen ? "Guest notified" : "Guest notification queued"}</strong>
                      <small>{notificationSeen ? "CosaHub received the delivery update" : "Open CosaHub to receive the delivery update"}</small>
                    </span>
                    <span className="sent-pill">{notificationSeen ? "Sent" : "Queued"}</span>
                  </div>
                </div>

                <div className="delivery-receipt__note">
                  <span>Thank you for delivering with care.</span>
                  <small>
                    Keep this receipt as confirmation of secure drop-off.
                  </small>
                </div>
              </div>

              <div className="success-actions">
                <Button
                  onClick={() => {
                    setCode("FD-4821")
                    setRequestId(crypto.randomUUID())
                    setNotificationSeen(false)
                    setDeliveryError("")
                    setStep("verify")
                  }}
                >
                  Start another delivery
                  <Icon name="arrow" size={19} />
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>
          <Icon name="shield" size={15} /> Secure food locker network
        </span>
        <span>© 2026 Cōsa Hotel</span>
        <span>Rider support · +65 6900 2026</span>
      </footer>
    </div>
  )
}
