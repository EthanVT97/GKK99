import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';
import { useUsers } from '../hooks/useUsers';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const AdminDashboard: React.FC = () => {
  const { user, logout, isMainAdmin } = useAuth();
  const { content, loading: contentLoading, error: contentError, updateContent, saving } = useContent();
  const { users, loading: usersLoading, error: usersError, updateUserStatus } = useUsers();
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gkk99Link: '',
    gkk777Link: '',
    viberLink: '',
    pricing: {
      slots: '',
      freeSpin: '',
      winRate: '',
      gkk99Bonus: '',
      gkk777Bonus: ''
    }
  });
  const [successMessage, setSuccessMessage] = useState('');

  React.useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        gkk99Link: content.gkk99Link || '',
        gkk777Link: content.gkk777Link || '',
        viberLink: content.viberLink || '',
        pricing: {
          slots: content.pricing?.slots || '',
          freeSpin: content.pricing?.freeSpin || '',
          winRate: content.pricing?.winRate || '',
          gkk99Bonus: content.pricing?.gkk99Bonus || '',
          gkk777Bonus: content.pricing?.gkk777Bonus || ''
        }
      });
    }
  }, [content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('pricing.')) {
      const pricingField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [pricingField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    const result = await updateContent(formData);
    
    if (result.success) {
      setSuccessMessage('အချက်အလက်များကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    await updateUserStatus(userId, !currentStatus);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'မရှိပါ';
    return new Date(dateString).toLocaleString('my-MM');
  };

  const tabs = [
    { id: 'general', label: 'အထွေထွေ အချက်အလက်', icon: '📊' },
    { id: 'links', label: 'လင့်ခ်များ', icon: '🔗' },
    { id: 'pricing', label: 'စျေးနှုန်း အချက်အလက်', icon: '💰' },
    ...(isMainAdmin ? [{ id: 'users', label: 'အသုံးပြုသူများ', icon: '👥' }] : [])
  ];

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/99.png" 
                alt="GKK99" 
                className="h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center';
                  fallback.innerHTML = '<span class="text-black font-bold text-sm">99</span>';
                  target.parentNode?.appendChild(fallback);
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-white font-myanmar">
                  GKK99 စီမံခန့်ခွဲမှု
                </h1>
                <p className="text-sm text-gray-300">
                  {user?.role === 'main_admin' ? 'ပင်မ အက်ဒမင်' : 'ခွဲ အက်ဒမင်'} - {user?.username}
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-myanmar"
            >
              ထွက်ရန်
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-myanmar">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {contentError && (
          <ErrorMessage 
            message={contentError} 
            className="mb-6"
          />
        )}

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors font-myanmar ${
                    activeTab === tab.id
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 font-myanmar">
                  အထွေထွေ အချက်အလက်
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      ခေါင်းစဉ်
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="ခေါင်းစဉ် ရိုက်ထည့်ပါ"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      ဖော်ပြချက်
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="ဖော်ပြချက် ရိုက်ထည့်ပါ"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Links Tab */}
            {activeTab === 'links' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 font-myanmar">
                  လင့်ခ်များ
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      GKK99 လင့်ခ်
                    </label>
                    <input
                      type="url"
                      name="gkk99Link"
                      value={formData.gkk99Link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="https://www.gkk99.com/"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      GKK777 လင့်ခ်
                    </label>
                    <input
                      type="url"
                      name="gkk777Link"
                      value={formData.gkk777Link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="https://7777gkkk.info/"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      Viber လင့်ခ်
                    </label>
                    <input
                      type="text"
                      name="viberLink"
                      value={formData.viberLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="viber://pa?chatURI=chatbotnhantri"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 font-myanmar">
                  စျေးနှုန်း အချက်အလက်
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      စလော့ဂိမ်းအစုံ
                    </label>
                    <input
                      type="text"
                      name="pricing.slots"
                      value={formData.pricing.slots}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="20 Ks"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      ဖရီးစပင်
                    </label>
                    <input
                      type="text"
                      name="pricing.freeSpin"
                      value={formData.pricing.freeSpin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="1000 Ks"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      ဂိမ်းနိုင်ချေ
                    </label>
                    <input
                      type="text"
                      name="pricing.winRate"
                      value={formData.pricing.winRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="96.5%"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      GKK99 ဘောနပ်
                    </label>
                    <input
                      type="text"
                      name="pricing.gkk99Bonus"
                      value={formData.pricing.gkk99Bonus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="30,000 Ks"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-myanmar">
                      GKK777 ဘောနပ်
                    </label>
                    <input
                      type="text"
                      name="pricing.gkk777Bonus"
                      value={formData.pricing.gkk777Bonus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="30,000 Ks"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab (Main Admin Only) */}
            {activeTab === 'users' && isMainAdmin && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 font-myanmar">
                  အသုံးပြုသူများ
                </h2>
                
                {usersLoading ? (
                  <LoadingSpinner />
                ) : usersError ? (
                  <ErrorMessage message={usersError} />
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                          <div>
                            <h3 className="text-white font-semibold">{user.username}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.role === 'main_admin' 
                                  ? 'bg-yellow-400/20 text-yellow-400' 
                                  : 'bg-blue-400/20 text-blue-400'
                              }`}>
                                {user.role === 'main_admin' ? 'ပင်မ အက်ဒမင်' : 'ခွဲ အက်ဒမင်'}
                              </span>
                              <span>•</span>
                              <span>နောက်ဆုံး ဝင်ရောက်ချိန်: {formatDate(user.lastLogin)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {user.role !== 'main_admin' && (
                          <button
                            onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors font-myanmar ${
                              user.isActive
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {user.isActive ? 'ပိတ်ရန်' : 'ဖွင့်ရန်'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            {activeTab !== 'users' && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-myanmar flex items-center"
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      သိမ်းဆည်းနေသည်...
                    </>
                  ) : (
                    'ပြောင်းလဲမှုများကို သိမ်းဆည်းရန်'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};