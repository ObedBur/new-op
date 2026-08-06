import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/context/ToastContext';
import {
    Sun,
    Moon,
    Leaf,
    Waves,
    Globe,
    Type,
    CheckCircle2,
    Save,
    Loader2,
    Info,
    Palette,
    Bell,
    ShieldCheck,
    Smartphone,
} from 'lucide-react';

const SectionCard: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }> = ({
    title, subtitle, icon, children,
}) => (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div className="size-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">{title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
            </div>
        </div>
        {children}
    </div>
);

const SettingsView: React.FC = () => {
    const { theme, setTheme, language, setLanguage, fontSize, setFontSize } = useSettings();
    const { showToast } = useToast();

    const [draftTheme, setDraftTheme] = React.useState(theme);
    const [draftLanguage, setDraftLanguage] = React.useState(language);
    const [draftFontSize, setDraftFontSize] = React.useState(fontSize);
    const [isSaving, setIsSaving] = React.useState(false);

    const t = {
        fr: { title: 'Configuration Globale', theme: 'Thème de l\'interface', lang: 'Langue du système', font: 'Taille de police', apply: 'Sauvegarder', applying: 'Sauvegarde...', success: 'Paramètres mis à jour' },
        en: { title: 'Global Settings', theme: 'Interface Theme', lang: 'System Language', font: 'Font Size', apply: 'Save Changes', applying: 'Saving...', success: 'Settings updated' },
    }[draftLanguage];

    const hasChanges = draftTheme !== theme || draftLanguage !== language || draftFontSize !== fontSize;

    const handleApply = () => {
        setIsSaving(true);
        setTimeout(() => {
            setTheme(draftTheme);
            setLanguage(draftLanguage);
            setFontSize(draftFontSize);
            setIsSaving(false);
            showToast(t.success, 'success');
        }, 600);
    };

    const themes: { id: typeof theme; label: string; icon: React.ReactNode; bg: string; ring: string }[] = [
        { id: 'light', label: 'Clair', icon: <Sun className="size-4" />, bg: 'bg-white border-slate-300', ring: 'ring-orange-500' },
        { id: 'dark', label: 'Sombre', icon: <Moon className="size-4" />, bg: 'bg-slate-900', ring: 'ring-slate-700' },
        { id: 'emerald', label: 'Émeraude', icon: <Leaf className="size-4" />, bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
        { id: 'ocean', label: 'Océan', icon: <Waves className="size-4" />, bg: 'bg-sky-500', ring: 'ring-sky-500' },
    ];

    const languages: { id: typeof language; label: string; flag: string }[] = [
        { id: 'fr', label: 'Français', flag: '🇫🇷' },
        { id: 'en', label: 'English', flag: '🇬🇧' },
    ];

    const fontSizes: { id: typeof fontSize; label: string; preview: string }[] = [
        { id: 'small', label: 'Compact', preview: 'Aa' },
        { id: 'medium', label: 'Normal', preview: 'Aa' },
        { id: 'large', label: 'Grand', preview: 'Aa' },
    ];

    return (
        <div className="w-full max-w-3xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

            {/* Theme Section */}
            <SectionCard title={t.theme} subtitle="Apparence visuelle" icon={<Palette className="size-4" />}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {themes.map((tItem) => (
                        <button
                            key={tItem.id}
                            onClick={() => setDraftTheme(tItem.id)}
                            className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                draftTheme === tItem.id
                                    ? `border-orange-500 bg-orange-50 ring-2 ${tItem.ring}`
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <div className={`size-9 rounded-xl border border-black/10 flex items-center justify-center ${tItem.bg} ${draftTheme === tItem.id ? 'text-white' : 'text-slate-700'}`}>
                                {tItem.icon}
                            </div>
                            <span className={`text-xs font-bold ${draftTheme === tItem.id ? 'text-orange-600' : 'text-slate-600'}`}>
                                {tItem.label}
                            </span>
                            {draftTheme === tItem.id && (
                                <CheckCircle2 className="size-3.5 text-orange-500 absolute top-2 right-2" />
                            )}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Language Section */}
            <SectionCard title={t.lang} subtitle="Langue de l'interface admin" icon={<Globe className="size-4" />}>
                <div className="flex gap-3">
                    {languages.map((lItem) => (
                        <button
                            key={lItem.id}
                            onClick={() => setDraftLanguage(lItem.id)}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer flex-1 ${
                                draftLanguage === lItem.id
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-xl">{lItem.flag}</span>
                            {lItem.label}
                            {draftLanguage === lItem.id && <CheckCircle2 className="size-4 text-orange-500 ml-auto" />}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Font Size Section */}
            <SectionCard title={t.font} subtitle="Densité d'affichage du texte" icon={<Type className="size-4" />}>
                <div className="grid grid-cols-3 gap-3">
                    {fontSizes.map((fItem) => (
                        <button
                            key={fItem.id}
                            onClick={() => setDraftFontSize(fItem.id)}
                            className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                                draftFontSize === fItem.id
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <span className={`font-black leading-none ${
                                fItem.id === 'small' ? 'text-base' : fItem.id === 'medium' ? 'text-xl' : 'text-3xl'
                            }`}>{fItem.preview}</span>
                            <span className="text-xs font-bold">{fItem.label}</span>
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Notifications placeholder */}
            <SectionCard title="Notifications" subtitle="Alertes et rappels système" icon={<Bell className="size-4" />}>
                <div className="space-y-3">
                    {[
                        { label: 'Nouveaux vendeurs en attente', enabled: true },
                        { label: 'Commandes passées', enabled: false },
                        { label: 'Alertes de signalement', enabled: true },
                    ].map(item => (
                        <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                            <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${item.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                                <div className="size-4 rounded-full bg-white shadow-sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Save bar */}
            <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
                <div className="flex items-center gap-2">
                    {!hasChanges && !isSaving && (
                        <>
                            <CheckCircle2 className="size-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t.success}</span>
                        </>
                    )}
                    {hasChanges && !isSaving && (
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Modifications non sauvegardées</span>
                    )}
                </div>
                <button
                    onClick={handleApply}
                    disabled={!hasChanges || isSaving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        hasChanges && !isSaving
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {isSaving ? (
                        <><Loader2 className="size-4 animate-spin" />{t.applying}</>
                    ) : (
                        <><Save className="size-4" />{t.apply}</>
                    )}
                </button>
            </div>

            {/* App info footer */}
            <div className="flex items-center gap-4 bg-emerald-50 rounded-2xl border border-emerald-200/60 p-5">
                <div className="size-11 rounded-xl bg-white flex items-center justify-center shadow-xs border border-emerald-200/60 shrink-0">
                    <ShieldCheck className="size-5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900">WapiBei Admin <span className="text-emerald-600">v2.4.0</span></p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Instance Afrique · Mode Développement · Next.js 16</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
