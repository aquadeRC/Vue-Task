<template>
  <div>
    <label>xml<input type="radio" value="xml" v-model="view" /></label>
    <label>table<input type="radio" value="table" v-model="view" /> </label>
  </div>

  <template v-if="view === 'xml'">
    <XmlView >
      <pre> {{ xml }} </pre>  
    </XmlView>

  </template>

  <template v-else>
    <TableView :data="data"/>
  </template>

  <div class="card">
    <EditTable :data="data"/>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { toXml, useExampleData, type Data } from "./utils";
import XmlView from "./XmlView.vue";
import TableView from "./TableView.vue";
import EditTable from "./EditTable.vue";

const view = ref<"xml" | "table">("table");
const data = useExampleData<Data>();
const xml  = computed(() =>toXml(data.value ?? []));
</script>

<style scoped>
pre {
  text-align: left;
}
</style>