<template>
  <div class="avia_sales_start">
    <progress max="100" :class="['progress_start', {progress_start_hidden: stop}]" />
    <div class="main_content">
      <AviaSalesFilters
        id="filters"
        v-model="filterData"
        :transfers-amount="transfersAmount"
        :disabled="!stop"
        @on-filter="filterTickets"
      />
      <div class="content_body">
        <AviaSalesSorting
          v-model="sortingData"
          :sorting-buttons="sortingButtons"
          :disabled="!stop"
          @on-sort="sortTickets"
        />
        <div class="main_content_wrapper" v-if="tickets.length">
          <AviaFlyCard v-for="(ticket, ticketIndex) in filteredTickets" :key="ticketIndex" :ticket="ticket" />
          <div class="main_content_buttoms">
            <button v-if="cardOnPage > 5" class="content_button_top" @click="goToTop">⇧</button>
            <button class="content_button_more" @click="loadMore">show another 5 ticket</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
  import AviaSalesFilters from '@/components/AviaSalesFilters.vue';
  import AviaFlyCard from '@/components/AviaFlyCard.vue';
  import AviaSalesSorting from '@/components/AviaSalesSorting.vue';
  import {useRoute, useRouter} from 'vue-router';

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
  const router = useRouter();

  console.log(route.query);

  const filteredTickets = computed(() => tickets.value.slice(0, cardOnPage.value));

  const queryFilter = computed(() => {
    const filters = filterData.value;
    return {
      ...route.query,
      no: filters.includes(0) ? 0 : undefined,
      one: filters.includes(1) ? 1 : undefined,
      two: filters.includes(2) ? 2 : undefined,
      three: filters.includes(3) ? 3 : undefined,
      all: filters.includes('all') ? 'all' : undefined
    };
  });

  const setTickets = (newValue) => {
    tickets.value = newValue;
  };

  const setQueryToFilter = () => {
    const query = route.query;
    if (query.no) {
      Array.isArray(query.nst) ? filterData.value.concat(query.no) : filterData.value.push(Number(query.no));
    }
    if (query.one) {
      Array.isArray(query.one) ? filterData.value.concat(query.one) : filterData.value.push(Number(query.one));
    }
    if (query.two) {
      Array.isArray(query.two) ? filterData.value.concat(query.two) : filterData.value.push(Number(query.two));
    }
    if (query.three) {
      Array.isArray(query.three) ? filterData.value.concat(query.three) : filterData.value.push(Number(query.three));
    }
  };

  const setQueryFilterToRouter = () => {
    router.replace({
      query: queryFilter.value
    });
  };

  const filterTickets = () => {
    if (filterData.value.length) {
      const isAllResults = filterData.value.includes('all');
      if (!isAllResults) {
        tickets.value = tickets.value.filter((ticket) => {
          return ticket.segments.find((segment) => {
            const stopsQuantity = segment.stops.length;
            if (filterData.value.includes(stopsQuantity)) {
              return true;
            }
          });
        });
      }
    }
    setQueryFilterToRouter();
  };

  const getTripSpeed = (ticket) => {
    return ticket.segments.reduce((sum, segment) => sum + segment.duration, 0);
  };
  const getOptimalPoints = (ticket) => {
    return ticket.value.price / getTripSpeed(ticket);
  };

  const sortBySpeed = () => {
    tickets.value.sort((elem1, elem2) => getTripSpeed(elem1) - getTripSpeed(elem2));
  };
  const sortByPrice = () => {
    tickets.value.sort((elem1, elem2) => elem1.price - elem2.price);
  };
  const sortByOptimal = () => {
    tickets.value.reverse((elem1, elem2) => getOptimalPoints(elem1) - getOptimalPoints(elem2));
  };

  const sortTickets = () => {
    switch (sortingData.value) {
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

  const getTickets = async () => {
    if (!stop.value) {
      try {
        const res = await fetch(`https://avs-backend.vercel.app/tickets?searchId=${searchId.value}`);
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets);
          console.log(data);
          filterTickets();
          stop.value = data.stop;
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      clearInterval(polling.value);
    }
  };

  const loadMore = () => {
    cardOnPage.value += additionCardQuantity.value;
  };

  const goToTop = () => {
    const header = document.querySelector('#filters');
    header.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
  };

  const createdListTickets = async () => {
    await getSearchId();
    setQueryToFilter();
    await getTickets();
    polling.value = setInterval(() => {
      return new Promise((resolve, reject) => {
        getTickets()
          .then((resp) => {
            resolve(resp);
          })
          .catch(reject);
      });
    }, 1000);
  };

  onMounted(createdListTickets);
  onBeforeUnmount(() => clearInterval(polling.value));
</script>

<style lang="scss">
  .avia_sales_start {
    max-width: 990px;
    width: 100%;
    margin: 0 auto;
  }
  .main_content {
    display: flex;
    gap: 15px;
    transition: all 0.4s ease;

    @media only screen and (max-width: 870px) {
      flex-direction: column;
    }
  }

  .content_body {
    width: 74%;
    transition: all 0.4s ease;

    @media only screen and (max-width: 870px) {
      width: 100%;
    }
  }

  .main_content_wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .main_content_buttoms {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .content_button_more {
    width: 100%;
    font-size: 20px;
    border: none;
    outline: none;
    background: #55c97c;
    color: white;
    padding: 11px;
    border-radius: 5px;
  }

  .content_button_top {
    width: 28%;
    border: none;
    outline: none;
    background: #ddf06d;
    font-size: 20px;
  }

  .progress_start {
    width: 100%;
    transition: all 0.7s ease;
    opacity: 1;
  }

  .progress_start_hidden {
    opacity: 0;
  }
</style>
