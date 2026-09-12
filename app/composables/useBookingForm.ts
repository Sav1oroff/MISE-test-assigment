import { ref, reactive } from 'vue'
import type { BookingFormData, BookingStatus } from '~/types/booking'

export function useBookingForm() {
    const status = ref<BookingStatus>('idle')
    const errors = reactive<Record<string, string>>({})
    const form = reactive<BookingFormData>({
        name: '', phone: '', date: '', time: '', guests: 1,
    })
    async function submit() {
        if (!validate()) return
        status.value = 'loading'
        await new Promise(r => setTimeout(r, 1500))
        status.value = 'success'
    }
    return { form, errors, status, submit }
}