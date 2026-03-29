import React from 'react';
import { useStore } from '~/stores';
import WindowSettingIcon from '../apps/WindowSettingIcon';

export default function WindowSettings() {
  const { 
    settingsTab, settingsTab2, setSettingsTab,
    useVideoWallpaper, wallpaperVideoIndex,   
    toggleVideoWallpaper, setWallpaperVideoIndex 
  } = useStore((state) => ({
    settingsTab: state.settingsTab,
    settingsTab2: state.settingsTab2,
    setSettingsTab: state.setSettingsTab,
    useVideoWallpaper: state.useVideoWallpaper, 
    wallpaperVideoIndex: state.wallpaperVideoIndex, 
    toggleVideoWallpaper: state.toggleVideoWallpaper, 
    setWallpaperVideoIndex: state.setWallpaperVideoIndex, 
  }));

  const videoWallpapers = [
    { name: '16:9', src: '/video/凯尔希.mp4' },
    { name: '海滨公园打伞的澪', src: '/video/零.mp4' },
    { name: 'Mona', src: '/video/莫娜.mp4' },
    { name: 'Wallpaper 2', src: '/video/wallpaper2.mp4' },
    { name: 'Wallpaper 3', src: '/video/wallpaper3.mp4' },
    { name: 'Wallpaper 4', src: '/video/wallpaper4.mp4' },
    { name: 'Wallpaper 5', src: '/video/wallpaper5.mp4' },
  ];

  return (
    <div className="w-full h-full flex select-none bg-white text-gray-800">
      
      {/* ================= 1. 左侧：一级导航 ================= */}
      <div className="w-44 flex-none flex flex-col px-3 py-4 border-r border-gray-100">
        <WindowSettingIcon tag="Profile" img="profile" active={settingsTab === 'Profile'} onClick={() => setSettingsTab('Profile', 'About Me')} />
        <WindowSettingIcon tag="Skills" img="skills" active={settingsTab === 'Skills'} onClick={() => setSettingsTab('Skills', 'Badges')} />
        <WindowSettingIcon tag="Wallpaper" appIcon="wallpapers" active={settingsTab === 'Wallpaper'} onClick={() => setSettingsTab('Wallpaper', 'Video')} />
        <WindowSettingIcon tag="Resume" img="paint" active={settingsTab === 'Resume'} onClick={() => setSettingsTab('Resume', '')} />
      </div>

      {/* ================= 2. 中间：二级导航 ================= */}
      <div className="w-44 flex-none flex flex-col px-3 py-4 border-r border-gray-100 bg-[#fafafa]">
        {settingsTab === 'Profile' && (
          <>
            <WindowSettingIcon tag="About Me" img="aboutme" active={settingsTab2 === 'About Me'} onClick={() => setSettingsTab('Profile', 'About Me')} />
            <WindowSettingIcon tag="Github Stats" img="github" active={settingsTab2 === 'Github Stats'} onClick={() => setSettingsTab('Profile', 'Github Stats')} />
            <WindowSettingIcon tag="Contributions" img="contributions" active={settingsTab2 === 'Contributions'} onClick={() => setSettingsTab('Profile', 'Contributions')} />
            <WindowSettingIcon tag="CodeWars" img="codewars" active={settingsTab2 === 'CodeWars'} onClick={() => setSettingsTab('Profile', 'CodeWars')} />
          </>
        )}
        {settingsTab === 'Skills' && (
          <>
            <WindowSettingIcon tag="Badges" img="badges" active={settingsTab2 === 'Badges'} onClick={() => setSettingsTab('Skills', 'Badges')} />
            <WindowSettingIcon tag="And Some Else" img="star" active={settingsTab2 === 'And Some Else'} onClick={() => setSettingsTab('Skills', 'And Some Else')} />
          </>
        )}
        {settingsTab === 'Wallpaper' && (
          <WindowSettingIcon tag="Video" img="video" active={settingsTab2 === 'Video'} onClick={() => setSettingsTab('Wallpaper', 'Video')} />
        )}
      </div>

      {/* ================= 3. 右侧：内容展示区 ================= */}
      <div className="flex-grow h-full relative overflow-y-auto overflow-x-hidden bg-white p-8 custom-scrollbar">
        
        {/* ---------- Profile > About Me ---------- */}
        {settingsTab === 'Profile' && settingsTab2 === 'About Me' && (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md ring-4 ring-blue-50">
              <img src="/img/images/head2.png" alt="Leonardo Elish" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 text-gray-400 font-medium">Leonardo Elish</div>
            <div className="text-2xl mt-2 font-normal tracking-wide text-gray-800">Hi👋, this is Leonardo Elish</div>
            
            <div className="mt-8 text-[15px] leading-relaxed text-gray-700 space-y-2 text-left">
              <p>🎓 A high school student</p>
              <p>💻 Passionate about open-source projects.</p>
              <p>⚙️ Skilled in C++, networking, Qt, Server, Python....</p>
              <p>🤝 Strong team player with real-world dev experience.</p>
              <p>🚀 Aspiring to become a senior systems architect.</p>
              <p>🌱 Currently learning about AI and machine learning.</p>
              <p>💬 Open to collaboration and knowledge sharing.</p>
            </div>
          </div>
        )}

        {/* ---------- Profile > Github Stats ---------- */}
        {settingsTab === 'Profile' && settingsTab2 === 'Github Stats' && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in duration-500">
            <img src="https://github-readme-stats-eta-one-38.vercel.app/api?username=hesphoros&show_icons=true&theme=default&hide_border=true&count_private=true" alt="GitHub Stats" className="w-[450px] drop-shadow-sm rounded-xl" />
            <img src="https://github-readme-stats-eta-one-38.vercel.app/api/top-langs/?username=hesphoros&layout=compact&hide_border=true&langs_count=8" alt="Top Languages" className="w-[350px] drop-shadow-sm rounded-xl" />
          </div>
        )}

        {/* ---------- Profile > Contributions ---------- */}
        {settingsTab === 'Profile' && settingsTab2 === 'Contributions' && (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <div className="text-2xl font-medium mb-8 text-gray-800">GitHub 贡献图</div>
            <img src="https://ghchart.rshah.org/hesphoros" alt="GitHub Contributions" className="w-[700px] max-w-full" />
            
            <a href="https://github.com/hesphoros" target="_blank" rel="noreferrer" 
               className="mt-10 px-6 py-3 bg-[#24292F] hover:bg-black text-white rounded-xl font-medium transition-colors flex items-center gap-3 shadow-md">
              <svg height="22" width="22" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              访问 GitHub 主页
            </a>
            <div className="mt-3 text-gray-400 text-sm">@hesphoros</div>
          </div>
        )}

        {/* ---------- Profile > CodeWars ---------- */}
        {settingsTab === 'Profile' && settingsTab2 === 'CodeWars' && (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md ring-4 ring-blue-50 mb-8">
              <img src="/img/images/head2.png" alt="Leonardo Elish" className="w-full h-full object-cover" />
            </div>
            <img src="https://www.codewars.com/users/hesphoros/badges/large" alt="CodeWars Badge" className="w-[400px] drop-shadow-sm" />
          </div>
        )}

        {/* ---------- Skills > Badges ---------- */}
        {settingsTab === 'Skills' && settingsTab2 === 'Badges' && (
          <div className="flex flex-col items-center justify-center min-h-full animate-in fade-in duration-500">
            <div className="text-xl font-normal mb-4 text-gray-700">Frameworks</div>
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mb-8">
              <img src="https://img.shields.io/badge/fastapi-%23009688.svg?style=flat&logo=fastapi&logoColor=white" alt="FastAPI" />
              <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=flat&logo=vue.js&logoColor=%234FC08D" alt="Vue" />
              <img src="https://img.shields.io/badge/Flask-%23000.svg?style=flat&logo=flask&logoColor=white" alt="Flask" />
              <img src="https://img.shields.io/badge/Qt-%232E8BC0.svg?style=flat&logo=Qt&logoColor=white" alt="Qt" />
              <img src="https://img.shields.io/badge/spring-%236DB33F.svg?style=flat&logo=spring&logoColor=white" alt="Spring" />
              <img src="https://img.shields.io/badge/Node.js-%2343853D.svg?style=flat&logo=Node.js&logoColor=white" alt="Node" />
              <img src="https://img.shields.io/badge/Express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB" alt="Express" />
              <img src="https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=flat&logo=TensorFlow&logoColor=white" alt="TF" />
              <img src="https://img.shields.io/badge/numpy-%23013243.svg?style=flat&logo=numpy&logoColor=white" alt="Numpy" />
              <img src="https://img.shields.io/badge/pandas-%23150458.svg?style=flat&logo=pandas&logoColor=white" alt="Pandas" />
              <img src="https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=flat&logo=scikit-learn&logoColor=white" alt="Sklearn" />
            </div>

            <div className="text-xl font-normal mb-4 text-gray-700">Tools</div>
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mb-8">
              <img src="https://img.shields.io/badge/-Redis-black?style=flat&logo=Redis" alt="Redis" />
              <img src="https://img.shields.io/badge/-PostgreSQL-black?style=flat&logo=PostgreSQL" alt="PostgreSQL" />
              <img src="https://img.shields.io/badge/-MongoDB-black?style=flat&logo=MongoDB" alt="MongoDB" />
              <img src="https://img.shields.io/badge/-SQLite-black?style=flat&logo=SQLite" alt="SQLite" />
              <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=flat&logo=mysql&logoColor=white" alt="MySQL" />
              <img src="https://img.shields.io/badge/oracle-%23F00000.svg?style=flat&logo=oracle&logoColor=white" alt="Oracle" />
              <img src="https://img.shields.io/badge/-Celery-black?style=flat&logo=celery" alt="Celery" />
              <img src="https://img.shields.io/badge/-ElasticSearch-005571?style=flat&logo=elasticsearch" alt="ES" />
              <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white" alt="Docker" />
              <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=flat&logo=nginx&logoColor=white" alt="Nginx" />
            </div>

            <div className="text-xl font-normal mb-4 text-gray-700">Others</div>
            <div className="flex flex-wrap justify-center gap-2 max-w-xl">
              <img src="https://img.shields.io/badge/-Linux-black?style=flat&logo=Linux" alt="Linux" />
              <img src="https://img.shields.io/badge/-Debian-007CFF?style=flat&logo=debian" alt="Debian" />
              <img src="https://img.shields.io/badge/-Centos-262577?style=flat&logo=Centos" alt="Centos" />
              <img src="https://img.shields.io/badge/-Raspberry%20Pi-C51A4A?style=flat&logo=Raspberry-Pi" alt="Raspberry Pi" />
              <img src="https://img.shields.io/badge/-Git-black?style=flat&logo=Git" alt="Git" />
              <img src="https://img.shields.io/badge/-Jupyter-black?style=flat&logo=Jupyter" alt="Jupyter" />
              <img src="https://img.shields.io/badge/-VSCode-black?style=flat&logo=Visual-Studio-Code" alt="VSCode" />
              <img src="https://img.shields.io/badge/-Postman-black?style=flat&logo=Postman" alt="Postman" />
            </div>
          </div>
        )}

        {/* ---------- Skills > And Some Else ---------- */}
        {settingsTab === 'Skills' && settingsTab2 === 'And Some Else' && (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <img src="public/img/images/holo.gif" alt="Holo Anime" className="w-64 rounded-xl" />
            <div className="text-lg mt-6 text-gray-700 font-medium">Thanks for watching, hope you enjoy it.</div>
          </div>
        )}

        {/* ---------- Wallpaper > Video ---------- */}
        {settingsTab === 'Wallpaper' && settingsTab2 === 'Video' && (
          <div className="w-full animate-in fade-in duration-500">
            
            <div className="text-xl font-bold mb-6">启用动态壁纸</div>
            
            <div className="flex items-center justify-between mb-8 p-4 bg-[#F8F9FA] rounded-2xl border border-gray-100">
              <div>
                <div className="font-semibold text-gray-800">启用动态壁纸</div>
                <div className="text-sm text-gray-500 mt-0.5">使用视频作为桌面背景</div>
              </div>
              <div 
                onClick={toggleVideoWallpaper} 
                className={`w-12 h-[26px] rounded-full relative cursor-pointer transition-colors duration-300 ${useVideoWallpaper ? 'bg-[#007AFF]' : 'bg-gray-300'}`}
              >
                <div className={`w-[22px] h-[22px] bg-white rounded-full absolute top-[2px] transition-all duration-300 shadow-sm ${useVideoWallpaper ? 'left-[24px]' : 'left-[2px]'}`} />
              </div>
            </div>
            
            <div className="text-[15px] font-semibold text-gray-800 mb-4">选择壁纸</div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {videoWallpapers.map((wallpaper, index) => (
                <div 
                  key={index}
                  onClick={() => setWallpaperVideoIndex(index)}  // 🌟 修改为全局的 Setter
                  className={`relative aspect-[16/10] cursor-pointer rounded-xl overflow-hidden transition-all duration-200 group bg-gray-100 ${
                    wallpaperVideoIndex === index // 🌟 统一使用 wallpaperVideoIndex
                      ? 'ring-4 ring-[#007AFF] ring-offset-1 shadow-md' 
                      : 'border border-gray-200 hover:shadow-md'
                  }`}
                >
                  <video 
                    src={wallpaper.src} 
                    preload="metadata"
                    className="w-full h-full object-cover" 
                    muted loop playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-2 left-0 right-0 text-white text-[12px] font-medium text-center px-2 truncate pointer-events-none">
                    {wallpaper.name}
                  </div>

                  {wallpaperVideoIndex === index && ( // 🌟 统一使用 wallpaperVideoIndex
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#007AFF] rounded-full flex items-center justify-center shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">当前壁纸</div>
              <div className="text-sm font-semibold text-gray-800">
                {videoWallpapers[wallpaperVideoIndex]?.name || '未知'} {/* 🌟 统一使用 wallpaperVideoIndex */}
              </div>
            </div>
            
          </div>
        )}

        {/* ---------- Resume ---------- */}
        {settingsTab === 'Resume' && (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <div className="text-4xl tracking-wider text-gray-300 font-light"> Coming Soon </div>
          </div>
        )}

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
      `}</style>
    </div>
  );
}