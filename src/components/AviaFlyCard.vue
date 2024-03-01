<template>
  <div class="avia_fly_card white_card">
    <div class="fly_card_header">
      <div class="fly_card_price">price {{ ticket.price }}</div>
      <img class="fly_card_img" :src="companyImage" alt="fly_img" />
    </div>
    <div class="fly_card_body">
      <div class="fly_card_body_segment" v-for="(segment, segmentIndex) in ticket.segments" :key="segmentIndex">
        <div class="body_segment_item">
          <p class="segment_item_header">{{ segment.origin }} - {{ segment.destination }}</p>
          <p class="segment_item_value">{{ timeRange(segment.date, segment.duration) }}</p>
        </div>
        <div class="body_segment_item">
          <p class="segment_item_header">On the road</p>
          <p class="segment_item_value">{{ timeDuration(segment.date, segment.duration) }}</p>
        </div>
        <div class="body_segment_item" v-if="segment.stops.length">
          <p class="segment_item_header">{{ transfersQuantity(segment.stops) }}</p>
          <p class="segment_item_value">{{ stopsName(segment.stops) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {computed} from 'vue';

  const props = defineProps({
    ticket: {
      type: Object,
      default: () => {}
    }
  });

  const companyImage = computed(() => `//pics.avs.io/99/36/${props.ticket.carrier}.png`);

  const addMinutes = (numOfMinutes, date) => {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
  };

  const timeRange = (date, duration) => {
    const dateFromHours = new Date(date).getHours();
    const dateFromMinutes = new Date(date).getMinutes();
    const dateToHours = addMinutes(duration, new Date(date)).getHours();
    const dateToMinutes = addMinutes(duration, new Date(date)).getMinutes();
    return `${dateFromHours}:${dateFromMinutes} - ${dateToHours}:${dateToMinutes}`;
  };

  const minusMinutes = (numOfMinutes, date) => {
    date.setMinutes(date.getMinutes() - numOfMinutes);
    return date;
  };

  const timeDuration = (date, duration) => {
    const dateDurationHours = minusMinutes(duration, new Date(date)).getHours();
    const dateDurationMinutes = minusMinutes(duration, new Date(date)).getMinutes();
    return `${dateDurationHours}ч ${dateDurationMinutes}м`;
  };

  const transfersQuantity = (stops) => {
    const transfersQuantity = stops.length;
    const transfersQuantityText = transfersQuantity > 1 ? 'replantings' : 'replanting';
    return `${transfersQuantity} ${transfersQuantityText}`;
  };

  const stopsName = (stops) => {
    return stops.toString();
  };
</script>

<style lang="scss">
  .fly_card_img {
    width: 99px;
    height: 36px;
  }

  .avia_fly_card {
    background: #ffffff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 100%;
    padding: 20px;
  }

  .fly_card_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .fly_card_body_segment {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fly_card_body {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .segment_item_header {
    font-weight: 700;
    color: #6a6565;
    text-transform: uppercase;
  }

  .body_segment_item {
    text-align: center;
  }

  .fly_card_price {
    font-size: 22px;
    color: #55c97c;
    font-weight: 600;
  }
</style>
