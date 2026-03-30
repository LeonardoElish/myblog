import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";
import Messages from "~/components/apps/Messages";
import WindowSettings from '~/components/WindowBasic/WindowSettings';
import Bear from "~/components/apps/Bear";
import Typora from "~/components/apps/Typora";
import Safari from "~/components/apps/Safari";
import VSCode from "~/components/apps/VSCode";
import FaceTime from "~/components/apps/FaceTime";
import Terminal from "~/components/apps/Terminal";
import Notifications from "~/components/apps/Notification";
import Explorer from "~/components/apps/Explorer";
import Finder from "~/components/apps/Finder";
import WebInWeb from '~/components/apps/webinweb';
const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    desktop: true,
    show: false,
    img: "img/icons/launchpad.png"
  },
  {
    id: "bear",
    title: "Bear",
    desktop: true,
    width: 860,
    height: 500,
    show: true,
    y: -40,
    img: "img/icons/bear.png",
    content: <Bear />
  },
  {
    id: "typora",
    title: "Typora",
    desktop: true,
    width: 980,
    height: 580,
    show: false,
    y: -20,
    img: "img/icons/typora.png",
    content: <Typora />
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    show: false,
    width: 1024,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "img/icons/safari.png",
    content: <Safari />
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    show: false,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "img/icons/vscode.png",
    content: <VSCode />
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    show: false,
    img: "img/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: <FaceTime />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    show: false,
    img: "img/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "github",
    title: "Github",
    desktop: false,
    show: false,
    img: "img/icons/github.png",
    link: "https://github.com/LeonardoElish"
  },
  {
  id: "messages",
  title: "Messages",
  desktop: true,
  show: false,
  width: 700,
  height: 600,
  img: "img/icons/messages.png", 
  content: <Messages />
  },
  {
    id: "Settings",
    title: "Settings",
    desktop: true,
    show: false, 
    width: 900,
    height: 500,
    img: "img/icons/settings.png",
    content: <WindowSettings />
  },
  {
    id: "notifications",
    title: "Notifications",
    desktop: true,
    show: false,
    width: 650, // 稍微窄一点看起来更像通知中心
    height: 550,
    img: "img/icons/notifications.png", 
    content: <Notifications /> // 内部逻辑全在 Notifications.tsx 里处理好了
  },
  {
    id: "Explorer",
    title: "Finder",
    desktop: true,
    show: false,
    width: 600,
    height: 400,
    img: "img/icons/explorer.png",
    content: <Explorer />
  },
  {
    id: "Finder", // 
    title: "资源库",
    desktop: true,
    show: false,
    width: 700,
    height: 500,
    img: "img/icons/taskview.png",
    content: <Finder />
  },
  {
    id: 'webinweb',
    title: 'Web in Web',
    width: 1200, // 可以稍微给宽一点，适合浏览网页
    height: 800,
    desktop: true,
    show: false,
    img: "img/icons/webinweb.png",
    content: <WebInWeb />, 
  },
];

export default apps;
