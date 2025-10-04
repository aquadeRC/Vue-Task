<template v-else>
    <div class="card">
      <h2>Grouped table</h2>
      <label>Group by: </label>
      <div>
        <template v-for="group in groups">
          <input type="radio"
          :id="group"
          :value="group"
          name="branch"
          v-model="currentGroup">
          <label :for="group">{{ group }}</label>
        </template>    
      </div>
      <section>
        <table>
      <thead>
        <tr class="header">
          <td v-for="header in headers" :key="header">
            {{ header }}
          </td>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="([key, value], idx) in Object.entries(groupedData)"
          :key="idx"
        >
          <tr @click="groupToggle(key)" class="group">
            <td>
              <div style="display: flex; justify-content: space-between; margin-left:10px">
                <span>{{ key }}</span>
              </div>
            </td>
          </tr>

          <template v-if="!hidden.has(key)">
            <tr v-for="(row, idx) in value" :key="idx">
              <td v-for="(cellValue, cellKey) in row" :key="cellKey">
                {{ cellValue }}
              </td>
            </tr>

            <tr v-if="value.length > 1">
              <td style="text-align: right">
                <span v-if="value.length > 1" v-show="totalGet(value, key)">
                  total: {{ totalData.get(key) }} PLN
                </span>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
        </table>  
      </section> 
    </div>
  </template>


<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { dataGroup, plnToCurrency, type Data } from "./utils";

const props = defineProps<{data: Data[] | null}>();

const groups = ['account', 'currency', 'category'];
const currentGroup = ref(groups[0]);

const groupedData = computed(() =>
   props.data //
    ? dataGroup(props.data, currentGroup.value)
    : [],
);
const headers = computed(() =>
  Object.keys(props.data?.[0] ?? {}).filter((i) => i !== currentGroup.value),
);

const hidden = reactive(new Set<string>());
function groupToggle(groupKey: string) {
  hidden.has(groupKey) //
    ? hidden.delete(groupKey)
    : hidden.add(groupKey);
}
const totalData = reactive(new Map<string, string>());

watch(currentGroup, ()=>{
totalData.clear();
});

async function totalGet(
items: { amount: string | number; currency: string }[], currentKey: string){   
   let result =  await items.reduce(async (prev, curr) => {
     const acc = await prev;
     const curency = curr.currency !== undefined ?curr.currency:currentKey;
     const factor = await plnToCurrency(curency);
   
     return  acc + (Number(curr.amount) / Number(factor));
   }, Promise.resolve(0));

   totalData.set(currentKey, result.toFixed(2));
  }
</script>