<script setup lang="ts">
import { reactive, watch } from 'vue'
import { cropSquare } from '@/utils/cropSquare'
import { DEFAULT_PHOTO, CREATURE_KINDS, WATER_TYPES, type Creature, type CreatureForm } from '@/interfaces/Creature'

const props = defineProps<{ editing: Creature | null }>()
const emit = defineEmits<{ save: [form: CreatureForm]; cancel: [] }>()

const empty = (): CreatureForm => ({
  name: '', age: 0, kind: 'Balık', species: '', water: 'Tatlı su', photo: '',
})
const form = reactive<CreatureForm>(empty())

watch(() => props.editing, (c) => {
  Object.assign(form, c ? { ...c } : empty())
}, { immediate: true })

async function onPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.photo = await cropSquare(file)
  } catch {
    alert('Resim okunamadı.')
  }
}

function submit() {
  if (!form.name.trim()) return
  emit('save', { ...form, name: form.name.trim(), species: form.species.trim() })
  Object.assign(form, empty())
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (!img.src.endsWith(DEFAULT_PHOTO)) img.src = DEFAULT_PHOTO
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <h2>{{ editing ? 'Canlıyı Güncelle' : 'Yeni Canlı Ekle' }}</h2>
    <label>İsim <input v-model="form.name" required placeholder="Örn. Nemo" /></label>
    <label>Yaş (yıl) <input v-model.number="form.age" type="number" min="0" step="0.5" /></label>
    <label>Canlı türü
      <select v-model="form.kind"><option v-for="k in CREATURE_KINDS" :key="k">{{ k }}</option></select>
    </label>
    <label>Cinsi <input v-model="form.species" placeholder="Örn. Japon balığı" /></label>
    <label>Yaşadığı su
      <select v-model="form.water"><option v-for="w in WATER_TYPES" :key="w">{{ w }}</option></select>
    </label>
    <label>Vesikalık fotoğraf <input type="file" accept="image/*" @change="onPhoto" /></label>
    <img :src="form.photo || DEFAULT_PHOTO" class="preview" alt="Önizleme" @error="onImgError" />
    <div class="actions">
      <button type="submit" class="primary">{{ editing ? 'Güncelle' : 'Ekle' }}</button>
      <button v-if="editing" type="button" @click="emit('cancel')">Vazgeç</button>
    </div>
  </form>
</template>
