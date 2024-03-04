<template>
  <div class="avia_filters">
    <h4 class="avia_filters_title">Transfers Amount</h4>
    <div class="avia_filters_wrapper">
      <div class="avia_filters_checkbox" v-for="transfer in transfersAmount" :key="transfer.value">
        <input
          type="checkbox"
          v-model="selectedFilter"
          :value="transfer.value"
          :id="transfer.value"
          :disabled="disabled"
          @change="changeFilter"
        />
        <label class="filters_checkbox_label" for="transfer.value">{{ transfer.text }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {computed} from 'vue';

  const props = defineProps({
    transfersAmount: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits(['update:modelValue', 'on-filter']);

  const selectedFilter = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    }
  });

  const changeFilter = () => {
    emit('on-filter');
  };
</script>

<style lang="scss">
  .avia_filters {
    width: 25%;
    background: white;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: min-content;
    transition: all 0.4s ease;

    @media only screen and (max-width: 870px) {
      width: 100%;
    }
  }

  .avia_filters_wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media only screen and (max-width: 870px) {
      flex-direction: row;
      justify-content: space-around;
    }
  }

  .avia_filters_title {
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 22px;

    @media only screen and (max-width: 870px) {
      text-align: center;
    }
  }

  .avia_filters_checkbox {
    display: flex;
    align-items: center;

    input:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .filters_checkbox_label {
    margin-left: 5px;
  }
</style>
