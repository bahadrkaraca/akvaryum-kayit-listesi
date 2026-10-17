import { ref } from 'vue'
import type { Creature, CreatureForm } from '@/interfaces/Creature'

// Yayında liste Netlify Function (/api/creatures) üzerinden ortak tutulur.
// API yoksa (sadece `npm run dev`) LocalStorage'a düşer.
const API = '/api/creatures'
const KEY = 'akvaryum-canlilar-v2'

const creatures = ref<Creature[]>([])
const loading = ref(true)
const localMode = ref(false)
const error = ref('')

function localLoad(): Creature[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return [
    { id: 1, name: 'Masallah', age: 2, kind: 'Balık', species: 'Palyaço balığı', water: 'Tuzlu su', photo: '/images/masallah.jpg' },
    { id: 2, name: 'Vantuz', age: 1, kind: 'Balık', species: 'Vatoz balığı', water: 'Tuzlu su', photo: '/images/vantuz.jpg' },
    { id: 3, name: 'Nekoi', age: 5, kind: 'Balık', species: 'Koi balığı', water: 'Tatlı su', photo: '/images/nekoi.jpg' },
  ]
}

function localSave() {
  try { localStorage.setItem(KEY, JSON.stringify(creatures.value)) } catch {}
}

async function api(path = '', init: RequestInit = {}) {
  const r = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!(r.headers.get('content-type') || '').includes('json')) throw new Error('API yok')
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Hata ${r.status}`)
  return r.json()
}

async function reload() {
  try {
    creatures.value = await api()
    localMode.value = false
  } catch {
    localMode.value = true
    creatures.value = localLoad()
  } finally {
    loading.value = false
  }
}
reload()

async function run(fn: () => Promise<void>) {
  error.value = ''
  try { await fn() } catch (e) { error.value = (e as Error).message }
}

export function useCreatures() {
  const add = (f: CreatureForm) => run(async () => {
    if (localMode.value) {
      const id = creatures.value.reduce((m, c) => Math.max(m, c.id), 0) + 1
      creatures.value.push({ id, ...f })
      return localSave()
    }
    creatures.value.push(await api('', { method: 'POST', body: JSON.stringify(f) }))
  })

  const update = (id: number, f: CreatureForm) => run(async () => {
    const i = creatures.value.findIndex((c) => c.id === id)
    if (i < 0) return
    if (localMode.value) {
      creatures.value[i] = { id, ...f }
      return localSave()
    }
    creatures.value[i] = await api(`/${id}`, { method: 'PUT', body: JSON.stringify(f) })
  })

  const remove = (id: number) => run(async () => {
    if (!localMode.value) await api(`/${id}`, { method: 'DELETE' })
    creatures.value = creatures.value.filter((c) => c.id !== id)
    if (localMode.value) localSave()
  })

  return { creatures, loading, localMode, error, add, update, remove, reload }
}
