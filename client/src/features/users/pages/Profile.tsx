import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import { updateUser } from '@/src/features/auth/store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, Award, Edit3, Camera, CheckCircle2, ChevronRight, 
  MapPin, Calendar, CreditCard, Clock, Star, Heart, Lock, Bell, 
  Activity, Car, ArrowRight, ShieldCheck, Settings, LogOut, Check
} from 'lucide-react';
import api from '@/src/api/axios';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await api.put('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData(data.data);
      dispatch(updateUser(data.data));
      toast.success('Avatar updated successfully');
    } catch (err) {
      toast.error('Failed to update avatar');
    }
  
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfileData(data.data.user);
        setBookings(data.data.bookings || []);
        setFormData(data.data.user);
        dispatch(updateUser(data.data.user));
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user, dispatch]);

  const handleUpdate = async () => {
    try {
      const { data } = await api.put('/users/profile', formData);
      setProfileData(data.data);
      dispatch(updateUser(data.data));
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Please login</div>;
  }

  if (loading || !profileData) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeBooking = bookings.find((b: any) => b.status === 'ACTIVE');
  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
  const upcomingBookings = bookings.filter((b: any) => ['PENDING', 'CONFIRMED'].includes(b.status));
  
  const totalSpent = completedBookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-24 font-sans selection:bg-blue-500/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-amber-900/5 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden mb-8"
        >
          {/* Cover Photo */}
          <div className="h-48 md:h-64 relative bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030303]"></div>
          </div>

          <div className="px-8 pb-8 md:px-12 md:pb-12 relative -mt-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-amber-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0a0a0a] border-4 border-[#030303] flex items-center justify-center relative z-10 overflow-hidden">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-500" />
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
                  >
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[9px] uppercase tracking-widest font-bold">Edit</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1 pb-2">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{profileData.firstName} {profileData.lastName}</h1>
                  <CheckCircle2 className="text-blue-500 w-6 h-6 shrink-0" />
                </div>
                <p className="text-slate-400 font-mono text-sm mb-4">{profileData.email}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <Shield className="w-3.5 h-3.5" />
                    {profileData.role}
                  </div>
                  <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Award className="w-3.5 h-3.5" />
                    {profileData.membershipTier || 'Premium Member'}
                  </div>
                </div>
              </div>

              {/* Quick Stats Right */}
              <div className="hidden lg:flex gap-6 pb-2">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Loyalty Points</p>
                  <p className="text-2xl font-bold text-amber-500 tracking-tighter">{profileData.loyaltyPoints?.toLocaleString() || 0}</p>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Rentals</p>
                  <p className="text-2xl font-bold tracking-tighter">{bookings.length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NAVIGATION TABS */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 mb-8">
          <div className="flex gap-8 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2 transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="profile-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-amber-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Completed', value: completedBookings.length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
                      { label: 'Active', value: activeBooking ? 1 : 0, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                      { label: 'Upcoming', value: upcomingBookings.length, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                      { label: 'Total Spent', value: `₨${(totalSpent/1000).toFixed(1)}k`, icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
                        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-4 h-4" />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                        </div>
                        <p className="text-2xl font-bold tracking-tighter">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Active Booking Card */}
                  {activeBooking && (
                    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-blue-500/20 rounded-3xl p-1 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50"></div>
                      <div className="bg-[#030303]/90 backdrop-blur-xl rounded-[23px] p-6 md:p-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative bg-[#111]">
                          <img src={activeBooking.vehicle?.images?.split(',')[0]} alt="Vehicle" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                          <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                            <Activity className="w-3 h-3 animate-pulse" /> Active
                          </div>
                        </div>
                        <div className="flex-1 w-full">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Rental</p>
                          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{activeBooking.vehicle?.brand} {activeBooking.vehicle?.model}</h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-3">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Pick Up</p>
                              <p className="text-sm font-medium">{new Date(activeBooking.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Return</p>
                              <p className="text-sm font-medium">{new Date(activeBooking.endDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <button className="w-full bg-white text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">
                            Manage Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Activity Timeline */}
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" /> Activity Timeline
                    </h3>
                    <div className="space-y-6">
                      {bookings.slice(0, 3).map((booking: any, i: number) => (
                        <div key={i} className="flex gap-4 relative">
                          {i !== 2 && <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-white/10"></div>}
                          <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 relative z-10">
                            <Car className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="text-sm font-medium mb-1">Booked {booking.vehicle?.brand} {booking.vehicle?.model}</p>
                            <p className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleDateString()} • {booking.status}</p>
                          </div>
                        </div>
                      ))}
                      {bookings.length === 0 && <p className="text-slate-500 text-sm">No activity yet.</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PERSONAL INFO TAB */}
              {activeTab === 'personal' && (
                <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Personal Details
                    </h3>
                    {!editMode ? (
                      <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={() => {setEditMode(false); setFormData(profileData)}} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">
                          Cancel
                        </button>
                        <button onClick={handleUpdate} className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', key: 'firstName', type: 'text' },
                      { label: 'Last Name', key: 'lastName', type: 'text' },
                      { label: 'Email', key: 'email', type: 'email', disabled: true },
                      { label: 'Phone Number', key: 'phone', type: 'tel' },
                      { label: 'CNIC / Passport', key: 'cnic', type: 'text' },
                      { label: 'Date of Birth', key: 'dateOfBirth', type: 'date' },
                      { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                      { label: 'Address', key: 'address', type: 'text', colSpan: 2 },
                      { label: 'City', key: 'city', type: 'text' },
                      { label: 'Country', key: 'country', type: 'text' },
                    ].map((field, i) => (
                      <div key={i} className={field.colSpan ? 'md:col-span-2' : ''}>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{field.label}</label>
                        {editMode && !field.disabled ? (
                          field.type === 'select' ? (
                            <select 
                              value={formData[field.key] || ''}
                              onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                              className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
                            >
                              <option value="">Select</option>
                              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : (
                            <input 
                              type={field.type}
                              value={formData[field.key] || (field.type === 'date' && formData[field.key] ? formData[field.key].split('T')[0] : '')}
                              onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                              className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                            />
                          )
                        ) : (
                          <div className="w-full bg-[#030303] border border-white/5 rounded-xl p-3.5 text-sm text-slate-300">
                            {field.type === 'date' && profileData[field.key] 
                              ? new Date(profileData[field.key]).toLocaleDateString() 
                              : profileData[field.key] || '-'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* BOOKINGS TAB */}
              {activeTab === 'bookings' && (
                <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  {bookings.length > 0 ? bookings.map((booking: any) => (
                    <div key={booking.id} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 flex flex-col md:flex-row gap-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                      <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-[#111] shrink-0 border border-white/5">
                        <img src={booking.vehicle?.images?.split(',')[0]} alt="Car" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-xl font-bold mb-1">{booking.vehicle?.brand} {booking.vehicle?.model}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              <span className="bg-white/5 px-2 py-0.5 rounded">{booking.rentalType || 'CITY'}</span>
                              <span className="bg-white/5 px-2 py-0.5 rounded">{booking.driveType || 'SELF_DRIVE'}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                            ['COMPLETED'].includes(booking.status) ? 'text-green-500 border-green-500/20 bg-green-500/10' :
                            ['ACTIVE', 'CONFIRMED'].includes(booking.status) ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' :
                            ['CANCELLED', 'REJECTED'].includes(booking.status) ? 'text-red-500 border-red-500/20 bg-red-500/10' :
                            'text-amber-500 border-amber-500/20 bg-amber-500/10'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        <div className="flex justify-between items-center mt-auto">
                          <p className="font-mono font-bold text-white text-lg">PKR {booking.totalPrice?.toLocaleString()}</p>
                          <button className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                            Details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 text-center">
                      <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <h4 className="text-xl font-bold mb-2">No Bookings Yet</h4>
                      <p className="text-slate-400 text-sm">You haven't rented any vehicles yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 text-center">
                    <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Saved Vehicles</h4>
                    <p className="text-slate-400 text-sm mb-6">Keep track of the luxury vehicles you want to experience next.</p>
                    <button className="px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors inline-block">
                      Explore Fleet
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PAYMENTS TAB */}
              {activeTab === 'payments' && (
                <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Spent</p>
                        <p className="text-3xl font-bold tracking-tighter">PKR {totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-colors w-full md:w-auto">
                      View Invoices
                    </button>
                  </div>
                  
                  <h3 className="text-sm font-bold uppercase tracking-widest mt-8 mb-4">Recent Transactions</h3>
                  <div className="space-y-4">
                    {completedBookings.slice(0, 5).map((booking: any) => (
                      <div key={booking.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center">
                            <Car className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm mb-0.5">{booking.vehicle?.brand} {booking.vehicle?.model}</p>
                            <p className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleDateString()} • {booking.paymentMethod || 'Card'}</p>
                          </div>
                        </div>
                        <p className="font-mono font-bold text-white">PKR {booking.totalPrice?.toLocaleString()}</p>
                      </div>
                    ))}
                    {completedBookings.length === 0 && <p className="text-slate-500 text-sm">No transaction history.</p>}
                  </div>
                </motion.div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> Account Security
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-4 border border-white/5 rounded-2xl bg-white/[0.01]">
                        <div>
                          <p className="font-bold text-sm mb-1">Two-Factor Authentication (2FA)</p>
                          <p className="text-xs text-slate-500">Protect your account with an extra layer of security.</p>
                        </div>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">
                          Enable
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-white/5 rounded-2xl bg-white/[0.01]">
                        <div>
                          <p className="font-bold text-sm mb-1">Change Password</p>
                          <p className="text-xs text-slate-500">Update your password regularly to keep your account secure.</p>
                        </div>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">
                          Update
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Recent Logins</h3>
                    <div className="space-y-4">
                      {[
                        { device: 'MacBook Pro (Safari)', loc: 'Karachi, Pakistan', time: 'Active Now', current: true },
                        { device: 'iPhone 15 Pro (App)', loc: 'Islamabad, Pakistan', time: '2 days ago', current: false },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl bg-[#030303]">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-bold text-sm mb-0.5">{session.device}</p>
                              <p className="text-xs text-slate-500">{session.loc} • {session.time}</p>
                            </div>
                          </div>
                          {session.current ? (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Current</span>
                          ) : (
                            <button className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400">Revoke</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {[
                    { title: 'Security & Password', icon: Lock, desc: 'Manage your password and 2FA settings' },
                    { title: 'Notifications', icon: Bell, desc: 'Email and SMS alerts preferences' },
                    { title: 'Privacy Data', icon: ShieldCheck, desc: 'Manage your connected accounts and data' },
                  ].map((setting, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <setting.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-0.5">{setting.title}</p>
                          <p className="text-xs text-slate-500">{setting.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                  
                  <div className="pt-8">
                    <button className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-widest transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Membership Card */}
            <div className="relative rounded-3xl overflow-hidden aspect-[1.58/1] shadow-2xl group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-amber-600 to-yellow-500 mix-blend-color-burn"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-40 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent"></div>
              
              {/* Card Content */}
              <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-200/80 mb-1">Membership</h4>
                    <p className="text-xl font-bold tracking-tighter text-white">PREMIUM</p>
                  </div>
                  <Award className="w-8 h-8 text-amber-300 opacity-80" />
                </div>
                
                <div>
                  <p className="font-mono text-lg tracking-[0.2em] text-white/90 mb-2">**** **** **** {profileData.id ? profileData.id.slice(-4).toUpperCase() : '0000'}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-100">{profileData.firstName} {profileData.lastName}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-amber-200/60">EST 2026</p>
                  </div>
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
            </div>

            {/* Loyalty Info */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest">Rewards</h3>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-bold tracking-tighter text-amber-500 mb-2">{profileData.loyaltyPoints?.toLocaleString() || 0} <span className="text-sm text-slate-500 font-normal tracking-normal">PTS</span></p>
              <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 w-2/3"></div>
              </div>
              <p className="text-xs text-slate-400">1,500 points to Platinum Tier</p>
            </div>

            {/* Notification Center Mini */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" /> Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium mb-1">Welcome to Premium</p>
                    <p className="text-xs text-slate-500">Enjoy 10% off on all luxury fleet bookings this month.</p>
                  </div>
                </div>
                {activeBooking && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium mb-1">Booking Confirmed</p>
                      <p className="text-xs text-slate-500">Your {activeBooking.vehicle?.brand} is ready for pickup.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
