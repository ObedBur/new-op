import { useMemo } from 'react';
import { useSettings } from '@/context/SettingsContext';
import {
  getTranslationValue,
  resolveLanguage,
  type AppLanguage,
} from '@/i18n/translations';

interface AdminTranslations {
  nav: {
    all: string;
    dashboard: string;
    vendors: string;
    products: string;
    users: string;
    reports: string;
    settings: string;
    reports_problem: string;
    support: string;
    logout: string;
  };
  header: {
    search_placeholder: string;
    notifications: string;
    mark_read: string;
  };
  dashboard: {
    stats: {
      sales: string;
      new_vendors: string;
      active_products: string;
      reports: string;
    };
    charts: {
      price_evolution: string;
      rice: string;
      sugar: string;
    };
    validation: {
      title: string;
      accept: string;
      refuse: string;
      empty: string;
      search_empty: string;
    };
    recent_activity: {
      title: string;
      view_all: string;
    };
    quick_access: {
      title: string;
      manage_vendors: string;
    };
    products: {
      title: string;
      all_markets: string;
      headers: {
        product: string;
        seller: string;
        price: string;
        market: string;
        update: string;
        actions: string;
      };
      pagination: {
        showing: string;
        of: string;
        products: string;
        prev: string;
        next: string;
      };
      empty: string;
      edit: string;
    };
  };
  vendors: {
    found: string;
    filter_pending: string;
    filter_active: string;
    filter_banned: string;
    pending_warning: string;
    pending_desc: string;
    process_now: string;
    details: string;
    reactivate: string;
    status_active: string;
    status_suspended: string;
    owner: string;
    banned: string;
  };
  settings: {
    title: string;
    theme: string;
    lang: string;
    font: string;
    apply: string;
    applying: string;
    success: string;
    themes: {
      light: string;
      dark: string;
      emerald: string;
      ocean: string;
    };
    fonts: {
      small: string;
      medium: string;
      large: string;
    };
    infoSubtitle: string;
  };
}

