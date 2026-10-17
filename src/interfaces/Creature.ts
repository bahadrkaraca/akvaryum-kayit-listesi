// Fotoğrafı olmayan canlılarda gösterilen varsayılan resim (public/default.jpg)
export const DEFAULT_PHOTO = '/default.jpg'

export type CreatureKind = 'Balık' | 'Yengeç' | 'Karides' | 'Salyangoz' | 'Mercan' | 'Bitki' | 'Diğer'

export const CREATURE_KINDS: CreatureKind[] = [
  'Balık', 'Yengeç', 'Karides', 'Salyangoz', 'Mercan', 'Bitki', 'Diğer',
]

export const WATER_TYPES = ['Tatlı su', 'Tuzlu su', 'Acı su'] as const
export type WaterType = (typeof WATER_TYPES)[number]

export interface Creature {
  id: number
  name: string // Canlı ismi
  age: number // Yaş (yıl)
  kind: CreatureKind // Canlı türü (balık, karides...)
  species: string // Cins / tür (ör. Japon balığı)
  water: WaterType // Yaşadığı su
  photo: string // Vesikalık fotoğraf (data URL veya boş)
}

export type CreatureForm = Omit<Creature, 'id'>
