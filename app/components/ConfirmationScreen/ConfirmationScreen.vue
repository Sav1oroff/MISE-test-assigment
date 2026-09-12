<script setup lang="ts">
import type {BookingFormData} from '~/types/booking'

const props = defineProps<{
  booking: BookingFormData,
}>()

const emit = defineEmits<{
  reset: []
}>()

const handleReset = (): void => {
  emit('reset')
}


</script>

<template>
  <div class="success__booked">
    <h1>Успешно забронировано!</h1>
    <dl class="booking-summary">
      <div>
        <dt>Имя</dt>
        <dd>{{ props.booking.name }}</dd>
      </div>
      <div>
        <dt>Дата</dt>
        <dd>{{ props.booking.date }}</dd>
      </div>
      <div>
        <dt>Время</dt>
        <dd>{{ props.booking.time }}</dd>
      </div>
      <div>
        <dt>Гостей</dt>
        <dd>{{ props.booking.guests }}</dd>
      </div>
    </dl>
    <button type="button" @click="handleReset">Забронировать ещё</button>
  </div>
</template>

<style scoped>
.success__booked {
  display: grid;
  gap: 16px;
  max-width: 420px;
  padding: 24px;
  border: 1px solid #d9d5cc;
  border-radius: 16px;
  background: #ffffff;
}

.success__booked h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.2;
}

.booking-summary {
  display: grid;
  gap: 12px;
  margin: 0;
}

.booking-summary div {
  display: grid;
  gap: 4px;
}

.booking-summary dt {
  color: #667085;
  font-size: 0.875rem;
}

.booking-summary dd {
  margin: 0;
}
</style>
