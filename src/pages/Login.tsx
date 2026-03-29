import React, { useState, useEffect, useRef } from "react";
import { wallpapers, user } from "~/configs";
import { useStore } from "~/stores";
import type { MacActions } from "~/types";

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Login(props: MacActions) {
  // --- 状态管理 ---
  const [password, setPassword] = useState("");
  const [showMiddle, setShowMiddle] = useState(true); // true=登录框, false=电源按钮菜单
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [loginLocked, setLoginLocked] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [time, setTime] = useState(new Date());
  const dark = useStore((state) => state.dark);

  const PASSWORD_ANSWER = user.password || "password"; // 答案

  // --- 时钟更新 ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const PrefixZero = (num: number, n: number) => (Array(n).join('0') + num).slice(-n);

  // --- 登录核心逻辑 (还原了你的自动打字彩蛋) ---
  const handleLogin = async () => {
    if (loginLocked) return;

    if (password === PASSWORD_ANSWER) {
      // 密码正确：显示加载动画，延迟进入桌面
      setLoginLocked(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        props.setLogin(true);
      }, 1800);
    } else if (password === "") {
      // 🌟 彩蛋：密码为空时，自动打字！
      setLoginLocked(true);
      let currentPw = "";
      for (let i = 0; i < PASSWORD_ANSWER.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        currentPw += PASSWORD_ANSWER[i];
        setPassword(currentPw);
      }
      // 打完字后触发登录
      setTimeout(() => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          props.setLogin(true);
        }, 1800);
      }, 200);
    } else {
      // 密码错误：触发震动
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 800); // 800ms 后停止震动
      }, 1000); // 假装思考了 1 秒
    }
  };

  const keyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  const handlePowerMenuToggle = () => {
    setShowMiddle(!showMiddle);
    setLoginLocked(!showMiddle); // 如果显示了电源菜单，锁定登录逻辑
  };

  // --- 格式化时间 ---
  const dateHour = PrefixZero(time.getHours(), 2);
  const dateMinute = PrefixZero(time.getMinutes(), 2);
  const dateYear = time.getFullYear();
  const dateMonth = time.getMonth() + 1;
  const dateDate = time.getDate();
  const dateWeekdayDisplay = weekdays[time.getDay()];

  return (
    <div className="w-screen h-screen select-none overflow-hidden relative">
      
      {/* --- 1. 背景层 (带渐变毛玻璃) --- */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
        style={{ 
          backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
          // 还原你 Vue 里的渐变背景效果
          boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,0.2)' 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* --- 2. 虚拟键盘层 (如果有的话) --- */}
      {showKeyboard && (
        <div className="absolute inset-0 flex flex-col justify-center items-center z-60 bg-black/40 backdrop-blur-sm">
          <div className="h-[60vh]"></div>
          {/* <KeyBoard /> 这里放你未来移植的 React 版 Keyboard 组件 */}
          <div className="text-white bg-white/10 p-4 rounded-xl backdrop-blur-md">
            虚拟键盘组件占位符
          </div>
        </div>
      )}

      {/* --- 3. 主内容区 --- */}
      <div className="relative z-4 flex flex-col w-full h-full">
        
        {/* 头部：时间 */}
        <div className="w-full h-32 flex-none flex flex-col items-center justify-center pt-10">
          <div className="text-6xl tracking-wider font-light text-white drop-shadow-md">
            {dateHour}:{dateMinute}
          </div>
          <div className="mt-2 text-sm text-white/90 drop-shadow">
            {dateYear}/{dateMonth}/{dateDate} {dateWeekdayDisplay}
          </div>
        </div>

        {/* 中间：登录框 或 电源选项 */}
        <div className="w-full flex-grow flex flex-col justify-center items-center" style={{ minHeight: '300px' }}>
          
          {showMiddle ? (
            // 模式 A：登录框
            <div className="flex flex-col items-center">
              <div className="w-72 h-44 rounded-2xl flex flex-col items-center justify-end pb-4 relative backdrop-blur-md border border-white/10 shadow-xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                
                {/* 悬浮在框顶部的头像 */}
                <div className="absolute -top-12 w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
                
                <div className="text-2xl tracking-wide text-white font-medium mt-14">
                  {user.name}
                </div>

                {/* 密码输入区 */}
                <div className="w-full px-6 mt-4 relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={keyPress}
                    disabled={loginLocked}
                    placeholder="Enter your password"
                    className="w-full h-10 rounded-lg text-center text-white placeholder-white/70 outline-none transition-all focus:ring-2 focus:ring-[#0077e6]"
                    style={{ backgroundColor: 'rgba(180,190,220,0.35)' }}
                    autoFocus
                  />
                  
                  {/* 你的那个 Custom Infinite Loading Bar 可以放这 */}
                  {isLoading && (
                    <div className="absolute bottom-1 left-6 right-6 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-1/2 animate-bounce"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* 箭头按钮 (带错误震动) */}
              <button 
                onClick={handleLogin}
                className={`w-12 h-12 mt-4 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center outline-none transition-all shadow-lg ${isShaking ? 'animate-shake' : ''}`}
              >
                <span className="i-bi:arrow-right text-white text-xl" />
              </button>
            </div>
          ) : (
            // 模式 B：电源菜单
            <div className="h-full w-full flex flex-row justify-evenly items-center max-w-[650px] min-w-[300px] animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-white cursor-pointer group" onClick={props.shutMac}>
                <div className="w-16 h-16 rounded-full bg-black/40 group-hover:bg-black/60 flex justify-center items-center backdrop-blur-md transition-all">
                  <span className="i-ri:shut-down-line text-3xl" />
                </div>
                <span className="mt-3">Shut Down</span>
              </div>
              <div className="flex flex-col items-center text-white cursor-pointer group" onClick={props.restartMac}>
                <div className="w-16 h-16 rounded-full bg-black/40 group-hover:bg-black/60 flex justify-center items-center backdrop-blur-md transition-all">
                  <span className="i-ri:restart-line text-3xl" />
                </div>
                <span className="mt-3">Restart</span>
              </div>
              <div className="flex flex-col items-center text-white cursor-pointer group" onClick={props.sleepMac}>
                <div className="w-16 h-16 rounded-full bg-black/40 group-hover:bg-black/60 flex justify-center items-center backdrop-blur-md transition-all">
                  <span className="i-gg:sleep text-3xl" />
                </div>
                <span className="mt-3">Sleep</span>
              </div>
            </div>
          )}

        </div>

        {/* 底部 Footer */}
        <div className="w-full h-32 flex-none flex items-end justify-between px-8 pb-8 z-5">
          
          {/* 左侧：Logo & OS Name */}
          <div className="flex items-center space-x-4">
             {/* 如果你有 zack-modified.png 就留着，没有可以用文字代替 */}
             {/* <img src="/images/zack-modified.png" alt="logo" className="w-10 h-10 opacity-80" /> */}
             <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
               <span className="i-bi:apple text-white/80 text-xl" />
             </div>
             <div className="text-white/60 font-medium tracking-wide">
               Leonardo Elish OS
             </div>
          </div>

          {/* 右侧：键盘 & 电源切换键 */}
          <div className="flex space-x-6">
            <button 
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md flex items-center justify-center outline-none transition-all border border-white/5"
            >
              <span className="i-bi:keyboard text-white text-xl" />
            </button>
            <button 
              onClick={handlePowerMenuToggle}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md flex items-center justify-center outline-none transition-all border border-white/5"
            >
              <span className="i-bi:power text-white text-xl" />
            </button>
          </div>

        </div>

      </div>

      {/* 注入一个简单的震动动画 CSS */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

    </div>
  );
}