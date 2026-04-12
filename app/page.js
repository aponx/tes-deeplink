"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Menunggu interaksi...');
  const [device, setDevice] = useState('Mendeteksi...');

  // Effect untuk mendeteksi jenis perangkat saat komponen dimuat di browser
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDevice('iOS');
    } else if (/android/i.test(userAgent)) {
      setDevice('Android');
    } else {
      setDevice('Desktop / Lainnya');
    }
  }, []);

  // Konfigurasi Deeplink MDNow
  const config = {
    appScheme: 'mdnow://home',
    androidPackage: 'com.mdcorp.mdnow',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mdcorp.mdnow',
    appStoreUrl: 'https://apps.apple.com/id/app/id6749968785'
  };

  const handleSmartOpenApp = () => {
    if (device === 'Android') {
      setStatus('Membuka via Android Intent...');
      const intentUrl = `intent://home#Intent;scheme=mdnow;package=${config.androidPackage};S.browser_fallback_url=${encodeURIComponent(config.playStoreUrl)};end`;
      window.location.href = intentUrl;
    } 
    else if (device === 'iOS') {
      setStatus('Membuka via URL Scheme (iOS)...');
      const start = Date.now();
      let timeout;
      let visibilityListener;

      window.location.href = config.appScheme;

      timeout = setTimeout(() => {
        const end = Date.now();
        if (end - start < 2500) {
          setStatus('Aplikasi tidak ditemukan, ke App Store...');
          window.location.href = config.appStoreUrl;
        }
      }, 2000);

      visibilityListener = () => {
        if (document.hidden) {
          clearTimeout(timeout);
          setStatus('Aplikasi berhasil dibuka!');
        }
      };

      document.addEventListener('visibilitychange', visibilityListener);
      setTimeout(() => document.removeEventListener('visibilitychange', visibilityListener), 3000);
    } 
    else {
      setStatus('Terdeteksi Desktop.');
      alert('Sistem mendeteksi Anda menggunakan Desktop. Silakan scan QR atau buka link ini dari Smartphone Anda.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col font-sans">
      {/* Header Sederhana */}
      <header className="w-full p-6 flex justify-center border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">M</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">MDNow</span>
        </div>
      </header>

      {/* Area Konten Utama */}
      <section className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
          
          <div className="p-8 flex flex-col items-center text-center">
            {/* Ikon Promosi */}
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Lanjutkan di Aplikasi
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Dapatkan pengalaman terbaik, fitur lengkap, dan notifikasi langsung melalui aplikasi MDNow.
            </p>

            {/* Info Perangkat */}
            <div className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl mb-6 border border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Perangkat Anda</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                {device}
              </span>
            </div>

            {/* Tombol Aksi */}
            <button 
              onClick={handleSmartOpenApp}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 transform hover:-translate-y-0.5"
            >
              Buka Aplikasi MDNow
            </button>
            
            <p className="mt-4 text-xs text-gray-400">
              Belum punya aplikasi? Anda akan diarahkan ke toko aplikasi secara otomatis.
            </p>
          </div>

          {/* Area Status Logger (Untuk Debugging) */}
          <div className="bg-slate-800 p-4 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">System Log</span>
            </div>
            <p className="text-sm text-green-400 font-mono break-words">
              &gt; {status}
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} MDCorp. Hak Cipta Dilindungi.
      </footer>
    </main>
  );
}