import React from 'react';
import {
  Smartphone, User, MessageSquare, Check,
  Plane, Wine, Frown
} from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PhoneChat from './components/features/PhoneChat';
import ChatCard from './components/features/ChatCard';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';

const App = () => {
  return (
    <div className="bg-white min-h-screen text-stone-900 font-sans antialiased selection:bg-stone-200">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Badge>Now available in Norway</Badge>
          <h1 className="text-5xl md:text-7xl font-medium text-stone-900 mb-8 tracking-tight font-serif leading-[1.1]">
            The coach who talks<br />
            <span className="text-stone-400 italic">to you every day.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-xl mx-auto mb-12 font-light leading-relaxed">
            Most apps give you a plan and disappear. We stay. <br className="hidden md:block" />
            Daily feedback. Real human connection. Radical consistency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary">Start Your Journey</Button>
            <Button variant="secondary">How it works</Button>
          </div>
        </div>

        <div className="mt-16 md:mt-24 max-w-5xl mx-auto px-6">
          <PhoneChat />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-center mb-6 text-stone-900">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">1. Daily Audit</h3>
              <p className="text-stone-600 leading-relaxed">
                Every evening at 8 PM, you get a simple link. Log your energy, food, and mood in 90 seconds. No complex tracking.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-center mb-6 text-stone-900">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">2. Human Review</h3>
              <p className="text-stone-600 leading-relaxed">
                A real coach (not a bot) reviews your day. They look at your context, your stress, and your sleep.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-center mb-6 text-stone-900">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">3. The Feedback</h3>
              <p className="text-stone-600 leading-relaxed">
                You wake up to a personal message. Encouragement if you struggled, specific adjustments for the day ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="py-24 bg-stone-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16 text-center">
            <Badge>Real Situations</Badge>
            <h3 className="text-3xl md:text-4xl font-serif font-medium text-stone-900 mt-4">
              We don't judge. We solve.
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ChatCard
              icon={Plane}
              title="Travel Logistics"
              time="07:30"
              client="Arrived in Bergen. The hotel gym is literally just a treadmill and some light dumbbells. Should I skip?"
              coach="No skipping! I just updated your app. Check it now—I built a 20-min dumbbell circuit that will torch you. Send selfie after! 📸"
            />
            <ChatCard
              icon={Wine}
              title="Social Dining"
              time="18:45"
              client="Heading to dinner at Olivia with my boss. I don't want to be 'that guy' who orders nothing. Help?"
              coach="Easy. Order the Insalata di Pollo. Ask for dressing on the side and skip the focaccia basket. You'll look professional and hit your protein goal. Enjoy!"
            />
            <ChatCard
              icon={Frown}
              title="Motivation Dip"
              time="21:15"
              client="I honestly just want to eat chocolate and watch TV. Longest day ever. I don't have it in me."
              coach="I hear you. Set a timer for 5 minutes. Just do 5 minutes of stretching. If you still want to stop after that, fine. But don't break the streak of moving."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-stone-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-white text-center md:text-left relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">Private Coaching</h2>
                <p className="text-stone-400 mb-8 text-lg font-light leading-relaxed">
                  We cap our client roster to ensure every member gets true, personal attention.
                </p>
                <div className="space-y-4">
                  {[
                    "Dedicated Personal Coach",
                    "Daily 1:1 Feedback & Support",
                    "Flexible Nutrition Guidance",
                    "Restaurant & Travel Support",
                    "Cancel anytime"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-stone-300">
                      <Check className="w-5 h-5 text-white" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-sm">
                <p className="text-sm text-stone-400 font-bold tracking-widest uppercase mb-4">All Inclusive Membership</p>
                <div className="text-5xl font-bold mb-2">3,900 <span className="text-lg font-normal text-stone-400">NOK</span></div>
                <p className="text-stone-500 text-sm mb-8">Per month. VAT included.</p>
                <Button className="w-full bg-white text-stone-900 hover:bg-stone-100 border-transparent">
                  Apply for Coaching
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;
