import { getStore } from '@netlify/blobs'
import type { Config } from '@netlify/functions'

// Basit ortak "veritabanı": tüm liste tek bir JSON olarak Netlify Blobs'ta durur.
const KEY = 'creatures'
const KINDS = ['Balık', 'Yengeç', 'Karides', 'Salyangoz', 'Mercan', 'Bitki', 'Diğer']
const WATERS = ['Tatlı su', 'Tuzlu su', 'Acı su']

interface Creature {
  id: number
  name: string
  age: number
  kind: string
  species: string
  water: string
  photo: string
}

// Liste ilk kez açıldığında (store boşken) gelen başlangıç kayıtları. Resimler public/images içinde.
const SEED: Creature[] = [
  { id: 1, name: 'Masallah', age: 2, kind: 'Balık', species: 'Palyaço balığı', water: 'Tuzlu su', photo: '/images/masallah.jpg' },
  { id: 2, name: 'Vantuz', age: 1, kind: 'Balık', species: 'Vatoz balığı', water: 'Tuzlu su', photo: '/images/vantuz.jpg' },
  { id: 3, name: 'Nekoi', age: 5, kind: 'Balık', species: 'Koi balığı', water: 'Tatlı su', photo: '/images/nekoi.jpg' },
]

function clean(b: any): Omit<Creature, 'id'> | null {
  if (!b || typeof b !== 'object') return null
  const name = String(b.name ?? '').trim().slice(0, 80)
  if (!name) return null
  const photo = typeof b.photo === 'string' && b.photo.length < 300_000 ? b.photo : ''
  return {
    name,
    age: Math.max(0, Number(b.age) || 0),
    kind: KINDS.includes(b.kind) ? b.kind : 'Diğer',
    species: String(b.species ?? '').trim().slice(0, 80),
    water: WATERS.includes(b.water) ? b.water : 'Tatlı su',
    photo,
  }
}

export default async (req: Request) => {
  const store = getStore('akvaryum')
  const list: Creature[] = (await store.get(KEY, { type: 'json' })) ?? SEED
  const idPart = new URL(req.url).pathname.split('/').filter(Boolean)[2]
  const id = idPart ? Number(idPart) : null

  if (req.method === 'GET') return Response.json(list)

  if (req.method === 'POST') {
    const data = clean(await req.json().catch(() => null))
    if (!data) return Response.json({ error: 'Geçersiz veri' }, { status: 400 })
    const item = { id: list.reduce((m, c) => Math.max(m, c.id), 0) + 1, ...data }
    list.push(item)
    await store.setJSON(KEY, list)
    return Response.json(item, { status: 201 })
  }

  if (req.method === 'PUT' && id !== null) {
    const data = clean(await req.json().catch(() => null))
    const i = list.findIndex((c) => c.id === id)
    if (!data || i < 0) return Response.json({ error: 'Bulunamadı' }, { status: 404 })
    list[i] = { id, ...data }
    await store.setJSON(KEY, list)
    return Response.json(list[i])
  }

  if (req.method === 'DELETE' && id !== null) {
    await store.setJSON(KEY, list.filter((c) => c.id !== id))
    return Response.json({ ok: true })
  }

  return Response.json({ error: 'Desteklenmeyen istek' }, { status: 405 })
}

export const config: Config = { path: ['/api/creatures', '/api/creatures/*'] }
