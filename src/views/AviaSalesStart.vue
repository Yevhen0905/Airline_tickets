<template>
  <div class="avia_sales_start">
    <div class="main_content">
      <AviaSalesFilters id="filters" />
      <div>
        <AviaSalesSorting
          v-model="sortingData"
          :sorting-buttons="sortingButtons"
          :disabled="!stop"
          @on-sort="sortTickets"
        />
        <div class="main_content_wrapper" v-if="tickets.length">
          <AviaFlyCard v-for="(ticket, ticketIndex) in filteredTickets" :key="ticketIndex" :ticket="ticket" />
          <div class="main_content_buttoms">
            <button class="content_button_top" @click="goToTop">⇧</button>
            <button class="content_button_more" @click="loadMore">show another 5 ticket</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {ref, computed, onMounted} from 'vue';
  import AviaSalesFilters from '@/components/AviaSalesFilters.vue';
  import AviaFlyCard from '@/components/AviaFlyCard.vue';
  import AviaSalesSorting from '@/components/AviaSalesSorting.vue';
  import {useRoute} from 'vue-router';

  const searchId = ref(null);
  const tickets = ref([]);
  const stop = ref(false);
  const polling = ref(null);
  const cardOnPage = ref(5);
  const additionCardQuantity = ref(5);
  const sortingData = ref('');
  const filterData = ref([]);

  const sortingButtons = ref([
    {
      text: 'Сheapest',
      value: 'cheap'
    },
    {
      text: 'Fastest',
      value: 'spead'
    },
    {
      text: 'Optimal',
      value: 'optimal'
    }
  ]);
  const transfersAmount = ref([
    {
      text: 'All',
      value: 'all'
    },
    {
      text: 'No replanting',
      value: 0
    },
    {
      text: '1 replanting',
      value: 1
    },
    {
      text: '2 replantings',
      value: 2
    },
    {
      text: '3 replantings',
      value: 3
    }
  ]);

  const route = useRoute();
  console.log(route.query);

  const filteredTickets = computed(() => tickets.value.slice(0, cardOnPage.value));

  const loadMore = () => {
    cardOnPage.value += additionCardQuantity.value;
  };

  const setTickets = (newValue) => {
    tickets.value = newValue;
  };

  const getSearchId = async () => {
    try {
      const res = await fetch('https://avs-backend.vercel.app/search');

      const data = await res.json();
      searchId.value = data.searchId;
      console.log(searchId.value);
    } catch (e) {
      console.log(e);
    }
  };

  const goToTop = () => {
    const header = document.querySelector('#filters');
    header.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
  };

  const getTickets = async () => {
    if (!stop.value) {
      try {
        const res = await fetch(`https://avs-backend.vercel.app/tickets?searchId=${searchId.value}`);
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets);
          console.log(tickets);
          stop.value = data.stop;
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getTripSpeed = (ticket) => {
    return ticket.segments.reduce((sum, segment) => sum + segment.duration, 0);
  };
  const getOptimalPoints = (ticket) => {
    return ticket.price / getTripSpeed(ticket);
  };

  const sortBySpeed = () => {
    tickets.sort((elem1, elem2) => getTripSpeed(elem1) - getTripSpeed(elem2));
  };
  const sortByPrice = () => {
    tickets.sort((elem1, elem2) => elem1.price - elem2.price);
  };
  const sortByOptimal = () => {
    tickets.reverse((elem1, elem2) => getOptimalPoints(elem1) - getOptimalPoints(elem2));
  };

  const sortTickets = () => {
    switch (sortingData) {
      case 'spead':
        sortBySpeed();
        break;
      case 'cheap':
        sortByPrice();
        break;
      case 'optimal':
        sortByOptimal();
        break;
      default:
        break;
    }
  };

  const created = async () => {
    await getSearchId();
    await getTickets();
  };

  onMounted(created);
</script>

<style lang="scss">
  .main_content_wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 60%;
  }

  .main_content_buttoms {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  button.content_button_more {
    width: 70%;
    font-size: 20px;
    border: none;
    outline: none;
    background: #55c97c;
    color: white;
    padding: 11px;
    border-radius: 5px;
  }

  button.content_button_top {
    width: 28%;
    border: none;
    outline: none;
    background: #ddf06d;
    font-size: 20px;
  }
</style>
