"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Menginisialisasi...');
  const [device, setDevice] = useState('Mendeteksi...');
  
  // useRef digunakan agar script tidak berjalan 2x berturut-turut 
  // (terutama saat development dengan React Strict Mode)
  const hasAttemptedOpen = useRef(false);

  // Konfigurasi Deeplink & Website
  const config = {
    appScheme: 'mdnowapp://home?event=147',
    androidPackage: 'com.mdcorp.mdnow.dev',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mdcorp.mdnow',
    appStoreUrl: 'https://apps.apple.com/id/app/id6749968785',
    // Tambahkan URL website Anda di sini
    webUrl: 'https://md.now' 
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
        setStatus('Mencoba buka otomatis (tanpa fallback)...');
        // Untuk auto-open, kita HAPUS fallback Play Store. 
        // Kenapa? Agar jika diblokir oleh Chrome (karena tidak ada klik), 
        // user tidak tiba-tiba terlempar ke Play Store, melainkan tetap di web.
        const intentUrlAuto = `intent://home?event=147#Intent;scheme=mdnowapp;package=${config.androidPackage};end`;
        window.location.href = intentUrlAuto;
        
        // Ubah tulisan tombol menjadi call-to-action utama setelah gagal auto
        setTimeout(() => setStatus('Auto-redirect diblokir browser. Silakan klik tombol di bawah.'), 1000);
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
        // Jika Desktop, langsung arahkan ke Website
        setStatus('Mendeteksi Desktop, mengarahkan ke website...');
        window.location.href = config.webUrl;
      }
    };

    // Beri sedikit jeda (500ms) agar layar loading/UI sempat muncul, lalu eksekusi
    setTimeout(() => {
      autoOpenApp();
      hasAttemptedOpen.current = true;
    }, 500);
    
  }, []); // Penutup useEffect yang sebelumnya hilang

  // Fungsi manual (Dijalankan DENGAN klik pengguna)
  const handleManualRetry = () => {
    if (device === 'Android') {
      setStatus('Membuka via klik (dengan fallback Play Store)...');
      // Karena ini di-klik pengguna, Chrome akan mengizinkan.
      // Kita panggil Intent LENGKAP dengan fallback Play Store.
      const intentUrlManual = `intent://home?event=147#Intent;scheme=mdnowapp;package=${config.androidPackage};S.browser_fallback_url=${encodeURIComponent(config.playStoreUrl)};end`;
      window.location.href = intentUrlManual;
    } else if (device === 'iOS') {
      window.location.href = config.appScheme;
    } else {
      // Tombol manual untuk desktop juga mengarahkan ke website
      window.location.href = config.webUrl;
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
              Tunggu sebentar, kami sedang mengarahkan Anda ke tujuan yang tepat.
            </p>

            <div className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl mb-6 border border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Perangkat</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                {device}
              </span>
            </div>

            <button 
              onClick={handleManualRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 mt-2"
            >
              Buka Aplikasi MDNow
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