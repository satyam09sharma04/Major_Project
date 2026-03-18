import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWallet from "../components/wallet/ConnectWallet";
import WalletStatus from "../components/wallet/WalletStatus";
import { logoutUser } from "../services/authService";
import { getAllProperties } from "../services/propertyService";

const Dashboard = () => {
	const navigate = useNavigate();
	const [properties, setProperties] = useState([]);
	const [error, setError] = useState("");
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const loadProperties = async () => {
			try {
				const response = await getAllProperties();
				setProperties(response.data || []);
			} catch (err) {
				setError(err?.response?.data?.message || "Could not load properties");
			} finally {
				setLoaded(true);
			}
		};
		loadProperties();
		// trigger entry animation
		setTimeout(() => setLoaded(true), 50);
	}, []);

	const handleLogout = () => {
		logoutUser();
		navigate("/");
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

				*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

				.db-root {
					min-height: 100vh;
					background: #0c0f0a;
					font-family: 'DM Sans', sans-serif;
					color: #e8e6e1;
					padding: 0;
					overflow-x: hidden;
					position: relative;
				}

				/* Noise texture overlay */
				.db-root::before {
					content: '';
					position: fixed;
					inset: 0;
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
					pointer-events: none;
					z-index: 0;
					opacity: 0.6;
				}

				/* Ambient glow */
				.db-glow {
					position: fixed;
					top: -200px;
					right: -200px;
					width: 600px;
					height: 600px;
					border-radius: 50%;
					background: radial-gradient(circle, rgba(180, 255, 120, 0.08) 0%, transparent 70%);
					pointer-events: none;
					z-index: 0;
				}
				.db-glow-2 {
					position: fixed;
					bottom: -150px;
					left: -150px;
					width: 500px;
					height: 500px;
					border-radius: 50%;
					background: radial-gradient(circle, rgba(120, 200, 255, 0.06) 0%, transparent 70%);
					pointer-events: none;
					z-index: 0;
				}

				.db-inner {
					position: relative;
					z-index: 1;
					max-width: 1080px;
					margin: 0 auto;
					padding: 0 24px 60px;
				}

				/* ── Header ── */
				.db-header {
					display: flex;
					align-items: flex-end;
					justify-content: space-between;
					padding: 52px 0 40px;
					border-bottom: 1px solid rgba(255,255,255,0.07);
					gap: 16px;
					flex-wrap: wrap;
					opacity: 0;
					transform: translateY(-16px);
					animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s forwards;
				}

				.db-title-group {}
				.db-eyebrow {
					font-size: 11px;
					letter-spacing: 0.18em;
					text-transform: uppercase;
					color: #b4ff78;
					font-weight: 500;
					margin-bottom: 6px;
				}
				.db-title {
					font-family: 'DM Serif Display', serif;
					font-size: clamp(36px, 5vw, 52px);
					color: #f5f2eb;
					line-height: 1.05;
					font-style: italic;
				}
				.db-title span {
					font-style: normal;
					color: #b4ff78;
				}

				.db-logout-btn {
					display: flex;
					align-items: center;
					gap: 8px;
					background: rgba(255,255,255,0.05);
					border: 1px solid rgba(255,255,255,0.1);
					color: #c8c5be;
					font-family: 'DM Sans', sans-serif;
					font-size: 13px;
					font-weight: 500;
					padding: 10px 18px;
					border-radius: 100px;
					cursor: pointer;
					transition: all 0.2s ease;
					letter-spacing: 0.02em;
					backdrop-filter: blur(8px);
				}
				.db-logout-btn:hover {
					background: rgba(255,255,255,0.1);
					border-color: rgba(255,255,255,0.2);
					color: #f5f2eb;
					transform: translateY(-1px);
				}
				.db-logout-btn svg { opacity: 0.7; }

				/* ── Stat strip ── */
				.db-stat-strip {
					display: flex;
					align-items: center;
					gap: 32px;
					padding: 24px 0 0;
					flex-wrap: wrap;
					opacity: 0;
					animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s forwards;
				}

				.db-stat {
					display: flex;
					flex-direction: column;
					gap: 2px;
				}
				.db-stat-val {
					font-family: 'DM Serif Display', serif;
					font-size: 38px;
					color: #f5f2eb;
					line-height: 1;
				}
				.db-stat-label {
					font-size: 12px;
					color: #7a7870;
					letter-spacing: 0.06em;
					text-transform: uppercase;
				}

				.db-stat-divider {
					width: 1px;
					height: 40px;
					background: rgba(255,255,255,0.08);
				}

				.db-status-pill {
					display: flex;
					align-items: center;
					gap: 7px;
					background: rgba(180, 255, 120, 0.08);
					border: 1px solid rgba(180, 255, 120, 0.2);
					border-radius: 100px;
					padding: 6px 14px;
					font-size: 12px;
					color: #b4ff78;
					font-weight: 500;
					margin-left: auto;
				}
				.db-status-dot {
					width: 6px;
					height: 6px;
					border-radius: 50%;
					background: #b4ff78;
					animation: pulse 2s ease-in-out infinite;
				}

				/* ── Grid ── */
				.db-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
					gap: 16px;
					margin-top: 32px;
				}

				.db-card {
					background: rgba(255,255,255,0.03);
					border: 1px solid rgba(255,255,255,0.07);
					border-radius: 20px;
					padding: 28px;
					position: relative;
					overflow: hidden;
					transition: border-color 0.25s, transform 0.25s, background 0.25s;
					backdrop-filter: blur(4px);
					opacity: 0;
					animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
				}
				.db-card:nth-child(1) { animation-delay: 0.22s; }
				.db-card:nth-child(2) { animation-delay: 0.32s; }
				.db-card:hover {
					border-color: rgba(255,255,255,0.14);
					background: rgba(255,255,255,0.05);
					transform: translateY(-2px);
				}

				/* Accent stripe on card */
				.db-card::before {
					content: '';
					position: absolute;
					top: 0; left: 24px; right: 24px;
					height: 1px;
					background: linear-gradient(90deg, transparent, rgba(180,255,120,0.4), transparent);
					opacity: 0;
					transition: opacity 0.3s;
				}
				.db-card:hover::before { opacity: 1; }

				.db-card-label {
					font-size: 11px;
					letter-spacing: 0.15em;
					text-transform: uppercase;
					color: #5a5854;
					font-weight: 500;
					margin-bottom: 18px;
					display: flex;
					align-items: center;
					gap: 8px;
				}
				.db-card-label::after {
					content: '';
					flex: 1;
					height: 1px;
					background: rgba(255,255,255,0.06);
				}

				/* ── Error Banner ── */
				.db-error {
					display: flex;
					align-items: center;
					gap: 10px;
					background: rgba(239,68,68,0.08);
					border: 1px solid rgba(239,68,68,0.2);
					border-radius: 12px;
					padding: 14px 18px;
					color: #fca5a5;
					font-size: 14px;
					margin-top: 20px;
				}

				/* ── Properties section ── */
				.db-properties {
					margin-top: 16px;
					opacity: 0;
					animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.42s forwards;
				}

				.db-section-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 16px;
				}
				.db-section-title {
					font-family: 'DM Serif Display', serif;
					font-size: 22px;
					color: #f5f2eb;
					font-style: italic;
				}
				.db-count-badge {
					background: rgba(180,255,120,0.12);
					border: 1px solid rgba(180,255,120,0.25);
					color: #b4ff78;
					font-size: 12px;
					font-weight: 600;
					padding: 4px 12px;
					border-radius: 100px;
					letter-spacing: 0.04em;
				}

				.db-properties-card {
					background: rgba(255,255,255,0.025);
					border: 1px solid rgba(255,255,255,0.06);
					border-radius: 20px;
					padding: 28px;
					backdrop-filter: blur(4px);
				}

				.db-empty {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 40px 0;
					gap: 10px;
					color: #4a4845;
				}
				.db-empty-icon {
					font-size: 36px;
					opacity: 0.5;
				}
				.db-empty-text {
					font-size: 14px;
					letter-spacing: 0.04em;
				}

				/* ── Animations ── */
				@keyframes fadeUp {
					from { opacity: 0; transform: translateY(18px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				@keyframes pulse {
					0%, 100% { opacity: 1; transform: scale(1); }
					50%       { opacity: 0.4; transform: scale(0.85); }
				}

				/* Responsive */
				@media (max-width: 600px) {
					.db-stat-strip { gap: 20px; }
					.db-status-pill { margin-left: 0; }
				}
			`}</style>

			<div className="db-root">
				<div className="db-glow" />
				<div className="db-glow-2" />

				<div className="db-inner">
					{/* ── Header ── */}
					<header className="db-header">
						<div className="db-title-group">
							<p className="db-eyebrow">Property Management</p>
							<h1 className="db-title">Your <span>Dashboard</span></h1>
						</div>
						<button className="db-logout-btn" onClick={handleLogout}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
							</svg>
							Sign out
						</button>
					</header>

					{/* ── Stat strip ── */}
					<div className="db-stat-strip">
						<div className="db-stat">
							<span className="db-stat-val">{properties.length}</span>
							<span className="db-stat-label">Properties</span>
						</div>
						<div className="db-stat-divider" />
						<div className="db-stat">
							<span className="db-stat-val">—</span>
							<span className="db-stat-label">Portfolio Value</span>
						</div>
						<div className="db-status-pill">
							<span className="db-status-dot" />
							Live
						</div>
					</div>

					{/* ── Wallet cards ── */}
					<div className="db-grid">
						<div className="db-card">
							<p className="db-card-label">Connect Wallet</p>
							<ConnectWallet />
						</div>
						<div className="db-card">
							<p className="db-card-label">Wallet Status</p>
							<WalletStatus />
						</div>
					</div>

					{/* ── Error ── */}
					{error && (
						<div className="db-error">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
							</svg>
							{error}
						</div>
					)}

					{/* ── Properties ── */}
					<section className="db-properties">
						<div className="db-section-header">
							<h2 className="db-section-title">Properties</h2>
							<span className="db-count-badge">{properties.length} total</span>
						</div>
						<div className="db-properties-card">
							{properties.length === 0 ? (
								<div className="db-empty">
									<span className="db-empty-icon">⬡</span>
									<span className="db-empty-text">No properties found</span>
								</div>
							) : (
								/* Render your property list/grid here */
								<p style={{ color: "#7a7870", fontSize: 14 }}>
									{properties.length} propert{properties.length === 1 ? "y" : "ies"} loaded.
								</p>
							)}
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default Dashboard;