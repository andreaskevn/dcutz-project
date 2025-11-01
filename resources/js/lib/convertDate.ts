import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fungsi helper standar Shadcn untuk menggabungkan classname Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Mengonversi string tanggal menjadi format yang mudah dibaca.
 * @param dateString String tanggal ISO atau yang valid (misal: dari 'waktu_presensi').
 * @param format Format string. Mendukung:
 * - "dd Mmm yyyy HH:mm:ss" (contoh: 02 Nov 2025 06:07:07)
 * - "Hari, dd Bulan yyyy HH:mm" (contoh: Selasa, 31 Oktober 2024 12:11)
 * - "dd Mmm yyyy" (contoh: 02 Nov 2025)
 * @returns String tanggal yang sudah diformat.
 */
export function convertDate(dateString: string, format: string): string {
    const d = new Date(dateString);

    // Helper untuk menambahkan '0' di depan angka satuan
    const pad = (num: number): string => num.toString().padStart(2, "0");

    // Daftar nama hari dan bulan dalam Bahasa Indonesia
    const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
    ];
    const monthNamesShort = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Ags",
        "Sep",
        "Okt",
        "Nov",
        "Des",
    ];
    const monthNamesLong = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    // Ekstrak komponen tanggal
    const dayOfWeek = dayNames[d.getDay()]; // Selasa
    const dayOfMonth = pad(d.getDate()); // 31
    const monthShort = monthNamesShort[d.getMonth()]; // Okt
    const monthLong = monthNamesLong[d.getMonth()]; // Oktober
    const year = d.getFullYear(); // 2024
    const hour = pad(d.getHours()); // 12
    const minute = pad(d.getMinutes()); // 11
    const second = pad(d.getSeconds()); // 07

    // Logika pemilihan format
    switch (format) {
        case "Hari, dd Bulan yyyy HH:mm":
            return `${dayOfWeek}, ${dayOfMonth} ${monthLong} ${year} ${hour}:${minute}`;

        case "dd Mmm yyyy HH:mm:ss":
            return `${dayOfMonth} ${monthShort} ${year} ${hour}:${minute}:${second}`;

        case "dd Mmm yyyy":
            return `${dayOfMonth} ${monthShort} ${year}`;

        default:
            // Fallback jika format tidak dikenali
            return d.toLocaleString("id-ID");
    }
}
