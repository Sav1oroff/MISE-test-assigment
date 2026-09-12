<script setup lang="ts">
const {
  name,
  nameAttrs,
  errors,
  submit,
  phone,
  phoneAttrs,
  date,
  dateAttrs,
  minBookingDate,
  maxBookingDate,
  hasAvailableSlots,
  availableTimeSlots,
  guests,
  guestsAttrs,
  time,
  timeAttrs,
  status,
  resetBooking,
} = useBookingForm()


const booking = computed(() => ({
  name: name.value,
  phone: phone.value,
  date: date.value,
  time: time.value,
  guests: guests.value,
}))

</script>

<template>
  <h1>Main page</h1>


  <Transition name="booking-screen" mode="out-in">
    <form v-if="status === 'idle'" key="form" @submit="submit">

      <div class="guest__name">
        <label class="guest__name-title" for="booking-name">Your Name:</label>
        <input
            id="booking-name"
            v-model="name"
            v-bind="nameAttrs"
            type="text"
            aria-describedby="booking-name-error"
            :aria-invalid="Boolean(errors.name)"
        />

        <span id="booking-name-error" class="field-error" role="alert">{{ errors.name }}</span>
      </div>

      <div class="guest__phone">
        <label class="guest__phone-title" for="booking-phone">Phone:</label>
        <input
            id="booking-phone"
            v-model="phone"
            v-bind="phoneAttrs"
            type="tel"
            autocomplete="tel"
            aria-describedby="booking-phone-error"
            :aria-invalid="Boolean(errors.phone)"
        />

        <span id="booking-phone-error" class="field-error" role="alert">{{ errors.phone }}</span>
      </div>


      <div class="guest__date">
        <label class="guest__date-title" for="booking-date">Date reserve:</label>

        <input
            id="booking-date"
            v-model="date"
            v-bind="dateAttrs"
            type="date"
            :min="minBookingDate"
            :max="maxBookingDate"
            aria-describedby="booking-date-error"
            :aria-invalid="Boolean(errors.date)"
        />

        <span id="booking-date-error" class="field-error" role="alert">{{ errors.date }}</span>
      </div>

      <div class="guest__time">
        <label class="guest__time-title" for="booking-time">Time reserve:</label>
        <p v-if="!date" class="guest__name-title-correct">Сначала выберите дату визита!</p>
        <p v-else-if="!hasAvailableSlots" class="guest__name-title-correct">На выбранную дату доступных слотов нет.</p>
        <p v-else class="guest__name-title-correct">Время можно выбирать</p>


        <select
            :disabled="!hasAvailableSlots"
            id="booking-time"
            v-model="time"
            v-bind="timeAttrs"
            aria-describedby="booking-time-error"
            :aria-invalid="Boolean(errors.time)"
        >
          <option disabled value="">Выберите время</option>
          <option
              v-for="slot in availableTimeSlots"
              :key="slot"
              :value="slot"
          >
            {{ slot }}
          </option>
        </select>

        <span id="booking-time-error" class="field-error" role="alert">{{ errors.time }}</span>
      </div>

      <div class="guest__guests">
        <label class="guest__guests-title" for="booking-guests">Guests:</label>
        <input
            id="booking-guests"
            v-model.number="guests"
            v-bind="guestsAttrs"
            type="number"
            min="1"
            max="12"
            aria-describedby="booking-guests-error"
            :aria-invalid="Boolean(errors.guests)"
        />

        <span id="booking-guests-error" class="field-error" role="alert">{{ errors.guests }}</span>
      </div>

      <button type="submit">Забронировать</button>
    </form>
    <div v-else-if="status === 'loading'" key="loading" class="loading-state" role="status" aria-live="polite">
      <span>Бронирую...</span>
      <span class="loading-spinner"></span>
    </div>
    <ConfirmationScreen v-else key="success" :booking="booking" @reset="resetBooking"/>
  </Transition>

</template>

<style scoped>
form {
  display: grid;
  gap: 20px;
  max-width: 420px;
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
  font: inherit;
  box-sizing: border-box;
}

button {
  cursor: pointer;
}

.loading-spinner {
  display: inline-block;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  border: 3px solid #d0d5dd;
  border-top-color: #344054;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-state {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
}

.field-error {
  min-height: 20px;
  color: #b42318;
  font-size: 0.875rem;
  line-height: 1.4;
}

.booking-screen-enter-active,
.booking-screen-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.booking-screen-enter-from,
.booking-screen-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
