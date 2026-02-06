import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect }, ref) => {
    const [viewDate, setViewDate] = React.useState(
      selected || new Date()
    )

    const daysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const firstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    const previousMonth = () => {
      setViewDate(
        new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
      )
    }

    const nextMonth = () => {
      setViewDate(
        new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
      )
    }

    const selectDate = (day: number) => {
      const newDate = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        day
      )
      onSelect?.(newDate)
    }

    const isSelectedDate = (day: number) => {
      if (!selected) return false
      return (
        selected.getDate() === day &&
        selected.getMonth() === viewDate.getMonth() &&
        selected.getFullYear() === viewDate.getFullYear()
      )
    }

    const isToday = (day: number) => {
      const today = new Date()
      return (
        today.getDate() === day &&
        today.getMonth() === viewDate.getMonth() &&
        today.getFullYear() === viewDate.getFullYear()
      )
    }

    const renderDays = () => {
      const days = []
      const totalDays = daysInMonth(viewDate)
      const firstDay = firstDayOfMonth(viewDate)

      for (let i = 0; i < firstDay; i++) {
        days.push(
          <div
            key={`empty-${i}`}
            className="p-2 text-center text-sm"
          />
        )
      }

      for (let day = 1; day <= totalDays; day++) {
        days.push(
          <button
            key={day}
            onClick={() => selectDate(day)}
            className={cn(
              "p-2 text-center text-sm rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
              isSelectedDate(day) &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isToday(day) && !isSelectedDate(day) && "border border-primary"
            )}
          >
            {day}
          </button>
        )
      }

      return days
    }

    return (
      <div
        ref={ref}
        className={cn("p-3 border rounded-lg bg-background", className)}
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {renderDays()}
        </div>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
