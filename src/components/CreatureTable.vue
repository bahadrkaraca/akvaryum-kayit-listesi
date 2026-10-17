<script setup lang="ts">
import { DEFAULT_PHOTO, type Creature } from '@/interfaces/Creature'

defineProps<{ items: Creature[] }>()
const emit = defineEmits<{ edit: [c: Creature]; remove: [c: Creature] }>()

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (!img.src.endsWith(DEFAULT_PHOTO)) img.src = DEFAULT_PHOTO
}
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>ID No</th><th>Vesikalık</th><th>İsim</th><th>Yaş</th>
          <th>Tür</th><th>Cinsi</th><th>Yaşadığı Su</th><th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in items" :key="c.id">
          <td>{{ c.id }}</td>
          <td>
            <img :src="c.photo || DEFAULT_PHOTO" class="thumb" :alt="c.name" @error="onImgError" />
          </td>
          <td>{{ c.name }}</td>
          <td>{{ c.age }}</td>
          <td><span class="badge">{{ c.kind }}</span></td>
          <td>{{ c.species }}</td>
          <td>{{ c.water }}</td>
          <td class="row-actions">
            <button @click="emit('edit', c)">Düzenle</button>
            <button class="danger" @click="emit('remove', c)">Sil</button>
          </td>
        </tr>
        <tr v-if="!items.length"><td colspan="8" class="none">Kayıt bulunamadı.</td></tr>
      </tbody>
    </table>
  </div>
</template>
