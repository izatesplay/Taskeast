import { User, Task, Notification } from './types';

export function getDynamicUsers(): User[] {
  if (typeof window === 'undefined') return mockUsers;
  const saved = localStorage.getItem('callcenter_users');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
  }
  return mockUsers.map(u => ({
    ...u,
    password: u.id === 'user_1' ? '1234' : '1111'
  }));
}

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'سارا رضایی',
    role: 'مدیر شیفت کالسنتر',
    initials: 'س‌ر',
    avatarColor: 'bg-indigo-500',
    textColor: 'text-indigo-100',
  },
  {
    id: 'user_2',
    name: 'علیرضا حسینی',
    role: 'کارشناس بخش پشتیبانی',
    initials: 'ع‌ح',
    avatarColor: 'bg-emerald-500',
    textColor: 'text-emerald-100',
  },
  {
    id: 'user_3',
    name: 'مهسا احمدی',
    role: 'مسئول پیگیری شکایات',
    initials: 'م‌ا',
    avatarColor: 'bg-amber-500',
    textColor: 'text-amber-100',
  },
  {
    id: 'user_4',
    name: 'امید نجفی',
    role: 'کارشناس فروش تلفنی',
    initials: 'ا‌ن',
    avatarColor: 'bg-rose-500',
    textColor: 'text-rose-100',
  },
  {
    id: 'user_5',
    name: 'حسام رمضانی',
    role: 'سوپروایزر فنی',
    initials: 'ح‌ر',
    avatarColor: 'bg-cyan-500',
    textColor: 'text-cyan-100',
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task_1',
    title: 'سیستم ثبت شکایات دچار اختلال شده است',
    description: 'بعضی از اپراتورها هنگام ثبت بلیت شکایات جدید با خطای سرور ۵۰۰ مواجه می‌شوند. باید با دپارتمان فنی جهت رفع اشکال هماهنگ شود.',
    status: 'todo',
    priority: 'urgent',
    assignedUsers: ['user_1', 'user_5'],
    dueDate: '1405-03-10',
    createdAt: '1405-03-01 09:30',
    notes: [
      {
        id: 'n_1',
        authorName: 'سارا رضایی',
        content: 'تعداد بلیت‌های ثبت‌نشده در حال افزایش است. لطفاً حسام رمضانی سریعاً بررسی کند.',
        createdAt: '1405-03-01 09:45'
      }
    ]
  },
  {
    id: 'task_2',
    title: 'تماس خروجی مشتری شاکی (VIP شماره ۸۴۹)',
    description: 'جناب آقای محمدی از تاخیر ارسال فاکتور گله‌مند بودند. قرار شد شیفت صبح با ایشان تماس گرفته و جبران خسارت ارائه شود.',
    status: 'in_progress',
    priority: 'high',
    assignedUsers: ['user_3', 'user_2'],
    dueDate: '1405-03-08',
    createdAt: '1405-03-02 10:15',
    notes: [
      {
        id: 'n_2',
        authorName: 'مهسا احمدی',
        content: 'صحبت اولیه انجام شد اما هنوز بابت ارسال نامطمئن است؛ پیگیری جدی نیاز دارد.',
        createdAt: '1405-03-02 11:00'
      }
    ]
  },
  {
    id: 'task_3',
    title: 'بررسی افت ترافیک ورودی تماس‌ها بین ساعت ۱۰ الی ۱۱',
    description: 'شاهد ۵۰٪ ریزش تماس‌های مشتریان در این بازه زمانی بوده‌ایم. خطوط مخابراتی منطقه غرب نیاز به استعلام وضعیت دارند.',
    status: 'todo',
    priority: 'medium',
    assignedUsers: ['user_1', 'user_5', 'user_4'],
    dueDate: '1405-03-15',
    createdAt: '1405-03-03 14:00',
    notes: []
  },
  {
    id: 'task_4',
    title: 'تدوین اسکریپت جدید مذاکره فروش بیمه تکمیلی',
    description: 'پایه و قالب صحبت با مشتریان هدف بازبینی شده و باید در مرکز تماس پیاده‌سازی شود تا تارگت فروش فصل تامین گردد.',
    status: 'done',
    priority: 'low',
    assignedUsers: ['user_4', 'user_1'],
    dueDate: '1405-03-05',
    createdAt: '1405-02-28 08:00',
    notes: [
      {
        id: 'n_3',
        authorName: 'امید نجفی',
        content: 'پیش‌نویس نهایی تایید شد و تاییدیه سوپروایزر فروش اخذ گردید.',
        createdAt: '1405-03-01 16:30'
      }
    ]
  },
  {
    id: 'task_5',
    title: 'بهبود شاخص FCR (پاسخگویی در اولین تماس)',
    description: 'نرخ FCR در بخش شکایات در حال حاضر ۶۸٪ است. تارگت هدف این فصل حداقل ۷۵٪ است. برگزاری جلسه همفکری کادر مدیریت.',
    status: 'in_progress',
    priority: 'high',
    assignedUsers: ['user_1', 'user_2', 'user_3'],
    dueDate: '1405-03-12',
    createdAt: '1405-03-02 15:40',
    notes: []
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif_1',
    title: 'تسک جدید اختصاص یافته',
    message: 'وظیفه "بررسی افت ترافیک ورودی تماس‌ها" به شما اختصاص یافت.',
    createdAt: '۱۰ دقیقه پیش',
    read: false,
    type: 'info'
  },
  {
    id: 'notif_2',
    title: 'تغییر اولویت فوری',
    message: 'اولویت تسک "سیستم ثبت شکایات" به فوری ارتقا یافت.',
    createdAt: '۱ ساعت پیش',
    read: false,
    type: 'urgent'
  },
  {
    id: 'notif_3',
    title: 'پیام جدید',
    message: 'سارا رضایی بر روی تسک "تماس خروجی مشتری" یادداشت گذاشت.',
    createdAt: 'دیروز',
    read: true,
    type: 'success'
  }
];

