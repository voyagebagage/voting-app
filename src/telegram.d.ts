// src/telegram.d.ts

import { off } from "process";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
}
interface ThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  [key: string]: string;
}

interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: string;
    hash: string;
    query_id?: string;
    [key: string]: any; // Allow for additional properties
  };
  initData: string;
  colorScheme: "light" | "dark";
  themeParams: ThemeParams;
  isVersionAtLeast: (version: string) => boolean;
  showPopup: (params: {
    title: string;
    message: string;
    buttons: {
      text: string;
      type?: "alert" | "confirm";
      // onClick: () => void;
    }[];
  }) => void;
  ready: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  sendData: (data: string) => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    update: (params: { text: string; onClick: () => void }) => void;
    show: () => void;
    onClick: (params: () => void) => void;
    hide: () => void;
    offClick: (params: () => void) => void;
    setText: (params: string) => void;
  };
  SidebarButton: {
    update: (params: { text: string; onClick: () => void }) => void;
    show: () => void;
    onClick: () => void;
    hide: () => void;
  };
}

// onEvent: (eventType: string, callback: () => void) => void;

declare module "@twa-dev/sdk" {
  const WebApp: TelegramWebApp;
  export default WebApp;
}
