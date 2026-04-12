"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Menginisialisasi...');
  const [device, setDevice] = useState('Mendeteksi...');
  
  // useRef digunakan agar script tidak berjalan 2x berturut-turut 
  // (terutama saat development dengan React Strict Mode)
  const hasAttemptedOpen = useRef(false);

  // Konfigurasi Deeplink
  const config = {
    appScheme: 'mdnowapp://home?event=147',
    androidPackage: 'com.mdcorp.mdnow.dev',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mdcorp.mdnow',
    appStoreUrl: 'https://apps.apple.com/id/app/id6749968785'
  };

  // Effect ini berjalan otomatis satu kali saat halaman dimuat
  useEffect(() => {
    // Cegah double eksekusi
    if (hasAttemptedOpen.current) return;

    // 1. Deteksi Perangkat terlebih dahulu
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let currentDevice = 'Desktop / Lainnya';

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      currentDevice = 'iOS';
    } else if (/android/i.test(userAgent)) {
      currentDevice = 'Android';
    }
    
    setDevice(currentDevice);

    // 2. Fungsi untuk membuka app secara otomatis
    const autoOpenApp = () => {
      if (currentDevice === 'Android') {
        setStatus('Otomatis membuka via Android Intent...');
        const intentUrl = `intent://home?event=147#Intent;scheme=mdnowapp;package=${config.androidPackage};S.browser_fallback_url=${encodeURIComponent(config.playStoreUrl)};end`;
        window.location.href = intentUrl;
      } 
      else if (currentDevice === 'iOS') {
        setStatus('Otomatis membuka via URL Scheme (iOS)...');
        const start = Date.now();
        let timeout;
        let visibilityListener;

        window.location.href = config.appScheme;

        timeout = setTimeout(() => {
          const end = Date.now();
          if (end - start < 2500) {
            setStatus('Aplikasi tidak ditemukan, dialihkan ke App Store...');
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
        setStatus('Mendeteksi Desktop, redirect dihentikan.');
      }
    };

    // Beri sedikit jeda (500ms) agar layar loading/UI sempat muncul, lalu eksekusi
    setTimeout(() => {
      autoOpenApp();
      hasAttemptedOpen.current = true;
    }, 1000);

  }, []);

  // Fungsi manual untuk jaga-jaga jika pop-up terblokir browser
  const handleManualRetry = () => {
    if (device === 'Android') {
      const intentUrl = `intent://home?event=147#Intent;scheme=mdnowapp;package=${config.androidPackage};S.browser_fallback_url=${encodeURIComponent(config.playStoreUrl)};end`;
      window.location.href = intentUrl;
    } else if (device === 'iOS') {
      window.location.href = config.appScheme;
    } else {
      alert('Anda menggunakan desktop.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col font-sans">
      <header className="w-full p-6 flex justify-center border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">M</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">MDNow</span>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
          <div className="p-8 flex flex-col items-center text-center">
            
            {/* Indikator Loading */}
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Membuka Aplikasi...
            </h1>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Tunggu sebentar, kami sedang mengarahkan Anda ke aplikasi MDNow.
            </p>

            <div className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl mb-6 border border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Perangkat</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                {device}
              </span>
            </div>

            {/* Tombol manual disembunyikan kecuali jika terjadi kegagalan atau delay */}
            <button 
              onClick={handleManualRetry}
              className="w-full bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Klik disini jika aplikasi tidak terbuka
            </button>
            
          </div>

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
    </main>
  );
}