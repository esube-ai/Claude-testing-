import { useState, type FormEvent } from 'react';
import { X, ShieldCheck, Loader2, Check, Zap, Building2 } from 'lucide-react';
import { useAuth, type Plan } from '../../contexts/AuthContext';

const PLANS: { id: Plan; name: string; price: string; period: string; features: string[]; icon: typeof Zap; highlight?: boolean }[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: ShieldCheck,
    features: ['3 checks / month', '5 covered cities', 'Basic compliance report'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/month',
    icon: Zap,
    highlight: true,
    features: ['Unlimited checks', 'All 12 cities', 'Full PDF report', 'Monthly regulation alerts'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$149',
    period: '/month',
    icon: Building2,
    features: ['Everything in Pro', '5 team seats', 'API access', 'Priority support'],
  },
];

interface Props {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
  defaultPlan?: Plan;
}

export function SignupModal({ onClose, onSwitchToLogin, onSuccess, defaultPlan = 'free' }: Props) {
  const { signup } = useAuth();
  const [step, setStep] = useState<'plan' | 'details'>(defaultPlan === 'free' ? 'details' : 'plan');
  const [plan, setPlan] = useState<Plan>(defaultPlan);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password, plan);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <button onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">STR Compliance</span>
        </div>

        {step === 'plan' ? (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Choose your plan</h2>
            <p className="text-slate-500 text-sm mb-6">Start with Free — upgrade any time</p>

            <div className="space-y-3 mb-6">
              {PLANS.map(p => {
                const Icon = p.icon;
                return (
                  <button key={p.id} onClick={() => setPlan(p.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      plan === p.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${plan === p.id ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="font-semibold text-slate-900">{p.name}</span>
                        {p.highlight && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">Popular</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{p.price}</span>
                        <span className="text-xs text-slate-500"> {p.period}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                      {p.features.map(f => (
                        <span key={f} className="text-xs text-slate-500 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500" /> {f}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setStep('details')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
              Continue with {PLANS.find(p => p.id === plan)?.name}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
            <p className="text-slate-500 text-sm mb-1">
              Selected plan: <span className="font-semibold text-blue-600 capitalize">{plan}</span>
              {' '}&mdash;{' '}
              <button onClick={() => setStep('plan')} className="text-slate-400 hover:text-slate-600 underline text-xs">change</button>
            </p>
            <p className="text-slate-500 text-sm mb-6">&nbsp;</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  required autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={8}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Min. 8 characters"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Creating account…' : 'Create account'}
              </button>

              <p className="text-center text-xs text-slate-400">
                By signing up you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </>
        )}

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
