export enum Category {
  "Entretenimiento" = 'entertainment',
  "Internacional"   = 'world',
  "Empresarial"     = 'business',
  "Salud"           = 'health',
  "Deportes"        = 'sport',
  "Ciencia"         = 'science',
  "Tecnologia"      = 'technology'
}

export function getCategoryNameFromValue(value: string): string | undefined {
  return Object.keys(Category).find(
    key => Category[key as keyof typeof Category] === value
  );
}
