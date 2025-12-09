import { SectionTitle } from './SectionTitle';
import TechnologyCard from './TechnologyCard';
import { motion } from 'motion/react';

export default function BackendSkillsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 text-white/90">
      <div className=" w-fit overflow-hidden mx-auto">
        <motion.h2
          initial={{ y: 60 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          animate={{ y: 0 }}
          className="text-6xl font-bold  text-center gradient-text leading-none "
        >
          Backend Development{' '}
        </motion.h2>
      </div>
      <div className="mb-12 w-fit overflow-hidden mx-auto">
        <motion.h2
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-6xl font-bold  text-center gradient-text leading-none"
        >
          Skills & Architecture
        </motion.h2>
      </div>

      <motion.p
        className="text-blue-dark leading-relaxed mb-16 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        I build secure, scalable, and high-performance backend systems using
        modern
        <span className="font-semibold">
          {' '}
          JavaScript and TypeScript tooling
        </span>
        . My work focuses on robust server architecture, efficient API design,
        and reliable communication between backend and client layers.
      </motion.p>

      {/* Node.js / Express */}
      <section className="mb-24">
        <SectionTitle>Node.js & API Frameworks</SectionTitle>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="Node.js"
            imageSrc="/nodejs.png"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>High-performance backend runtime</li>
              <li>Asynchronous & event-driven architecture</li>
              <li>Building scalable server logic</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Express.js"
            imageSrc="/express.png"
            animation="right"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>REST API development</li>
              <li>Middleware architecture</li>
              <li>Modular routing & validation</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* API Development */}
      <section className="mb-24">
        <SectionTitle>API Development & Architecture</SectionTitle>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="REST APIs"
            imageSrc="/rest.svg"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>CRUD endpoints & routing</li>
              <li>Pagination, filtering, search</li>
              <li>Versioning & documentation</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Validation"
            imageSrc="/validation.png"
            animation="right"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Request schema validation</li>
              <li>Error handling & sanitization</li>
              <li>Consistent API responses</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Security"
            imageSrc="/security.png"
            animation="down"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>JWT authentication</li>
              <li>Role-based access control</li>
              <li>Hashing, tokens & protected routes</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Real-time */}
      <section className="mb-24">
        <SectionTitle>Real-Time Communication</SectionTitle>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="WebSockets"
            imageSrc="/ws.png"
            animation="down"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Real-time updates</li>
              <li>Socket.io integration</li>
              <li>Event-based backend architecture</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Databases */}
      <section className="mb-24">
        <SectionTitle>Databases & Data Layer</SectionTitle>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="MongoDB"
            imageSrc="/mongodb.png"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Document schemas with Mongoose</li>
              <li>Aggregation pipelines</li>
              <li>Indexes & performance optimization</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="PostgreSQL"
            imageSrc="/postgres.png"
            animation="right"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Relational schema design</li>
              <li>Transactions & joins</li>
              <li>Query optimization</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Prisma ORM"
            imageSrc="/prisma.png"
            animation="down"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Type-safe database models</li>
              <li>Migrations & schema versioning</li>
              <li>Works with SQL & NoSQL</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Deployment */}
      <section className="mb-24">
        <SectionTitle>Deployment & Infrastructure</SectionTitle>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="Vercel"
            imageSrc="/vercel.svg"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Deploying full-stack Next.js apps</li>
              <li>Environment variables & serverless</li>
              <li>Edge functions & caching layers</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard title="AWS" imageSrc="/aws.png" animation="right">
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>EC2 server hosting</li>
              <li>S3 storage & CDN</li>
              <li>Lambda functions</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Render"
            imageSrc="/render.png"
            animation="down"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Node.js server hosting</li>
              <li>Zero-downtime deploys</li>
              <li>Container-based apps</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Approach */}
      <motion.section
        className="flex flex-col items-center gap-6 p-8 py-12 rounded-3xl border border-purple/30 bg-black/10 backdrop-blur-md inset-shadow-[0_4px_30px_rgba(128,0,128,0.5)]"
        initial={{
          opacity: 0,
          y: 50,
        }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: '0px 0px -200px 0px' }}
      >
        <h3 className="text-4xl text-center font-semibold mb-4">My Approach</h3>
        <ul className="space-y-2 flex flex-col items-center text-base">
          <li>Predictable, scalable backend architectures</li>
          <li>Clean separation of services & logic</li>
          <li>Performance optimization & caching</li>
          <li>Secure and well-documented APIs</li>
          <li>Backend layers built for smooth frontend integration</li>
        </ul>
      </motion.section>
    </div>
  );
}
