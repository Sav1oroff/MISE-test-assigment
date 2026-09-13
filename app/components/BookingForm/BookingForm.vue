<script setup lang="ts">
const props = defineProps<{
  bookingDate: {
    errors: Record<string, string | undefined>
    nameAttrs: Record<string, unknown>
    phoneAttrs: Record<string, unknown>
    dateAttrs: Record<string, unknown>
    timeAttrs: Record<string, unknown>
    guestsAttrs: Record<string, unknown>
    minBookingDate: string
    maxBookingDate: string
    hasAvailableSlots: boolean
    availableTimeSlots: string[]
  }
}>()

const emit = defineEmits<{
  submit: [event: SubmitEvent]
}>()


const name = defineModel<string>('name', { required: true })
const phone = defineModel<string>('phone', { required: true })
const date = defineModel<string>('date', { required: true })
const time = defineModel<string>('time', { required: true })
const guests = defineModel<number>('guests', { required: true })



</script>

<template>
  <form @submit="emit('submit', $event)">
    <div class="guest__name">
      <label class="guest__name-title" for="booking-name">Your Name:</label>
      <input
          id="booking-name"
          v-model="name"
          v-bind="props.bookingDate.nameAttrs"
          type="text"
          aria-describedby="booking-name-error"
          :aria-invalid="Boolean(props.bookingDate.errors.name)"
      />

      <span id="booking-name-error" class="field-error" role="alert">{{ props.bookingDate.errors.name }}</span>
    </div>

    <div class="guest__phone">
      <label class="guest__phone-title" for="booking-phone">Phone:</label>
      <input
          id="booking-phone"
          v-model="phone"
          v-bind="props.bookingDate.phoneAttrs"
          type="tel"
          autocomplete="tel"
          aria-describedby="booking-phone-error"
          :aria-invalid="Boolean(props.bookingDate.errors.phone)"
      />

      <span id="booking-phone-error" class="field-error" role="alert">{{ props.bookingDate.errors.phone }}</span>
    </div>


    <div class="guest__date">
      <label class="guest__date-title" for="booking-date">Date reserve:</label>

      <input
          id="booking-date"
          v-model="date"
          v-bind="props.bookingDate.dateAttrs"
          type="date"
          :min="props.bookingDate.minBookingDate"
          :max="props.bookingDate.maxBookingDate"
          aria-describedby="booking-date-error"
          :aria-invalid="Boolean(props.bookingDate.errors.date)"
      />

      <span id="booking-date-error" class="field-error" role="alert">{{ props.bookingDate.errors.date }}</span>
    </div>

    <div class="guest__time">
      <label class="guest__time-title" for="booking-time">Time reserve:</label>
      <p v-if="!date" class="guest__name-title-correct">Сначала выберите дату визита!</p>
      <p v-else-if="!props.bookingDate.hasAvailableSlots" class="guest__name-title-correct">На выбранную дату доступных слотов нет.</p>
      <p v-else class="guest__name-title-correct">Время можно выбирать</p>


      <select
          :disabled="!props.bookingDate.hasAvailableSlots"
          id="booking-time"
          v-model="time"
          v-bind="props.bookingDate.timeAttrs"
          aria-describedby="booking-time-error"
          :aria-invalid="Boolean(props.bookingDate.errors.time)"
      >
        <option disabled value="">Выберите время</option>
        <option
            v-for="slot in props.bookingDate.availableTimeSlots"
            :key="slot"
            :value="slot"
        >
          {{ slot }}
        </option>
      </select>

      <span id="booking-time-error" class="field-error" role="alert">{{ props.bookingDate.errors.time }}</span>
    </div>

    <div class="guest__guests">
      <label class="guest__guests-title" for="booking-guests">Guests:</label>
      <input
          id="booking-guests"
          v-model.number="guests"
          v-bind="props.bookingDate.guestsAttrs"
          type="number"
          min="1"
          max="12"
          aria-describedby="booking-guests-error"
          :aria-invalid="Boolean(props.bookingDate.errors.guests)"
      />

      <span id="booking-guests-error" class="field-error" role="alert">{{ props.bookingDate.errors.guests }}</span>
    </div>

    <button type="submit">Забронировать</button>
  </form>
</template>

<style scoped>
form {
  display: grid;
  gap: 20px;
  width: min(100%, 420px);
  margin: 0 auto;
}

form > div {
  display: grid;
  gap: 8px;
}

input,
select,
button {
  min-height: 48px;
  padding: 8px 12px;
  box-sizing: border-box;
  font: inherit;
}

button {
  cursor: pointer;
}

.field-error {
  min-height: 20px;
  color: #b42318;
  font-size: 0.875rem;
  line-height: 1.4;
}
</style>
