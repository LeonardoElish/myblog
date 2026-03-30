import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useStore } from "~/stores";

interface AppWindowProps {
  id: string;
  title: string;
  width?: number;
  height?: number;
  z: number;
  min: boolean;
  max: boolean;
  focus: (id: string) => void;
  close: (id: string) => void;
  setMin: (id: string) => void;
  setMax: (id: string) => void;
  children: React.ReactNode;
}

const TrafficLights = ({ id, close, setMax, setMin }: Partial<AppWindowProps>) => (
  <div 
    className="cancel-drag absolute left-0 flex space-x-2 pl-3 z-50"
    onPointerDown={(e) => e.stopPropagation()}
    onTouchStart={(e) => e.stopPropagation()}
    onMouseDown={(e) => e.stopPropagation()}
  >
    <button 
      className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 shadow-inner" 
      onClick={() => close?.(id!)} 
      onTouchEnd={(e) => { e.preventDefault(); close?.(id!); }} 
    />
    <button 
      className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 shadow-inner" 
      onClick={() => setMin?.(id!)} 
      onTouchEnd={(e) => { e.preventDefault(); setMin?.(id!); }}
    />
    <button 
      className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 shadow-inner" 
      onClick={() => setMax?.(id!)} 
      onTouchEnd={(e) => { e.preventDefault(); setMax?.(id!); }}
    />
  </div>
);

export default function AppWindow(props: AppWindowProps) {
  const dockSize = useStore((state) => state.dockSize) || 50;
  const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  const TOP_BAR_HEIGHT = 28; 
  const DOCK_HEIGHT = dockSize + 20;

  useEffect(() => {
    const handleResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initWidth = Math.min(winSize.w, Number(props.width) || 800);
  const initHeight = Math.min(winSize.h, Number(props.height) || 550);

  const [state, setState] = useState({
    width: initWidth,
    height: initHeight,
    x: (winSize.w - initWidth) / 2 + (Math.random() * 40 - 20),
    y: (winSize.h - initHeight - dockSize) / 2 + (Math.random() * 40 - 20)
  });

  if (props.min) return null;

  const isMax = props.max;

  return (
    <Rnd
      size={{ 
        width: isMax ? winSize.w : state.width, 
        height: isMax ? (winSize.h - TOP_BAR_HEIGHT - DOCK_HEIGHT) : state.height 
      }} 
      position={{ 
        x: isMax ? 0 : state.x, 
        y: isMax ? TOP_BAR_HEIGHT : state.y 
      }}
      onDragStop={(e, d) => !isMax && setState(prev => ({ ...prev, x: d.x, y: d.y }))}
      onResizeStop={(e, dir, ref, delta, pos) => {
        setState({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...pos });
      }}
      dragHandleClassName="window-bar"
      cancel=".cancel-drag" 
      disableDragging={isMax}
      enableResizing={!isMax}
      style={{ zIndex: props.z, position: 'fixed' }}
      
    >
      <div 
        //className={`w-full h-full flex flex-col overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-black/10 dark:border-white/10 ${isMax ? 'rounded-none' : 'rounded-xl'} pointer-events-auto`}
        className={`w-full h-full flex flex-col overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-black/10 dark:border-white/10 rounded-xl pointer-events-auto`}
        onPointerDownCapture={() => props.focus(props.id)}
      >
        <div 
          className="window-bar touch-none flex-none relative h-8 flex items-center justify-center bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-black/10 cursor-default"
          onDoubleClick={() => props.setMax(props.id)}
        >
          <TrafficLights id={props.id} close={props.close} setMax={props.setMax} setMin={props.setMin} />
          <span className="font-semibold text-[13px] text-gray-700 dark:text-gray-300 pointer-events-none select-none">{props.title}</span>
        </div>
        
        <div className="flex-grow w-full relative overflow-auto bg-white dark:bg-gray-900 cancel-drag">
          {props.children}
        </div>
        
      </div>
    </Rnd>
  );
}