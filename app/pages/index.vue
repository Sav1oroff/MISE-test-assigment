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

const bookingDate = computed(() => ({
  nameAttrs: nameAttrs.value,
  phoneAttrs: phoneAttrs.value,
  dateAttrs: dateAttrs.value,
  timeAttrs: timeAttrs.value,
  guestsAttrs: guestsAttrs.value,
  minBookingDate: minBookingDate,
  maxBookingDate: maxBookingDate,
  availableTimeSlots: availableTimeSlots.value,
  hasAvailableSlots: hasAvailableSlots.value,
  errors: errors.value,
}))

</script>

<template>
  <h1>Main page</h1>



  <Transition name="booking-screen" mode="out-in">

    <BookingForm
        key="form"
        v-if="status === 'idle' "
        :booking-date="bookingDate"
        v-model:name="name"
        v-model:phone="phone"
        v-model:date="date"
        v-model:time="time"
        v-model:guests="guests"
        @submit="submit"
    />


    <div v-else-if="status === 'loading'" key="loading" class="loading-state" role="status" aria-live="polite">
      <span>Бронирую...</span>
      <span class="loading-spinner"></span>
    </div>
    <ConfirmationScreen v-else key="success" :booking="booking" @reset="resetBooking"/>
  </Transition>

</template>

<style scoped>
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
