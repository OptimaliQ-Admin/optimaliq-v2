import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  },
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
    });
  },
  warning: (message: string) => {
    toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeeba',
      },
    });
  },
  info: (message: string) => {
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      style: {
        background: '#cce5ff',
        color: '#004085',
        border: '1px solid #b8daff',
      },
    });
  }
}; 