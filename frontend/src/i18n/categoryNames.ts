"use client";

const CATEGORY_NAME_KEYS: Record<string, string> = {
  'Agricole': 'home.categories.names.agricultural',
  'High-Tech': 'home.categories.names.highTech',
  'Mode': 'home.categories.names.mode',
  'Maison': 'home.categories.names.maison',
  'Alimentation': 'home.categories.names.alimentation',
  'Beauté & Santé': 'home.categories.names.beauteSante',
  'Sport & Loisirs': 'home.categories.names.sportLoisirs',
  'Auto & Moto': 'home.categories.names.autoMoto',
  'Boutique Express': 'home.categories.names.boutiqueExpress',
  'Services & Travaux': 'home.categories.names.servicesTravaux',
  'Bureautique': 'home.categories.names.bureautique',
  'Divers': 'home.categories.names.divers',
};

export const translateCategoryName = (
  name: string,
  t: (key: string) => string,
): string => {
  const key = CATEGORY_NAME_KEYS[name];
  if (!key) return name;
  const translated = t(key);
  return translated.startsWith('home.categories.names.') ? name : translated;
};

export default translateCategoryName;
