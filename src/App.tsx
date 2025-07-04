import { useEffect } from 'react';
import './App.css';

function App() {
  const handleViberClick = () => {
    // Enhanced Viber link handling with fallback
    const viberUrl = 'viber://pa?chatURI=chatbotnhantri';
    const fallbackUrl = 'https://www.viber.com/download/';
    
    try {
      window.open(viberUrl, '_blank');
      // Fallback for devices without Viber
      setTimeout(() => {
        if (confirm('Viber မရှိပါက Viber ကို ဒေါင်းလုဒ်လုပ်မလား?')) {
          window.open(fallbackUrl, '_blank');
        }
      }, 2000);
    } catch (error) {
      window.open(fallbackUrl, '_blank');
    }
  };

  const handleGKK99Click = () => {
    window.open('https://www.gkk99.com/', '_blank');
  };

  const handleGKK777Click = () => {
    window.open('https://7777gkkk.info/', '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Remove loading class after component mounts
    document.body.classList.remove('loading');
    
    // Add scroll event listener for header background
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('bg-black/20', 'backdrop-blur-md');
        } else {
          header.classList.remove('bg-black/20', 'backdrop-blur-md');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-indigo-400 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-green-400 rounded-full opacity-5 animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/99.png" 
              alt="GKK99 Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
            >
              ဝန်ဆောင်မှုများ
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
            >
              အကြောင်းအရာ
            </button>
          </nav>
          
          <button 
            onClick={handleViberClick}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            စတင်ရန်
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-32 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-float">
            <img 
              src="/99.png" 
              alt="GKK99 Main Logo" 
              className="mx-auto h-32 w-auto mb-8"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-pulse-glow">
            GKK99
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-gray-200 font-myanmar">
            GKK99 ဝန်ဆောင်မှု
          </p>
          
          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-yellow-400/30">
            <div className="space-y-2 text-lg font-myanmar">
              <p className="text-yellow-400">💸 စလော့ဂိမ်းအစုံ - 20 Ks</p>
              <p className="text-green-400">✅ ဖရီးစပင် - 1000 Ks</p>
              <p className="text-blue-400">💰 ဂိမ်းနိုင်ချေ - 96.5%</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={handleGKK99Click}
              className="bg-gradient-to-r from-green-400 to-green-500 text-black px-8 py-4 rounded-full text-lg font-bold hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-2"
            >
              <span className="font-myanmar">GKK99 ဖရီး 30,000 Ks ရယူရန်</span>
            </button>
            
            <button 
              onClick={handleGKK777Click}
              className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-2"
            >
              <span className="font-myanmar">GKK777 အခမဲ့ 30,000 Ks ရယူရန်</span>
            </button>
          </div>
          
          <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto font-myanmar">
            စာရင်းသွင်းပြီး အခမဲ့ဘောနပ် နှစ်ကြိမ်ရယူလိုက်ပါ❣️❣️
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleViberClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full text-lg font-bold hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-2 btn-primary"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.52 7.33l-1.93 2.39c-.17.21-.43.33-.71.33-.17 0-.34-.04-.49-.13l-2.47-1.3c-.32-.17-.72-.17-1.04 0l-2.47 1.3c-.15.09-.32.13-.49.13-.28 0-.54-.12-.71-.33L4.32 9.33c-.22-.27-.22-.65 0-.92.17-.21.43-.33.71-.33.17 0 .34.04.49.13l2.47 1.3c.32.17.72.17 1.04 0l2.47-1.3c.15-.09.32-.13.49-.13.28 0 .54.12.71.33.22.27.22.65 0 .92z"/>
              </svg>
              <span className="font-myanmar">Viber မှာ စတင်ရန်</span>
            </button>
            
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 flex items-center space-x-2"
            >
              <span className="font-myanmar">သို့မဟုတ် အောက်တွင် ပိုမိုလေ့လာပါ</span>
              <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent font-myanmar">
            ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုများ
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 feature-card">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-myanmar">၂၄/၇ ဝန်ဆောင်မှု</h3>
              <p className="text-gray-300 font-myanmar">အချိန်မရွေး အဖြေများ ရယူနိုင်ပါသည်</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 feature-card">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-myanmar">လျင်မြန်သော တုံ့ပြန်မှု</h3>
              <p className="text-gray-300 font-myanmar">ချက်ချင်း အဖြေများ ရရှိနိုင်ပါသည်</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 feature-card">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.81-1.66-2.39-4.95-2.87-7.34-1.21-2.39 1.66-2.87 4.95-1.21 7.34 1.5 2.16 4.21 2.43 6.15.69l.03-.03L10.93 15l1.94-1.93zM8.5 12C7.12 12 6 10.88 6 9.5S7.12 7 8.5 7 11 8.12 11 9.5 9.88 12 8.5 12z"/>
                  <path d="m13 17.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5z"/>
                  <path d="m20.5 19.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-myanmar">မြန်မာဘာသာ</h3>
              <p className="text-gray-300 font-myanmar">သင့်ဘာသာစကားဖြင့် စကားပြောနိုင်ပါသည်</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 feature-card">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-myanmar">လုံခြုံမှု</h3>
              <p className="text-gray-300 font-myanmar">သင့်အချက်အလက်များ လုံခြုံစွာ ကာကွယ်ထားပါသည်</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent font-myanmar">
            GKK99 အကြောင်း
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-yellow-400 font-myanmar">
                ကျွန်ုပ်တို့သည် ဘာကြောင့် ထူးခြားသနည်း?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 mt-1"></div>
                  <p className="text-gray-300 font-myanmar">
                    မြန်မာဘာသာဖြင့် အပြည့်အဝ ပံ့ပိုးမှု ရရှိနိုင်သည်
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 mt-1"></div>
                  <p className="text-gray-300 font-myanmar">
                    ခေတ်မီ AI နည်းပညာဖြင့် တည်ဆောက်ထားသည်
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 mt-1"></div>
                  <p className="text-gray-300 font-myanmar">
                    အသုံးပြုရ လွယ်ကူပြီး လုံခြုံမှု အပြည့်အဝ ရှိသည်
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 mt-1"></div>
                  <p className="text-gray-300 font-myanmar">
                    ၂၄ နာရီ အချိန်မရွေး ဝန်ဆောင်မှု ရရှိနိုင်သည်
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <img 
                src="/99.png" 
                alt="GKK99 About" 
                className="mx-auto h-48 w-auto mb-6 animate-float"
              />
              <p className="text-gray-300 font-myanmar text-lg">
                GKK99 သည် မြန်မာနိုင်ငံတွင် ပထမဆုံး AI ချတ်ဘော့ ဝန်ဆောင်မှု ဖြစ်ပြီး၊ 
                သင့်အတွက် အကောင်းဆုံး အဖြေများကို ပေးဆောင်နိုင်ရန် ရည်ရွယ်ပါသည်။
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 backdrop-blur-lg rounded-3xl p-12 border border-yellow-400/30">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent font-myanmar">
              ယခုပင် စတင်လိုက်ပါ
            </h2>
            <p className="text-xl mb-8 text-gray-200 font-myanmar">
              GKK99 AI ချတ်ဘော့နှင့် အတူ သင့်အတွေ့အကြုံကို မြှင့်တင်လိုက်ပါ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <button 
                onClick={handleGKK99Click}
                className="bg-gradient-to-r from-green-400 to-green-500 text-black px-8 py-4 rounded-full text-lg font-bold hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span className="font-myanmar">GKK99 ဖရီး 30,000 Ks</span>
              </button>
              
              <button 
                onClick={handleGKK777Click}
                className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span className="font-myanmar">GKK777 အခမဲ့ 30,000 Ks</span>
              </button>
            </div>
            <button 
              onClick={handleViberClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-4 rounded-full text-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-2xl btn-primary"
            >
              <span className="font-myanmar">Viber တွင် ချက်ချင်း စတင်ရန်</span>
            </button>
            <p className="text-sm text-gray-400 mt-4 font-myanmar">
              အခမဲ့ စတင်နိုင်ပါသည် • မှတ်ပုံတင်ရန် မလိုအပ်ပါ
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/99.png" 
                alt="GKK99 Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-300 mb-2 font-myanmar">
                မြန်မာ AI ချတ်ဘော့ ဝန်ဆောင်မှု
              </p>
              <p className="text-sm text-gray-400">
                © 2024 GKK99. All rights reserved.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 font-myanmar">
              Copyright by GKK99 • ဒီဇိုင်းနှင့် ဖွံ့ဖြိုးတိုးတက်မှု
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;