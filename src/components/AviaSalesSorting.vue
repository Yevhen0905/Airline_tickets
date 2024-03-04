<template>
  <div class="avia_sorting">
    <button
      class="avia_sorting_button"
      v-for="button in sortingButtons"
      :class="buttonClasses(button.value)"
      :key="button.value"
      :disabled="disabled"
      @click="activateSorting(button.value)"
    >
      {{ button.text }}
    </button>
  </div>
</template>

<script setup>
  import {computed} from 'vue';

  const props = defineProps({
    sortingButtons: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits(['update:modelValue', 'on-sort']);

  const checkedValue = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    }
  });

  const buttonClasses = (value) => {
    return [
      {
        avia_sorting_button_active: value === checkedValue.value
      }
    ];
  };

  const activateSorting = (value) => {
    checkedValue.value = value;
    if (checkedValue.value !== value) {
      sortTickets();
    }
  };

  const sortTickets = () => {
    emit('on-sort');
  };
</script>

<style lang="scss">
  .avia_sorting {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 1px;
  }

  .avia_sorting_button {
    width: 34%;
    padding: 10px;
    outline: none;
    border: 1px solid #ccc5c5;
    background-color: white;
    color: black;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    font-size: 18px;
    text-transform: lowercase;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .avia_sorting_button_active {
    background: #55c97c;
    color: white;
  }
</style>
