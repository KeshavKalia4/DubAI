import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Loader2, ArrowRight, Clock, CheckCircle2, ChevronLeft } from 'lucide-react'
import { MadrLogo } from '@/components/ui/madr-logo'
import { NebulaBg } from '@/components/ui/nebula-bg'
import { contributorApi } from '@/lib/api/contributorApi'
import { userApi } from '@/lib/api/userApi'

type Step =
  | 'identify'
  | 'signup'
  | 'apply'
  | 'pending'
  | 'submitted'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 placeholder-white/25 outline-none transition focus:border-[#4b2e83]/60 focus:ring-1 focus:ring-[#4b2e83]/30'
const labelClass = 'block text-xs font-mono uppercase tracking-[0.15em] text-white/35 mb-1.5'

export function ContributorAuth() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('identify')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [netid, setNetid] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rsoName, setRsoName] = useState('')
  const [position, setPosition] = useState('')
  const [reason, setReason] = useState('')

  // Pending request info
  const [pendingRsoName, setPendingRsoName] = useState('')

  const handleIdentify = async () => {
    if (!netid.trim()) { setError('Please enter your NetID'); return }
    setIsLoading(true)
    setError(null)

    try {
      // Check if user exists
      const { exists } = await userApi.checkUserExists(netid.trim())

      if (!exists) {
        // New user — need to sign up first
        setStep('signup')
        setIsLoading(false)
        return
      }

      // User exists — get contributor status
      const status = await contributorApi.getStatus(netid.trim())

      if (status.is_contributor) {
        // Find their approved request for RSO info
        const approved = status.requests.find(r => r.status === 'approved')
        const user = await userApi.getUser(netid.trim())

        contributorApi.saveSession({
          netid: netid.trim(),
          name: user?.name ?? netid.trim(),
          email: user?.email ?? '',
          rso_id: approved?.rso_id ?? null,
          rso_name: approved?.rso_name ?? null,
        })
        navigate('/contributor')
        return
      }

      if (status.pending_request) {
        setPendingRsoName(status.pending_request.rso_name)
        setStep('pending')
        setIsLoading(false)
        return
      }

      // No pending request — pre-fill info and show apply form
      const user = await userApi.getUser(netid.trim())
      if (user) {
        setName(user.name ?? '')
        setEmail(user.email ?? '')
      }
      setStep('apply')
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!name.trim() || !email.trim()) { setError('Please fill in all fields'); return }
    setIsLoading(true)
    setError(null)
    try {
      await userApi.createUser({
        id: netid.trim(),
        name: name.trim(),
        email: email.trim(),
        organizationId: 'uw-seattle',
        tags: [],
      })
      setStep('apply')
    } catch {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    if (!rsoName.trim() || !position.trim() || !reason.trim()) {
      setError('Please fill in all fields')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await contributorApi.apply({
        user_netid: netid.trim(),
        rso_name: rsoName.trim(),
        position: position.trim(),
        reason: reason.trim(),
      })
      setStep('submitted')
    } catch (err: any) {
      const msg = err?.message ?? ''
      if (msg.includes('already have a request')) {
        setError('You already have a pending application for this organization.')
      } else {
        setError('Failed to submit application. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#08060f] flex items-center justify-center p-4">
      <NebulaBg preset="minimal" className="z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <MadrLogo size={32} showText={false} />
        </div>

        <AnimatePresence mode="wait">

          {/* ── Step: Identify ─────────────────────────────────────── */}
          {step === 'identify' && (
            <motion.div
              key="identify"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-white/8 bg-[#0d0a1a] p-7 space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <LayoutDashboard size={14} className="text-[#b7a57a]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#b7a57a]/60">Contributor Portal</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Sign in</h1>
                <p className="text-xs text-white/35 mt-1">Enter your UW NetID to continue</p>
              </div>

              <div>
                <label className={labelClass}>UW NetID</label>
                <input
                  className={inputClass}
                  placeholder="e.g. jsmith1"
                  value={netid}
                  onChange={e => setNetid(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleIdentify()}
                  autoFocus
                />
              </div>

              {error && <p className="text-xs text-red-400/80">{error}</p>}

              <button
                onClick={handleIdentify}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#4b2e83]/70 hover:bg-[#4b2e83]/90 border border-[#4b2e83]/50 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <>Continue <ArrowRight size={14} /></>}
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full text-xs text-white/25 hover:text-white/50 transition-colors cursor-pointer"
              >
                ← Back to home
              </button>
            </motion.div>
          )}

          {/* ── Step: Signup ───────────────────────────────────────── */}
          {step === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-white/8 bg-[#0d0a1a] p-7 space-y-5"
            >
              <button onClick={() => setStep('identify')} className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                <ChevronLeft size={13} /> Back
              </button>

              <div>
                <h1 className="text-2xl font-bold text-white">Create account</h1>
                <p className="text-xs text-white/35 mt-1">
                  No account found for <span className="text-white/60 font-mono">{netid}</span>. Fill in your details to get started.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input className={inputClass} placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>UW Email</label>
                  <input className={inputClass} placeholder="jsmith1@uw.edu" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              {error && <p className="text-xs text-red-400/80">{error}</p>}

              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#4b2e83]/70 hover:bg-[#4b2e83]/90 border border-[#4b2e83]/50 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <>Next <ArrowRight size={14} /></>}
              </button>
            </motion.div>
          )}

          {/* ── Step: Apply ────────────────────────────────────────── */}
          {step === 'apply' && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-white/8 bg-[#0d0a1a] p-7 space-y-5"
            >
              <div>
                <h1 className="text-2xl font-bold text-white">Apply to contribute</h1>
                <p className="text-xs text-white/35 mt-1">
                  Tell us about your club and your role. We review all applications manually.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Club / Organization name</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Husky Coding Club"
                    value={rsoName}
                    onChange={e => setRsoName(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Your position / role</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Events Coordinator, President"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Why do you want to contribute?</label>
                  <textarea
                    className={inputClass + ' resize-none'}
                    rows={3}
                    placeholder="Briefly describe what events you run and what you'd like to post on madr."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400/80">{error}</p>}

              <button
                onClick={handleApply}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#4b2e83]/70 hover:bg-[#4b2e83]/90 border border-[#4b2e83]/50 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : 'Submit Application'}
              </button>
            </motion.div>
          )}

          {/* ── Step: Pending ──────────────────────────────────────── */}
          {step === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-white/8 bg-[#0d0a1a] p-7 space-y-5 text-center"
            >
              <Clock size={36} className="mx-auto text-[#b7a57a]/50" />
              <div>
                <h1 className="text-xl font-bold text-white">Application under review</h1>
                <p className="text-sm text-white/40 mt-2">
                  Your application for <span className="text-white/70 font-medium">{pendingRsoName}</span> is being reviewed. We'll approve it manually — check back soon.
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                ← Back to home
              </button>
            </motion.div>
          )}

          {/* ── Step: Submitted ────────────────────────────────────── */}
          {step === 'submitted' && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-white/8 bg-[#0d0a1a] p-7 space-y-5 text-center"
            >
              <CheckCircle2 size={36} className="mx-auto text-emerald-400/60" />
              <div>
                <h1 className="text-xl font-bold text-white">Application submitted!</h1>
                <p className="text-sm text-white/40 mt-2">
                  We'll review your application for <span className="text-white/70 font-medium">{rsoName}</span> and get back to you. Once approved, you'll have full access to the contributor dashboard.
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                ← Back to home
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
