<template>
   <table>
    <tr class="editTable" v-for="(item, idx) in data" :key="idx">
      <td class="editTable" v-for="(_, key) in item" :key="key">
        <input type="text" v-model.lazy="item[key]" />
      </td>
    </tr>
  </table>   
</template>


<script setup lang="ts">
import { type Data } from "./utils";

defineProps<{
  data: Data[] | null}>();
</script>