export const useAdminTranslation = (languageOverride?: AppLanguage) => {
  const { language: settingsLanguage } = useSettings();
  const language = resolveLanguage(languageOverride ?? settingsLanguage);

  const t = useMemo<AdminTranslations>(() => ({
    nav: {
      all: getTranslationValue(language, 'admin.nav.all') ?? 'admin.nav.all',
      dashboard:
        getTranslationValue(language, 'admin.nav.dashboard') ??
        'admin.nav.dashboard',
      vendors:
        getTranslationValue(language, 'admin.nav.vendors') ?? 'admin.nav.vendors',
      products:
        getTranslationValue(language, 'admin.nav.products') ??
        'admin.nav.products',
      users: getTranslationValue(language, 'admin.nav.users') ?? 'admin.nav.users',
      reports:
        getTranslationValue(language, 'admin.nav.reports') ?? 'admin.nav.reports',
      settings:
        getTranslationValue(language, 'admin.nav.settings') ??
        'admin.nav.settings',
      reports_problem:
        getTranslationValue(language, 'admin.nav.reports_problem') ??
        'admin.nav.reports_problem',
      support:
        getTranslationValue(language, 'admin.nav.support') ?? 'admin.nav.support',
      logout:
        getTranslationValue(language, 'admin.nav.logout') ?? 'admin.nav.logout',
    },
    header: {
      search_placeholder:
        getTranslationValue(language, 'admin.header.search_placeholder') ??
        'admin.header.search_placeholder',
      notifications:
        getTranslationValue(language, 'admin.header.notifications') ??
        'admin.header.notifications',
      mark_read:
        getTranslationValue(language, 'admin.header.mark_read') ??
        'admin.header.mark_read',
    },
    dashboard: {
      stats: {
        sales:
          getTranslationValue(language, 'admin.dashboard.stats.sales') ??
          'admin.dashboard.stats.sales',
        new_vendors:
          getTranslationValue(language, 'admin.dashboard.stats.new_vendors') ??
          'admin.dashboard.stats.new_vendors',
        active_products:
          getTranslationValue(language, 'admin.dashboard.stats.active_products') ??
          'admin.dashboard.stats.active_products',
        reports:
          getTranslationValue(language, 'admin.dashboard.stats.reports') ??
          'admin.dashboard.stats.reports',
      },
      charts: {
        price_evolution:
          getTranslationValue(language, 'admin.dashboard.charts.price_evolution') ??
          'admin.dashboard.charts.price_evolution',
        rice:
          getTranslationValue(language, 'admin.dashboard.charts.rice') ??
          'admin.dashboard.charts.rice',
        sugar:
          getTranslationValue(language, 'admin.dashboard.charts.sugar') ??
          'admin.dashboard.charts.sugar',
      },
      validation: {
        title:
          getTranslationValue(language, 'admin.dashboard.validation.title') ??
          'admin.dashboard.validation.title',
        accept:
          getTranslationValue(language, 'admin.dashboard.validation.accept') ??
          'admin.dashboard.validation.accept',
        refuse:
          getTranslationValue(language, 'admin.dashboard.validation.refuse') ??
          'admin.dashboard.validation.refuse',
        empty:
          getTranslationValue(language, 'admin.dashboard.validation.empty') ??
          'admin.dashboard.validation.empty',
        search_empty:
          getTranslationValue(language, 'admin.dashboard.validation.search_empty') ??
          'admin.dashboard.validation.search_empty',
      },
      recent_activity: {
        title:
          getTranslationValue(language, 'admin.dashboard.recent_activity.title') ??
          'admin.dashboard.recent_activity.title',
        view_all:
          getTranslationValue(language, 'admin.dashboard.recent_activity.view_all') ??
          'admin.dashboard.recent_activity.view_all',
      },
      quick_access: {
        title:
          getTranslationValue(language, 'admin.dashboard.quick_access.title') ??
          'admin.dashboard.quick_access.title',
        manage_vendors:
          getTranslationValue(language, 'admin.dashboard.quick_access.manage_vendors') ??
          'admin.dashboard.quick_access.manage_vendors',
      },
      products: {
        title:
          getTranslationValue(language, 'admin.dashboard.products.title') ??
          'admin.dashboard.products.title',
        all_markets:
          getTranslationValue(language, 'admin.dashboard.products.all_markets') ??
          'admin.dashboard.products.all_markets',
        headers: {
          product:
            getTranslationValue(language, 'admin.dashboard.products.headers.product') ??
            'admin.dashboard.products.headers.product',
          seller:
            getTranslationValue(language, 'admin.dashboard.products.headers.seller') ??
            'admin.dashboard.products.headers.seller',
          price:
            getTranslationValue(language, 'admin.dashboard.products.headers.price') ??
            'admin.dashboard.products.headers.price',
          market:
            getTranslationValue(language, 'admin.dashboard.products.headers.market') ??
            'admin.dashboard.products.headers.market',
          update:
            getTranslationValue(language, 'admin.dashboard.products.headers.update') ??
            'admin.dashboard.products.headers.update',
          actions:
            getTranslationValue(language, 'admin.dashboard.products.headers.actions') ??
            'admin.dashboard.products.headers.actions',
        },
        pagination: {
          showing:
            getTranslationValue(
              language,
              'admin.dashboard.products.pagination.showing',
            ) ?? 'admin.dashboard.products.pagination.showing',
          of:
            getTranslationValue(language, 'admin.dashboard.products.pagination.of') ??
            'admin.dashboard.products.pagination.of',
          products:
            getTranslationValue(
              language,
              'admin.dashboard.products.pagination.products',
            ) ?? 'admin.dashboard.products.pagination.products',
          prev:
            getTranslationValue(language, 'admin.dashboard.products.pagination.prev') ??
            'admin.dashboard.products.pagination.prev',
          next:
            getTranslationValue(language, 'admin.dashboard.products.pagination.next') ??
            'admin.dashboard.products.pagination.next',
        },
        empty:
          getTranslationValue(language, 'admin.dashboard.products.empty') ??
          'admin.dashboard.products.empty',
        edit:
          getTranslationValue(language, 'admin.dashboard.products.edit') ??
          'admin.dashboard.products.edit',
      },
    },
    vendors: {
      found:
        getTranslationValue(language, 'admin.vendors.found') ??
        'admin.vendors.found',
      filter_pending:
        getTranslationValue(language, 'admin.vendors.filter_pending') ??
        'admin.vendors.filter_pending',
      filter_active:
        getTranslationValue(language, 'admin.vendors.filter_active') ??
        'admin.vendors.filter_active',
      filter_banned:
        getTranslationValue(language, 'admin.vendors.filter_banned') ??
        'admin.vendors.filter_banned',
      pending_warning:
        getTranslationValue(language, 'admin.vendors.pending_warning') ??
        'admin.vendors.pending_warning',
      pending_desc:
        getTranslationValue(language, 'admin.vendors.pending_desc') ??
        'admin.vendors.pending_desc',
      process_now:
        getTranslationValue(language, 'admin.vendors.process_now') ??
        'admin.vendors.process_now',
      details:
        getTranslationValue(language, 'admin.vendors.details') ??
        'admin.vendors.details',
      reactivate:
        getTranslationValue(language, 'admin.vendors.reactivate') ??
        'admin.vendors.reactivate',
      status_active:
        getTranslationValue(language, 'admin.vendors.status_active') ??
        'admin.vendors.status_active',
      status_suspended:
        getTranslationValue(language, 'admin.vendors.status_suspended') ??
        'admin.vendors.status_suspended',
      owner:
        getTranslationValue(language, 'admin.vendors.owner') ??
        'admin.vendors.owner',
      banned:
        getTranslationValue(language, 'admin.vendors.banned') ??
        'admin.vendors.banned',
    },
    settings: {
      title:
        getTranslationValue(language, 'admin.settings.title') ??
        'admin.settings.title',
      theme:
        getTranslationValue(language, 'admin.settings.theme') ??
        'admin.settings.theme',
      lang:
        getTranslationValue(language, 'admin.settings.lang') ??
        'admin.settings.lang',
      font:
        getTranslationValue(language, 'admin.settings.font') ??
        'admin.settings.font',
      apply:
        getTranslationValue(language, 'admin.settings.apply') ??
        'admin.settings.apply',
      applying:
        getTranslationValue(language, 'admin.settings.applying') ??
        'admin.settings.applying',
      success:
        getTranslationValue(language, 'admin.settings.success') ??
        'admin.settings.success',
      themes: {
        light:
          getTranslationValue(language, 'admin.settings.themes.light') ??
          'admin.settings.themes.light',
        dark:
          getTranslationValue(language, 'admin.settings.themes.dark') ??
          'admin.settings.themes.dark',
        emerald:
          getTranslationValue(language, 'admin.settings.themes.emerald') ??
          'admin.settings.themes.emerald',
        ocean:
          getTranslationValue(language, 'admin.settings.themes.ocean') ??
          'admin.settings.themes.ocean',
      },
      fonts: {
        small:
          getTranslationValue(language, 'admin.settings.fonts.small') ??
          'admin.settings.fonts.small',
        medium:
          getTranslationValue(language, 'admin.settings.fonts.medium') ??
          'admin.settings.fonts.medium',
        large:
          getTranslationValue(language, 'admin.settings.fonts.large') ??
          'admin.settings.fonts.large',
      },
      infoSubtitle:
        getTranslationValue(language, 'admin.settings.infoSubtitle') ??
        'admin.settings.infoSubtitle',
    },
  }), [language]);

  return { t, language };
};
