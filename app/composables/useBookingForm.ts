import type {BookingFormData, BookingStatus} from '~/types/booking'

export function useBookingForm() {
    const status = ref<BookingStatus>('idle')

    const validatePhone = (value: string): string | boolean => {
        if (typeof value !== 'string' || value.trim() === '') {
            return 'Введите номер телефона.'
        }

        const digits = value.replace(/\D/g, '')
        if (digits.length === 11 &&
            (digits[0] === '7' || digits[0] === '8')) {
            return true
        }
        return 'Введите корректный номер: +7 или 8, 10 цифр'
    }

    // Start Name


    const validateName = (value: unknown): true | string => {
        const guestNamePattern = /^\p{L}+(?:[ -]\p{L}+)*$/u

        if (value === undefined || value === null || value === '') {
            return 'Имя не должно быть пустым'
        }

        if (typeof value !== 'string' || !guestNamePattern.test(value)) {
            return 'Имя может содержать только буквы, одиночные пробелы и дефисы'
        }

        if (value.length < 2) {
            return 'Имя должно быть длиннее двух символов.'

        }

        return true
    }

    // End Name


    // Start Date

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 90)

    const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    const maxBookingDate = formatDate(maxDate)

    const validateDate = (value: string): true | string => {
        if (!value) {
            return 'Выберите дату бронирования.'
        }

        const [year, month, day] = value.split('-').map(Number)
        const selectedDate = new Date(year, month - 1, day)
        selectedDate.setHours(0, 0, 0, 0)

        if (selectedDate < earliestBookingDate) {
            return 'Выберите доступную дату…'
        }

        if (selectedDate > maxDate) {
            return 'Можно забронировать максимум на 90 дней вперёд.'
        }

        return true
    }

    // End Date


    // Start time


    const getMinTime = () => {
        const min = new Date()

        min.setHours(min.getHours() + 1)

        if (min.getMinutes() > 0 || min.getSeconds() > 0) {
            min.setHours(min.getHours() + 1, 0, 0, 0,)
        } else {
            min.setMinutes(0, 0, 0)
        }

        return min
    }


    const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return `${hours}:${minutes}`
    }

    const getTimeRangeForDate = (dateValue: string) => {
        const [year, month, day] = dateValue.split('-').map(Number)
        const opening = new Date(
            year,
            month - 1,
            day,
            12,
            0,
            0,
        )

        const closing = new Date(
            year,
            month - 1,
            day,
            22,
            0,
            0,
        )

        const earliestTime = getMinTime()

        const min = earliestTime > opening ? earliestTime : opening

        const hasSlots = min <= closing

        return {
            min,
            closing,
            hasSlots,
        }
    }


    const todayDateValue = formatDate(today)
    const todayTimeRange = getTimeRangeForDate(todayDateValue)


    const earliestBookingDate = new Date(today)

    if (!todayTimeRange.hasSlots) {
        earliestBookingDate.setDate(earliestBookingDate.getDate() + 1)
    }

    const minBookingDate = formatDate(earliestBookingDate)

    const validateTime = (value: string): true | string => {
        if (!value) {
            return 'Выберите время бронирования.'
        }

        if (!date.value) {
            return 'Сначала выберите дату бронирования.'
        }

        const timeRange = getTimeRangeForDate(date.value)

        if (!timeRange.hasSlots) {
            return 'На выбранную дату доступных слотов нет.'
        }

        const [hours, minutes] = value.split(':').map(Number)
        const [year, month, day] = date.value.split('-').map(Number)
        const selectedDateTime = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
        )

        if (selectedDateTime < timeRange.min) {
            return 'Выберите корректное время бронирования.'
        }

        if (selectedDateTime > timeRange.closing) {
            return 'Выберите время не позднее 22:00'
        }

        return true
    }

    // End time

    // Start guest

    const validateGuest = (value: number): true | string => {
        if (value === undefined || value === null) {
            return 'Введите количество гостей(от 1 до 12)'
        }

        if (value <= 0 || value > 12) {
            return 'Введите корректное количество гостей! От 1 до 12.'
        }

        return true
    }

    // End guest


    const {
        defineField,
        errors,
        handleSubmit,
        resetForm,
    } = useForm<BookingFormData>({
        validationSchema: {
            name: validateName,
            phone: validatePhone,
            date: validateDate,
            time: validateTime,
            guests: validateGuest,
        },
    })


    const [name, nameAttrs] = defineField('name')
    const [phone, phoneAttrs] = defineField('phone')
    const [date, dateAttrs] = defineField('date')
    const [time, timeAttrs] = defineField('time')
    const [guests, guestsAttrs] = defineField('guests')

    const selectedTimeRange = computed(() => {
        if (!date.value) return null
        return getTimeRangeForDate(date.value)
    })


    const availableTimeSlots = computed(() => {
        const range = selectedTimeRange.value

        if (!range?.hasSlots) return []

        const slots: string[] = []
        const slot = new Date(range.min)

        while (slot <= range.closing) {
            slots.push(formatTime(slot))
            slot.setHours(slot.getHours() + 1)
        }

        return slots
    })

    const hasAvailableSlots = computed(() => {
        return availableTimeSlots.value.length > 0
    })

    watch(
        date, () => {
            time.value = ''
        }
    )


    const submit = handleSubmit(async values => {
        status.value = 'loading'

        await new Promise(resolve => setTimeout(resolve, 1500))
        status.value = 'success'

    })


    const resetBooking = handleSubmit(async values => {
        resetForm()

        status.value = 'idle'
    })

    return {
        name,
        phone,
        phoneAttrs,
        nameAttrs,
        date,
        dateAttrs,
        minBookingDate,
        maxBookingDate,
        time,
        timeAttrs,
        availableTimeSlots,
        hasAvailableSlots,
        guests,
        guestsAttrs,
        errors,
        status,
        submit,
        resetBooking,
    }
}