// Helper to simulate calling events / ticket updates in call centers
export interface CallCenterEvent {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  triggerTask?: Partial<Task>;
}

export const callCenterRandomEvents: CallCenterEvent[] = [
  {
    title: '📞 تماس ورودی اورژانسی',
    message: 'یک بلیت فوری ثبت خسارت از پنل کاربری آقای اکبری ایجاد گردید.',
    type: 'urgent',
    triggerTask: {
      title: 'پیگیری خسارت حساب کاربری آقای اکبری',
      description: 'قطع ناگهانی پنل کاربران هنگام فرایند درگاه پرداخت و کسر پول بدون خرید نهایی.',
      priority: 'urgent'
    }
  },
  {
    title: '⚡ قطعی شبکه مخابراتی غرب',
    message: 'گزارش اختلال سراسری در یکی از ترانک‌های خطوط گویای کالسنتر گزارش شد.',
    type: 'warning',
    triggerTask: {
      title: 'رفع قطعی ترانک تلفن گویا غرب کشور',
      description: 'استعلام سرورهای ویپ و هماهنگی مجدد با مخابرات مرکزی برای خط گویای پیش فرض ورودی.',
      priority: 'high'
    }
  },
  {
    title: '📈 رکورد شکنی تماس‌ها',
    message: 'نرخ پاسخگویی همزمان به ۱۲۴ تماس در دقیقه رسید؛ خسته نباشید به تیم!',
    type: 'success'
  },
  {
    title: '👥 نوبت شیفت شبانه',
    message: 'لیست تعویض شیفت همکاران برای هفته آتی توسط مدیر شیفت ثبت شد.',
    type: 'info'
  },
  {
    title: '⚠️ تاخیر در پاسخگویی مشتریان',
    message: 'نرخ انتظار در صف انتظار بخش پشتیبانی به ۵ دقیقه رسیده است.',
    type: 'warning'
  }
];
