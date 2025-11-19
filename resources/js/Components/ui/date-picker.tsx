"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"


interface DatePickerProps {
    value?: Date | null;
    onChange?: (date: Date | null) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
    const [date, setDate] = React.useState<Date | null>(value ?? null);

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const local = new Date(selectedDate);
            local.setHours(12, 0, 0, 0);
            setDate(local);
            onChange?.(local);
            return;
        }

        setDate(null);
        onChange?.(null);
    };
    console.log("value DatePicker", value);


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date ?? undefined} onSelect={handleSelect} />
            </PopoverContent>
        </Popover>
    )
}
