import { SectionTitle } from './SectionTitle';
import TechnologyCard from './TechnologyCard';
import { motion } from 'motion/react';

export default function StylingSkillsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 text-white/90">
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: 60 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          animate={{ y: 0 }}
          className="text-6xl font-bold  text-center gradient-text leading-none "
        >
          {' '}
          Frontend Visual &
        </motion.h2>
      </div>
      <div className="overflow-hidden mb-12">
        <motion.h2
          initial={{ y: 60 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          animate={{ y: 0 }}
          className="text-6xl font-bold  text-center gradient-text leading-none "
        >
          {' '}
          Styling Skills
        </motion.h2>
      </div>

      <motion.p
        className="text-blue-dark leading-relaxed mb-16 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        I focus on creating clean, precise, and visually consistent user
        interfaces using a{' '}
        <span className="font-semibold">pixel-perfect approach</span>. While I
        don't work as a UI/UX designer, I use{' '}
        <span className="font-semibold">Figma</span>
        as a technical tool to translate layouts into accurate, production-ready
        frontend implementations.
      </motion.p>

      {/* Technologies & Styling Tools */}
      <section className="mb-24">
        <SectionTitle>Technologies & Styling Tools</SectionTitle>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="CSS & SCSS"
            imageSrc="/css+scss.png"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Modular, reusable styling patterns</li>
              <li>Responsive layouts and adaptive components</li>
              <li>Scalable architecture for large projects</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="TailwindCSS"
            imageSrc="/tailwind.png"
            animation="right"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Utility-first styling for speed and consistency</li>
              <li>Custom themes, design tokens, and breakpoints</li>
              <li>Clean, maintainable UI development workflow</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Styled-Components"
            imageSrc="/styled-component.png"
            animation="left"
          >
            <ul className="space-y-4 flex flex-col items-center text-base text-center leading-none">
              <li>Component-driven CSS in React</li>
              <li>Dynamic styles powered by props</li>
              <li>Scoped, maintainable styling architecture</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="UI Libraries"
            imageSrc="/materialUI.png"
            animation="right"
          >
            <ul className="space-y-1 flex flex-col items-center text-base">
              <li>Material UI — modern, accessible components</li>
              <li>Hero UI — clean, lightweight interface elements</li>
              <li>Radix UI — unstyled primitives for custom UI</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Animations Section */}
      <section className="mb-24">
        <SectionTitle>Animations & Motion Tools</SectionTitle>

        <div className="flex flex-wrap gap-12 justify-center">
          <TechnologyCard
            title="Motion"
            imageSrc="/framer-motion.png"
            animation="left"
          >
            <ul className="space-y-1 flex flex-col items-center text-base">
              <li>Page transitions and dynamic motion</li>
              <li>Scroll-triggered animations</li>
              <li>Interactive UI effects</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard title="GSAP" imageSrc="/gsap.png" animation="right">
            <ul className="space-y-1 flex flex-col items-center text-base">
              <li>High-performance motion sequences</li>
              <li>Advanced timeline-based animation</li>
              <li>Complex, fluid interactions</li>
            </ul>
          </TechnologyCard>

          <TechnologyCard
            title="Angular Animations"
            imageSrc="/angular.png"
            animation="down"
          >
            <ul className="space-y-1 flex flex-col items-center text-base">
              <li>State-based animations</li>
              <li>Component-level transitions</li>
            </ul>
          </TechnologyCard>
        </div>
      </section>

      {/* Approach Section */}
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
        <h2 className="text-4xl text-center font-semibold mb-4">My Approach</h2>
        <ul className="space-y-2 flex flex-col items-center text-base">
          <li>Pixel-perfect implementation based on Figma</li>
          <li>Clean and semantic code architecture</li>
          <li>Consistent visual logic across entire projects</li>
          <li>Performance-first UI implementation</li>
          <li>Smooth and meaningful animations</li>
        </ul>
      </motion.section>
    </div>
  );
}
