import { FC, createContext, useEffect, useRef, useState } from "react";
import { BUIComponentType } from "../types/component";
import { Notification } from "../components/Notification/Notification";
import { Toast } from "../components/Toast/Toast";

export interface NotificationType {
  title: React.ReactNode;
  node: React.ReactNode;
  id: number;
  type: BUIComponentType;
}

export interface ToastType {
  node: React.ReactNode;
  id: number;
  type: BUIComponentType;
}

export type configType = {
  title: React.ReactNode;
  msg: React.ReactNode;
};

export type Methods = (config: configType, type: BUIComponentType, position?: string) => void;

export type ToastMthods = (msg: string, type: BUIComponentType) => void;

interface NoticeContextProps {
  notificationList: NotificationType[];
  setNotificationList: (item: NotificationType[]) => void;
  open: Methods;
  remove: (id: number) => void;
  toastList: ToastType[];
  setToastList: (item: ToastType[]) => void;
  openToast: ToastMthods;
  removeToast: (id: number) => void;
  position: string;
}

const NoticeContext = createContext<NoticeContextProps>({
  notificationList: [],
  setNotificationList: () => {},
  open: () => {
    console.warn("not methods");
  },
  remove: () => {},
  toastList: [],
  setToastList: () => {},
  openToast: () => {
    console.warn("not methods");
  },
  removeToast: () => {},
  position: "leftBottom"
});

const NoticeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationList, setNotificationList] = useState<NotificationType[]>([]);

  const [position, setPosition] = useState<string>("leftBottom");

  const [toastList, setToastList] = useState<ToastType[]>([]);

  const [visible, setVisible] = useState(false);

  const key = useRef(0);

  const toastKey = useRef(0);

  const open = (config: configType, type: BUIComponentType, position?: string) => {
    setNotificationList((list) => [
      ...list,
      {
        title: config.title,
        node: config.msg,
        id: key.current,
        type: type
      }
    ]);
    key.current += 1;
    position && setPosition(position);
  };

  const remove = (id: number) => {
    setNotificationList((val) => val.filter((item) => item.id !== id));
  };

  const openToast = (config: string, type: BUIComponentType) => {
    setToastList((list) => [
      ...list,
      {
        node: config,
        id: toastKey.current,
        type: type
      }
    ]);
    toastKey.current += 1;
  };

  const removeToast = (id: number) => {
    setToastList((val) => val.filter((item) => item.id !== id));
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <NoticeContext.Provider
      value={{
        notificationList,
        setNotificationList,
        open,
        remove,
        toastList,
        setToastList,
        openToast,
        removeToast,
        position,
      }}>
      {children}
      {visible && <Notification />}
      {visible && <Toast/>}
    </NoticeContext.Provider>
  );
};

export { NoticeContext, NoticeProvider };
