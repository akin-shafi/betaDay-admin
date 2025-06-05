"use client"

import { useState } from "react"
import { FiCalendar } from "react-icons/fi"

export function DateRangePicker({ onChange }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleApply = () => {
    onChange({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })
  }

  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    onChange({})
  }

  const handleQuickSelect = (period) => {
    const now = new Date()
    let start, end

    switch (period) {
      case "today":
        start = new Date(now.setHours(0, 0, 0, 0))
        end = new Date()
        break
      case "yesterday":
        start = new Date(now)
        start.setDate(start.getDate() - 1)
        start.setHours(0, 0, 0, 0)
        end = new Date(now)
        end.setDate(end.getDate() - 1)
        end.setHours(23, 59, 59, 999)
        break
      case "this-week":
        start = new Date(now)
        start.setDate(start.getDate() - start.getDay())
        start.setHours(0, 0, 0, 0)
        end = new Date()
        break
      case "this-month":
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        end = new Date()
        break
      case "last-month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
        break
      default:
        start = undefined
        end = undefined
    }

    if (start && end) {
      setStartDate(start.toISOString().split("T")[0])
      setEndDate(end.toISOString().split("T")[0])
      onChange({ startDate: start, endDate: end })
    } else {
      handleReset()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="End Date"
          />
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickSelect("today")}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => handleQuickSelect("this-week")}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
          >
            This Week
          </button>
          <button
            onClick={() => handleQuickSelect("this-month")}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
          >
            This Month
          </button>
          <button
            onClick={() => handleQuickSelect("last-month")}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
          >
            Last Month
          </button>
        </div>
      </div>
    </div>
  )
}
