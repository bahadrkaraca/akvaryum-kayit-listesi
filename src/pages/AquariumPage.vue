<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CreatureForm from '@/components/CreatureForm.vue'
import CreatureTable from '@/components/CreatureTable.vue'
import { CREATURE_KINDS, type Creature, type CreatureForm as Form } from '@/interfaces/Creature'
import { useCreatures } from '@/composables/useCreatures'

const { creatures, loading, localMode, error, add, update, remove, reload } = useCreatures()
const editing = ref<Creature | null>(null)
const search = ref('')
const kindFilter = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return creatures.value.filter(
    (c) =>
      (!kindFilter.value || c.kind === kindFilter.value) &&
      (!q || `${c.id} ${c.name} ${c.species}`.toLowerCase().includes(q)),
  )
})

async function save(f: Form) {
  if (editing.value) await update(editing.value.id, f)
  else await add(f)
  editing.value = null
}

// Başkası bir şey eklediyse sekmeye dönünce liste tazelensin
const onVisible = () => { if (!document.hidden && !localMode.value) reload() }
onMounted(() => document.addEventListener('visibilitychange', onVisible))
onUnmounted(() => document.removeEventListener('visibilitychange', onVisible))
async function del(c: Creature) {
  if (confirm(`${c.name} silinsin mi?`)) {
    await remove(c.id)
    if (editing.value?.id === c.id) editing.value = null
  }
}
</script>

<template>
  <main class="page">
    <header>
      <h1>🐠 Akvaryum Canlı Kayıtları</h1>
      <p>{{ creatures.length }} canlı kayıtlı · <button class="link" @click="reload">Yenile</button></p>
      <p v-if="localMode" class="note">Yerel mod: API bulunamadı, kayıtlar sadece bu tarayıcıda tutuluyor.</p>
      <p v-if="error" class="note err">{{ error }}</p>
    </header>
    <div class="layout">
      <CreatureForm :editing="editing" @save="save" @cancel="editing = null" />
      <section>
        <div class="filters">
          <input v-model="search" placeholder="ID, isim veya cins ara..." />
          <select v-model="kindFilter">
            <option value="">Tüm türler</option>
            <option v-for="k in CREATURE_KINDS" :key="k">{{ k }}</option>
          </select>
        </div>
        <p v-if="loading" class="note">Yükleniyor...</p>
        <CreatureTable v-else :items="filtered" @edit="editing = $event" @remove="del" />
      </section>
    </div>
  </main>
</template>
