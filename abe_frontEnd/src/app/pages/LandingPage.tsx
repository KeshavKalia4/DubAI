import { useNavigate } from 'react-router';
import { GraduationCap, LayoutDashboard } from 'lucide-react';
import { TextParticle } from '@/components/ui/text-particle';
import { Particles } from '@/components/ui/particles';
import { NebulaBg } from '@/components/ui/nebula-bg';
import { WaveDivider } from '@/components/ui/wave-divider';
import { MadrLogo } from '@/components/ui/madr-logo';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#08060f] flex flex-col items-center justify-center">
      {/* Particle field */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={120}
        ease={80}
        color="#ffffff"
        size={0.5}
        staticity={40}
      />

      {/* Nebula atmospheric glow */}
      <NebulaBg preset="landing" className="z-0" />

      {/* Wave at bottom — rising from void */}
      <WaveDivider
        className="absolute bottom-0 left-0 right-0 z-0"
        height={48}
        opacity={0.6}
        speed={14}
        flip
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">

        {/* Logo mark — constellation M with "madr" below */}
        <MadrLogo size={48} showText={false} />

        {/* TextParticle hero */}
        <div className="h-32 w-full max-w-sm sm:max-w-md">
          <TextParticle
            text="madr"
            fontSize={140}
            fontFamily="Arial, sans-serif"
            particleColor="#b7a57a"
            particleSize={1.5}
            particleDensity={5}
          />
        </div>

        {/* Tagline */}
        <p className="text-xs font-medium uppercase tracking-[0.25em]">
          <span className="text-white/50">Campus Life</span>
          <span className="mx-3 text-[#b7a57a]/60">·</span>
          <span className="text-white/30">A Space That Matters</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/student')}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 backdrop-blur-sm transition-all duration-200 hover:border-[#b7a57a]/50 hover:bg-white/10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4b2e83]/30 transition-colors group-hover:bg-[#4b2e83]/50">
              <GraduationCap className="h-4 w-4 text-[#b7a57a]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Student</div>
              <div className="text-xs text-white/40">Explore campus life</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/contributor/auth')}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 backdrop-blur-sm transition-all duration-200 hover:border-[#4b2e83]/50 hover:bg-white/10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#b7a57a]/10 transition-colors group-hover:bg-[#b7a57a]/20">
              <LayoutDashboard className="h-4 w-4 text-[#b7a57a]/80" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Contributor</div>
              <div className="text-xs text-white/40">Create campus experiences</div>
            </div>
          </button>
        </div>

        {/* Bottom label */}
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/15">
          built for student life
        </p>
      </div>
    </div>
  );
}
