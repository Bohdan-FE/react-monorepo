import TechnologyCard from './TechnologyCard';

export default function LogicSkillsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 text-white/90">
      <h2 className="text-6xl font-bold mb-12 text-center gradient-text">
        Interactivity & <br /> State Management Skills
      </h2>

      <p className="text-blue-dark leading-relaxed mb-16 text-center max-w-2xl mx-auto">
        I build dynamic, responsive, and data-driven applications using a
        <span className="font-semibold">
          {' '}
          performance‑oriented architecture
        </span>
        . My focus is on scalable logic, predictable state management, and
        reliable communication between client and backend layers.
      </p>

      {/* Frameworks Section */}
      <section className="mb-24">
        <h3 className="text-4xl text-center font-semibold mb-12">
          Frameworks & Architecture
        </h3>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="Monorepo with Nx"
            imageSrc="/nx.png"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Modular and scalable architecture</li>
              <li>Shared libraries & reusable utilities</li>
              <li>Optimized builds and caching</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard title="React" imageSrc="/react.png" animation="right">
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Component-driven UI development</li>
              <li>Custom hooks & optimized rendering</li>
              <li>Client-side routing & API integration</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Angular"
            imageSrc="/angular.png"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Scalable module-based structure</li>
              <li>RxJS reactive data flows</li>
              <li>Powerful DI and service architecture</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Next.js"
            imageSrc="/nextjs.png"
            animation="right"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Server-side and client-side rendering</li>
              <li>App Router & layouts structure</li>
              <li>API routes and backend integration</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* State Management */}
      <section className="mb-24">
        <h3 className="text-4xl text-center font-semibold mb-12">
          State Management
        </h3>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard title="Redux" imageSrc="/redux.png" animation="left">
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Predictable global state container</li>
              <li>Toolkit, Thunks, selectors</li>
              <li>Horizontal scaling for large apps</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Zustand"
            imageSrc="/zustand.svg"
            animation="right"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Lightweight & flexible stores</li>
              <li>Extremely fast selector-based updates</li>
              <li>Great for complex UI logic</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard title="RxJS" imageSrc="/rxjs.png" animation="left">
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Reactive streams & async flows</li>
              <li>Observers, subjects & operators</li>
              <li>Core part of Angular ecosystem</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="TanStack Query"
            imageSrc="/tanstack.png"
            animation="down"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Advanced server-state management</li>
              <li>Smart caching & automatic refetching</li>
              <li>Optimistic UI updates & request dedupe</li>
              <li>Infinite queries & pagination</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* APIs */}
      <section className="mb-24">
        <h2 className="text-4xl text-center font-semibold mb-12">
          Data Layer & APIs
        </h2>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard title="Axios" imageSrc="/axios.png" animation="left">
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Interceptors & error handling</li>
              <li>Typed reusable client modules</li>
              <li>Retry & cancellation logic</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="REST API"
            imageSrc="/rest.svg"
            animation="right"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>CRUD operations & pagination</li>
              <li>Backend integration and auth</li>
              <li>Request optimization & caching</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="WebSockets"
            imageSrc="/ws.png"
            animation="down"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Real-time data channels</li>
              <li>Subscriptions & event handling</li>
              <li>Reconnect and fallback logic</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Web3 */}
      <section className="mb-24">
        <h3 className="text-4xl text-center font-semibold mb-12">
          Web3 & Blockchain Interaction
        </h3>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="Web3 & Ethers.js"
            imageSrc="/web3.png"
            animation="down"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Reading & writing contract data</li>
              <li>Wallet connection & chain handling</li>
              <li>Event subscriptions & listeners</li>
              <li>Building secure dApp UIs</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Approach */}
      <section className="flex flex-col items-center gap-6 p-8 py-12 rounded-3xl border border-purple/30 bg-black/10 backdrop-blur-md inset-shadow-[0_4px_30px_rgba(128,0,128,0.5)]">
        <h3 className="text-4xl text-center font-semibold mb-4">My Approach</h3>
        <ul className="space-y-2 flex flex-col items-center text-base">
          <li>Clear separation of UI, state, and data layers</li>
          <li>Scalable and maintainable architecture</li>
          <li>Performant async data pipelines</li>
          <li>Predictable and testable logic flows</li>
          <li>Real-time features with stable fallbacks</li>
        </ul>
      </section>
    </div>
  );
}
